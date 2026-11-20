/**
 * 02_Setup.gs — Provisionamento (corra UMA vez).
 *
 * Execute a função `setup()` a partir do editor do Apps Script.
 * Ela cria o Google Form, a Google Sheet ligada, as colunas de aprovação,
 * o segredo HMAC e os triggers. No fim imprime os URLs no Log (Ver > Logs).
 *
 * Depois do setup, publique o projeto como "Web App" (ver README) para que
 * os links de Aprovar/Rejeitar dos emails funcionem.
 */
function setup() {
  const props = PropertiesService.getScriptProperties();

  // Evita duplicar se já tiver corrido.
  if (props.getProperty(PROP.FORM_ID)) {
    throw new Error('O setup já foi executado. Use reset() primeiro se quiser recriar tudo.');
  }

  // 1) Spreadsheet (destino das respostas)
  const ss = SpreadsheetApp.create(CONFIG.SHEET_TITLE);

  // 2) Formulário
  const form = FormApp.create(CONFIG.FORM_TITLE);
  form
    .setDescription(
      'Formulário interno da ' + CONFIG.ORG_NAME + ' para registo de Onboarding e Offboarding de colaboradores.\n' +
      'As secções de ICT (Laptop) e Administração (Celular + SIM Card) são submetidas a aprovação.')
    .setCollectEmail(true)                 // regista o email de quem submete (o requisitante)
    .setProgressBar(true)
    .setAllowResponseEdits(false)
    .setConfirmationMessage(
      'Pedido submetido com sucesso. Os pedidos de ICT e/ou Administração seguem agora para aprovação. ' +
      'Será notificado por email da decisão.');

  buildForm_(form);

  // 3) Ligar formulário ao Spreadsheet
  form.setDestination(FormApp.DestinationType.SPREADSHEET, ss.getId());
  SpreadsheetApp.flush();

  // 4) Guardar IDs + segredo
  props.setProperty(PROP.FORM_ID, form.getId());
  props.setProperty(PROP.SHEET_ID, ss.getId());
  ensureSecret_();

  // 5) Colunas de aprovação + formatação
  ensureApprovalColumns_(ss);
  formatResponsesSheet_(ss);

  // 6) Triggers (onFormSubmit) + menu do Sheet
  createTriggers_(form, ss);

  // 7) Resultado
  const out =
    '\n==================== SETUP CONCLUÍDO ====================\n' +
    'Formulário (preencher):  ' + form.getPublishedUrl() + '\n' +
    'Formulário (editar):     ' + form.getEditUrl() + '\n' +
    'Folha de cálculo:        ' + ss.getUrl() + '\n' +
    '--------------------------------------------------------\n' +
    'PRÓXIMO PASSO: publique como Web App (Implementar > Nova implementação > Web app)\n' +
    'para activar os links de Aprovar/Rejeitar. Ver README.\n' +
    '========================================================\n';
  Logger.log(out);
  return out;
}

/** Constrói todas as secções e perguntas do formulário. */
function buildForm_(form) {
  // ---- Secção 0: Tipo de Processo ----------------------------------------
  form.addListItem()
    .setTitle(Q.PROCESS_TYPE)
    .setHelpText('Indique se este registo é uma entrada (Onboarding) ou saída (Offboarding) de colaborador.')
    .setChoiceValues(['Onboarding', 'Offboarding'])
    .setRequired(true);

  // ---- Secção 1: Recursos Humanos (RH) -----------------------------------
  form.addPageBreakItem()
    .setTitle('1. Recursos Humanos (RH)')
    .setHelpText('Dados do colaborador. Todos os campos são obrigatórios.');

  form.addTextItem().setTitle(Q.FIRST_NAME).setRequired(true);
  form.addTextItem().setTitle(Q.LAST_NAME).setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle(Q.GENDER)
    .setChoiceValues(['Masculino', 'Feminino', 'Outro', 'Prefiro não indicar'])
    .setRequired(true);

  form.addDateItem().setTitle(Q.DOB).setIncludesYear(true).setRequired(true);

  const emailItem = form.addTextItem().setTitle(Q.PERSONAL_EMAIL)
    .setHelpText('Email pessoal do colaborador.').setRequired(true);
  emailItem.setValidation(
    FormApp.createTextValidation()
      .setHelpText('Introduza um endereço de email válido.')
      .requireTextIsEmail()
      .build());

  form.addDateItem().setTitle(Q.CONTRACT_START).setIncludesYear(true).setRequired(true);
  form.addDateItem().setTitle(Q.CONTRACT_END).setIncludesYear(true).setRequired(true);

  form.addTextItem().setTitle(Q.CONTRACT_ID)
    .setHelpText('Número / referência do contrato.').setRequired(true);

  form.addTextItem().setTitle(Q.MANAGER)
    .setHelpText('Nome do supervisor/gestor directo.').setRequired(true);

  form.addListItem().setTitle(Q.DEPARTMENT)
    .setChoiceValues(CONFIG.DEPARTMENTS).setRequired(true);

  form.addParagraphTextItem().setTitle(Q.REMARKS)
    .setHelpText('Observações relevantes para RH.').setRequired(true);

  // ---- Secção 2: ICT — Pedido de Alocação de Laptop ----------------------
  form.addPageBreakItem()
    .setTitle('2. ICT — Pedido de Alocação de Laptop')
    .setHelpText('Esta secção é aprovada pelo responsável de ICT da ' + CONFIG.ORG_NAME + '.');

  form.addMultipleChoiceItem()
    .setTitle(Q.LAPTOP_NEEDED)
    .setChoiceValues(['Sim', 'Não'])
    .setRequired(true);

  form.addTextItem().setTitle(Q.LAPTOP_TYPE)
    .setHelpText('Ex.: Laptop standard, Workstation, MacBook... (preencher se aplicável).')
    .setRequired(false);

  form.addParagraphTextItem().setTitle(Q.LAPTOP_JUSTIFICATION)
    .setHelpText('Justificação do pedido (ou motivo da devolução em caso de Offboarding).')
    .setRequired(false);

  // ---- Secção 3: Administração — Celular + SIM Card -----------------------
  form.addPageBreakItem()
    .setTitle('3. Administração — Pedido de Alocação de Celular + SIM Card')
    .setHelpText('Esta secção é aprovada pela Administração da ' + CONFIG.ORG_NAME + '.');

  form.addMultipleChoiceItem()
    .setTitle(Q.PHONE_NEEDED)
    .setChoiceValues(['Sim', 'Não'])
    .setRequired(true);

  form.addMultipleChoiceItem()
    .setTitle(Q.SIM_NEEDED)
    .setChoiceValues(['Sim', 'Não'])
    .setRequired(true);

  form.addParagraphTextItem().setTitle(Q.PHONE_NOTES)
    .setHelpText('Plano, operadora, número a manter/devolver, ou outras observações.')
    .setRequired(false);
}

/** Cria os triggers necessários e o menu do Sheet. */
function createTriggers_(form, ss) {
  // Remove triggers antigos deste projeto (idempotente)
  ScriptApp.getProjectTriggers().forEach(function (t) { ScriptApp.deleteTrigger(t); });

  // onFormSubmit — a partir da Spreadsheet (dá-nos a linha exacta)
  ScriptApp.newTrigger('onFormSubmit').forSpreadsheet(ss).onFormSubmit().create();

  // onOpen — menu de apoio na Spreadsheet
  ScriptApp.newTrigger('onOpenSheet').forSpreadsheet(ss).onOpen().create();
}

/**
 * reset() — apaga triggers e props e move Form/Sheet para o lixo.
 * Use com cuidado: permite correr setup() de novo do zero.
 */
function reset() {
  const props = PropertiesService.getScriptProperties();
  ScriptApp.getProjectTriggers().forEach(function (t) { ScriptApp.deleteTrigger(t); });
  ['FORM_ID', 'SHEET_ID'].forEach(function (k) {
    const id = props.getProperty(PROP[k] || k);
    if (id) { try { DriveApp.getFileById(id).setTrashed(true); } catch (e) {} }
  });
  props.deleteAllProperties();
  Logger.log('Reset concluído. Pode correr setup() novamente.');
}

/** Imprime os URLs atuais (útil após o deploy do Web App). */
function printUrls() {
  const props = PropertiesService.getScriptProperties();
  const form = FormApp.openById(props.getProperty(PROP.FORM_ID));
  const ss = SpreadsheetApp.openById(props.getProperty(PROP.SHEET_ID));
  const out =
    'Formulário (preencher): ' + form.getPublishedUrl() + '\n' +
    'Formulário (editar):    ' + form.getEditUrl() + '\n' +
    'Folha de cálculo:       ' + ss.getUrl() + '\n' +
    'Web App (aprovações):   ' + (safeWebAppUrl_() || '[ainda não publicado]') + '\n';
  Logger.log(out);
  return out;
}

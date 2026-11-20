/**
 * 03_FormHandler.gs — Disparado a cada submissão do formulário.
 *
 * Decide que aprovações são necessárias, marca o estado no Sheet (PENDENTE/N/A)
 * e envia os pedidos de aprovação por email (ICT e/ou Administração).
 */
function onFormSubmit(e) {
  const ss = openSheetSS_();
  const sheet = getResponsesSheet_(ss);
  ensureApprovalColumns_(ss);

  const row = e.range.getRow();
  const nv = e.namedValues || {};
  const headers = getHeaders_(sheet);

  const wantsIct = isYes_(val_(nv, Q.LAPTOP_NEEDED));
  const wantsAdm = isYes_(val_(nv, Q.PHONE_NEEDED)) || isYes_(val_(nv, Q.SIM_NEEDED));

  // Estado inicial
  setCell_(sheet, row, headers, COLS.ICT_STATUS, wantsIct ? STATUS.PENDING : STATUS.NA);
  setCell_(sheet, row, headers, COLS.ADM_STATUS, wantsAdm ? STATUS.PENDING : STATUS.NA);

  // Pedidos de aprovação
  if (wantsIct) sendApprovalRequest_('ICT', row, nv);
  if (wantsAdm) sendApprovalRequest_('ADM', row, nv);

  // Notifica RH da nova submissão
  notifyHr_('Nova submissão — ' + fullName_(nv),
    buildSubmissionSummaryHtml_(nv, wantsIct, wantsAdm, row));
}

/** "Sim" / "Não" tolerante a maiúsculas e espaços. */
function isYes_(v) {
  return String(v || '').trim().toLowerCase().indexOf('sim') === 0;
}

/** Lê o valor de uma pergunta a partir do objeto namedValues. */
function val_(nv, title) {
  const v = nv[title];
  if (Array.isArray(v)) return v.join(', ');
  return v == null ? '' : String(v);
}

function fullName_(nv) {
  return (val_(nv, Q.FIRST_NAME) + ' ' + val_(nv, Q.LAST_NAME)).trim() || '(sem nome)';
}

/** Resumo HTML dos dados de RH, reutilizado em emails. */
function buildRhRowsHtml_(nv) {
  const fields = [
    [Q.PROCESS_TYPE, val_(nv, Q.PROCESS_TYPE)],
    ['Nome completo', fullName_(nv)],
    [Q.GENDER, val_(nv, Q.GENDER)],
    [Q.DOB, val_(nv, Q.DOB)],
    [Q.PERSONAL_EMAIL, val_(nv, Q.PERSONAL_EMAIL)],
    [Q.CONTRACT_START, val_(nv, Q.CONTRACT_START)],
    [Q.CONTRACT_END, val_(nv, Q.CONTRACT_END)],
    [Q.CONTRACT_ID, val_(nv, Q.CONTRACT_ID)],
    [Q.MANAGER, val_(nv, Q.MANAGER)],
    [Q.DEPARTMENT, val_(nv, Q.DEPARTMENT)],
    [Q.REMARKS, val_(nv, Q.REMARKS)],
  ];
  return fields.map(function (f) {
    return '<tr><td style="padding:4px 10px;color:#555;white-space:nowrap">' + esc_(f[0]) +
      '</td><td style="padding:4px 10px"><b>' + esc_(f[1] || '—') + '</b></td></tr>';
  }).join('');
}

function buildSubmissionSummaryHtml_(nv, wantsIct, wantsAdm, row) {
  return card_(
    'Nova submissão de ' + CONFIG.ORG_NAME + ' RH',
    '<table style="border-collapse:collapse;font-size:14px">' + buildRhRowsHtml_(nv) + '</table>' +
    '<p style="font-size:14px;margin-top:14px">' +
    'Aprovação ICT (Laptop): <b>' + (wantsIct ? 'necessária' : 'não aplicável') + '</b><br>' +
    'Aprovação Administração (Celular/SIM): <b>' + (wantsAdm ? 'necessária' : 'não aplicável') + '</b></p>' +
    '<p style="font-size:12px;color:#888">Linha #' + row + ' na folha de respostas.</p>');
}

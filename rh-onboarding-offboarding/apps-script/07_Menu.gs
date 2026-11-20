/**
 * 07_Menu.gs — Menu de apoio dentro da folha de cálculo.
 */
function onOpenSheet() {
  SpreadsheetApp.getUi()
    .createMenu(CONFIG.ORG_NAME + ' RH')
    .addItem('Mostrar URLs (Form / Web App)', 'menuShowUrls_')
    .addItem('Reenviar aprovações pendentes da linha selecionada', 'menuResendSelected_')
    .addToUi();
}

function menuShowUrls_() {
  SpreadsheetApp.getUi().alert(printUrls());
}

/** Reenvia o pedido de aprovação para a linha onde o cursor está. */
function menuResendSelected_() {
  const ss = openSheetSS_();
  const sheet = getResponsesSheet_(ss);
  const row = sheet.getActiveRange().getRow();
  if (row < 2) { SpreadsheetApp.getUi().alert('Selecione uma linha de resposta (>= 2).'); return; }

  const headers = getHeaders_(sheet);
  const nv = {};
  headers.forEach(function (h, i) { nv[h] = String(sheet.getRange(row, i + 1).getValue()); });

  let sent = [];
  if (getCell_(sheet, row, headers, COLS.ICT_STATUS) === STATUS.PENDING) { sendApprovalRequest_('ICT', row, nv); sent.push('ICT'); }
  if (getCell_(sheet, row, headers, COLS.ADM_STATUS) === STATUS.PENDING) { sendApprovalRequest_('ADM', row, nv); sent.push('ADM'); }

  SpreadsheetApp.getUi().alert(sent.length
    ? 'Pedidos reenviados: ' + sent.join(', ')
    : 'Nenhuma aprovação pendente nesta linha.');
}

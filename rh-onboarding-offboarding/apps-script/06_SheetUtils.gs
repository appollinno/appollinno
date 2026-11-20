/**
 * 06_SheetUtils.gs — Utilitários da folha de respostas.
 */

function openSheetSS_() {
  return SpreadsheetApp.openById(PropertiesService.getScriptProperties().getProperty(PROP.SHEET_ID));
}

/** Devolve a folha ligada ao formulário (a que tem URL de formulário). */
function getResponsesSheet_(ss) {
  const sheets = ss.getSheets();
  for (var i = 0; i < sheets.length; i++) {
    if (sheets[i].getFormUrl()) return sheets[i];
  }
  return sheets[0];
}

/** Cabeçalhos (linha 1) como array. */
function getHeaders_(sheet) {
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
}

/** Índice (1-based) de uma coluna pelo cabeçalho; 0 se não existir. */
function colIndex_(headers, name) {
  for (var i = 0; i < headers.length; i++) if (headers[i] === name) return i + 1;
  return 0;
}

function getCell_(sheet, row, headers, headerName) {
  const c = colIndex_(headers, headerName);
  return c ? sheet.getRange(row, c).getValue() : '';
}

function setCell_(sheet, row, headers, headerName, value) {
  const c = colIndex_(headers, headerName);
  if (c) sheet.getRange(row, c).setValue(value);
}

/** Garante que as 8 colunas de aprovação existem à direita. */
function ensureApprovalColumns_(ss) {
  const sheet = getResponsesSheet_(ss);
  let headers = getHeaders_(sheet);
  const needed = [
    COLS.ICT_STATUS, COLS.ICT_APPROVER, COLS.ICT_DECISION_DATE, COLS.ICT_COMMENT,
    COLS.ADM_STATUS, COLS.ADM_APPROVER, COLS.ADM_DECISION_DATE, COLS.ADM_COMMENT,
  ];
  needed.forEach(function (name) {
    if (colIndex_(headers, name) === 0) {
      const col = sheet.getLastColumn() + 1;
      sheet.getRange(1, col).setValue(name);
      headers = getHeaders_(sheet);
    }
  });
}

/** Formatação visual: cabeçalho e cores condicionais nos estados. */
function formatResponsesSheet_(ss) {
  const sheet = getResponsesSheet_(ss);
  const headers = getHeaders_(sheet);
  const lastCol = sheet.getLastColumn();

  // Cabeçalho
  sheet.getRange(1, 1, 1, lastCol)
    .setBackground(CONFIG.BRAND_COLOR).setFontColor('#ffffff').setFontWeight('bold');
  sheet.setFrozenRows(1);

  // Cores condicionais nas colunas de estado
  const statusCols = [COLS.ICT_STATUS, COLS.ADM_STATUS].map(function (n) { return colIndex_(headers, n); });
  const rules = sheet.getConditionalFormatRules();
  statusCols.forEach(function (c) {
    if (!c) return;
    const range = sheet.getRange(2, c, sheet.getMaxRows() - 1, 1);
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(STATUS.PENDING).setBackground('#fff3cd').setFontColor('#856404').setRanges([range]).build());
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(STATUS.APPROVED).setBackground('#d4edda').setFontColor('#155724').setRanges([range]).build());
    rules.push(SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(STATUS.REJECTED).setBackground('#f8d7da').setFontColor('#721c24').setRanges([range]).build());
  });
  sheet.setConditionalFormatRules(rules);
}

/**
 * 04_Approval.gs — Web App de aprovação (links dos emails).
 *
 * Fluxo seguro em 2 passos para evitar aprovações automáticas por
 * pré-carregamento de links em clientes de email:
 *   doGet  -> mostra página de confirmação (com botão + caixa de comentário)
 *   doPost -> aplica a decisão no Sheet e notifica o requisitante + RH
 *
 * Os links são assinados com HMAC-SHA256 (token) e verificados nos dois passos.
 */

// ---------- TOKEN (HMAC) ----------------------------------------------------
function getSecret_() {
  return PropertiesService.getScriptProperties().getProperty(PROP.SECRET);
}
function ensureSecret_() {
  const props = PropertiesService.getScriptProperties();
  if (!props.getProperty(PROP.SECRET)) {
    props.setProperty(PROP.SECRET, Utilities.getUuid() + Utilities.getUuid());
  }
}
function makeToken_(row, type, action) {
  const raw = [row, type, action].join('|');
  const sig = Utilities.computeHmacSha256Signature(raw, getSecret_());
  return Utilities.base64EncodeWebSafe(sig);
}
function verifyToken_(row, type, action, token) {
  if (!token) return false;
  const expected = makeToken_(row, type, action);
  // comparação em tempo ~constante
  if (expected.length !== token.length) return false;
  var diff = 0;
  for (var i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ token.charCodeAt(i);
  return diff === 0;
}

function safeWebAppUrl_() {
  try { return ScriptApp.getService().getUrl(); } catch (e) { return ''; }
}

// ---------- WEB APP ---------------------------------------------------------
function doGet(e) {
  const p = e.parameter || {};
  const row = Number(p.row), type = p.type, action = p.action, token = p.token;

  if (!verifyToken_(row, type, action, token)) {
    return htmlResponse_(resultPage_('Link inválido', 'Este link de aprovação é inválido ou já não é válido.', '#b00020'));
  }

  const ss = openSheetSS_();
  const sheet = getResponsesSheet_(ss);
  const headers = getHeaders_(sheet);
  const statusCol = (type === 'ICT') ? COLS.ICT_STATUS : COLS.ADM_STATUS;
  const current = getCell_(sheet, row, headers, statusCol);

  if (current !== STATUS.PENDING) {
    return htmlResponse_(resultPage_('Já processado',
      'Este pedido já se encontra no estado: <b>' + esc_(current) + '</b>.', '#555'));
  }

  // Página de confirmação -> POST
  return htmlResponse_(confirmPage_(row, type, action, token, sheet, headers));
}

function doPost(e) {
  const p = e.parameter || {};
  const row = Number(p.row), type = p.type, action = p.action, token = p.token;
  const comment = (p.comment || '').toString().slice(0, 1000);

  if (!verifyToken_(row, type, action, token)) {
    return htmlResponse_(resultPage_('Link inválido', 'Token inválido.', '#b00020'));
  }

  const lock = LockService.getScriptLock();
  try { lock.waitLock(15000); } catch (err) {
    return htmlResponse_(resultPage_('Em processamento', 'Tente novamente dentro de instantes.', '#555'));
  }

  try {
    const ss = openSheetSS_();
    const sheet = getResponsesSheet_(ss);
    const headers = getHeaders_(sheet);
    const isIct = (type === 'ICT');
    const statusCol = isIct ? COLS.ICT_STATUS : COLS.ADM_STATUS;

    if (getCell_(sheet, row, headers, statusCol) !== STATUS.PENDING) {
      return htmlResponse_(resultPage_('Já processado', 'Este pedido já foi decidido por outra pessoa.', '#555'));
    }

    const decision = (action === 'approve') ? STATUS.APPROVED : STATUS.REJECTED;
    const approver = (Session.getActiveUser().getEmail()) ||
      (isIct ? CONFIG.ICT_APPROVER_EMAIL : CONFIG.ADMIN_APPROVER_EMAIL);
    const now = new Date();

    setCell_(sheet, row, headers, statusCol, decision);
    setCell_(sheet, row, headers, isIct ? COLS.ICT_APPROVER : COLS.ADM_APPROVER, approver);
    setCell_(sheet, row, headers, isIct ? COLS.ICT_DECISION_DATE : COLS.ADM_DECISION_DATE, now);
    if (comment) setCell_(sheet, row, headers, isIct ? COLS.ICT_COMMENT : COLS.ADM_COMMENT, comment);

    notifyDecision_(type, decision, row, approver, comment);

    const color = (decision === STATUS.APPROVED) ? '#1e7e34' : '#b00020';
    return htmlResponse_(resultPage_(
      'Decisão registada',
      'O pedido de <b>' + sectionLabel_(type) + '</b> foi <b>' + esc_(decision) +
      '</b>.<br>Obrigado. O requisitante e o RH foram notificados.', color));
  } finally {
    lock.releaseLock();
  }
}

function sectionLabel_(type) {
  return type === 'ICT' ? 'ICT (Laptop)' : 'Administração (Celular + SIM Card)';
}

// ---------- PÁGINAS HTML ----------------------------------------------------
function confirmPage_(row, type, action, token, sheet, headers) {
  const isApprove = (action === 'approve');
  const actionWord = isApprove ? 'APROVAR' : 'REJEITAR';
  const color = isApprove ? CONFIG.BRAND_COLOR : '#b00020';
  const name = esc_(getCell_(sheet, row, headers, Q.FIRST_NAME) + ' ' + getCell_(sheet, row, headers, Q.LAST_NAME));
  const dept = esc_(getCell_(sheet, row, headers, Q.DEPARTMENT));
  const url = safeWebAppUrl_();

  return pageShell_('Confirmar decisão',
    '<h2 style="margin:0 0 4px">' + actionWord + ' — ' + sectionLabel_(type) + '</h2>' +
    '<p style="color:#555;margin:0 0 16px">Colaborador: <b>' + name + '</b> · Departamento: <b>' + dept + '</b></p>' +
    '<form method="post" action="' + url + '">' +
    '<input type="hidden" name="row" value="' + row + '">' +
    '<input type="hidden" name="type" value="' + esc_(type) + '">' +
    '<input type="hidden" name="action" value="' + esc_(action) + '">' +
    '<input type="hidden" name="token" value="' + esc_(token) + '">' +
    '<label style="display:block;font-size:14px;color:#555;margin-bottom:6px">Comentário (opcional):</label>' +
    '<textarea name="comment" rows="3" style="width:100%;box-sizing:border-box;padding:8px;border:1px solid #ccc;border-radius:6px"></textarea>' +
    '<button type="submit" style="margin-top:16px;background:' + color + ';color:#fff;border:0;padding:12px 22px;' +
    'border-radius:6px;font-size:15px;cursor:pointer">Confirmar ' + actionWord + '</button>' +
    '</form>');
}

function resultPage_(title, bodyHtml, color) {
  return pageShell_(title,
    '<h2 style="margin:0 0 10px;color:' + (color || CONFIG.BRAND_COLOR) + '">' + esc_(title) + '</h2>' +
    '<p style="font-size:15px;line-height:1.5">' + bodyHtml + '</p>');
}

function pageShell_(title, inner) {
  return '<!doctype html><html lang="pt"><head><meta charset="utf-8">' +
    '<meta name="viewport" content="width=device-width, initial-scale=1">' +
    '<title>' + esc_(title) + ' — ' + CONFIG.ORG_NAME + '</title></head>' +
    '<body style="margin:0;background:#f4f6f9;font-family:Arial,Helvetica,sans-serif;color:#222">' +
    '<div style="max-width:560px;margin:40px auto;background:#fff;border-radius:12px;overflow:hidden;' +
    'box-shadow:0 2px 14px rgba(0,0,0,.08)">' +
    '<div style="background:' + CONFIG.BRAND_COLOR + ';color:#fff;padding:16px 24px;font-weight:bold">' +
    CONFIG.ORG_NAME + ' — Onboarding &amp; Offboarding</div>' +
    '<div style="padding:24px">' + inner + '</div></div></body></html>';
}

function htmlResponse_(html) {
  return HtmlService.createHtmlOutput(html).setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}

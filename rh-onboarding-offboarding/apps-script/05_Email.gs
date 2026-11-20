/**
 * 05_Email.gs — Envio de emails (pedidos e decisões).
 */

/** Envia o pedido de aprovação (ICT ou ADM). */
function sendApprovalRequest_(type, row, nv) {
  const isIct = (type === 'ICT');
  const to = isIct ? CONFIG.ICT_APPROVER_EMAIL : CONFIG.ADMIN_APPROVER_EMAIL;
  const base = safeWebAppUrl_();

  const approveUrl = base + '?row=' + row + '&type=' + type + '&action=approve&token=' +
    encodeURIComponent(makeToken_(row, type, 'approve'));
  const rejectUrl = base + '?row=' + row + '&type=' + type + '&action=reject&token=' +
    encodeURIComponent(makeToken_(row, type, 'reject'));

  const detailRows = isIct
    ? [[Q.LAPTOP_NEEDED, val_(nv, Q.LAPTOP_NEEDED)],
       [Q.LAPTOP_TYPE, val_(nv, Q.LAPTOP_TYPE)],
       [Q.LAPTOP_JUSTIFICATION, val_(nv, Q.LAPTOP_JUSTIFICATION)]]
    : [[Q.PHONE_NEEDED, val_(nv, Q.PHONE_NEEDED)],
       [Q.SIM_NEEDED, val_(nv, Q.SIM_NEEDED)],
       [Q.PHONE_NOTES, val_(nv, Q.PHONE_NOTES)]];

  const detailHtml = detailRows.map(function (f) {
    return '<tr><td style="padding:4px 10px;color:#555;white-space:nowrap">' + esc_(f[0]) +
      '</td><td style="padding:4px 10px"><b>' + esc_(f[1] || '—') + '</b></td></tr>';
  }).join('');

  const btn = function (url, label, color) {
    return '<a href="' + url + '" style="display:inline-block;margin:6px 8px 0 0;background:' + color +
      ';color:#fff;text-decoration:none;padding:12px 22px;border-radius:6px;font-weight:bold">' + label + '</a>';
  };

  const body = card_(
    'Pedido de aprovação — ' + sectionLabel_(type),
    '<p style="font-size:14px">Foi recebido um pedido que requer a sua aprovação.</p>' +
    '<h4 style="margin:14px 0 4px">Dados do colaborador</h4>' +
    '<table style="border-collapse:collapse;font-size:14px">' + buildRhRowsHtml_(nv) + '</table>' +
    '<h4 style="margin:16px 0 4px">Detalhes do pedido</h4>' +
    '<table style="border-collapse:collapse;font-size:14px">' + detailHtml + '</table>' +
    '<div style="margin-top:20px">' +
    btn(approveUrl, 'Aprovar', '#1e7e34') + btn(rejectUrl, 'Rejeitar', '#b00020') + '</div>' +
    (base ? '' : '<p style="color:#b00020;font-size:12px;margin-top:14px">' +
      '⚠ O Web App ainda não foi publicado — os botões não funcionarão até publicar (ver README).</p>'));

  MailApp.sendEmail({
    to: to,
    subject: '[' + CONFIG.ORG_NAME + '] Aprovação ' + sectionLabel_(type) + ' — ' + fullName_(nv),
    htmlBody: body,
  });
}

/** Notifica requisitante + RH da decisão. */
function notifyDecision_(type, decision, row, approver, comment) {
  const ss = openSheetSS_();
  const sheet = getResponsesSheet_(ss);
  const headers = getHeaders_(sheet);

  const requester = getCell_(sheet, row, headers, 'Endereço de email') ||
    getCell_(sheet, row, headers, 'Email Address') || '';
  const name = getCell_(sheet, row, headers, Q.FIRST_NAME) + ' ' + getCell_(sheet, row, headers, Q.LAST_NAME);
  const color = (decision === STATUS.APPROVED) ? '#1e7e34' : '#b00020';

  const body = card_(
    'Decisão — ' + sectionLabel_(type),
    '<p style="font-size:15px">O pedido de <b>' + sectionLabel_(type) + '</b> para <b>' + esc_(name) +
    '</b> foi <b style="color:' + color + '">' + esc_(decision) + '</b>.</p>' +
    '<p style="font-size:14px;color:#555">Decisor: ' + esc_(approver) +
    (comment ? '<br>Comentário: ' + esc_(comment) : '') + '</p>');

  const recipients = [CONFIG.HR_NOTIFY_EMAIL];
  if (requester && recipients.indexOf(requester) === -1) recipients.push(requester);

  MailApp.sendEmail({
    to: recipients.join(','),
    subject: '[' + CONFIG.ORG_NAME + '] ' + decision + ' — ' + sectionLabel_(type) + ' — ' + name,
    htmlBody: body,
  });
}

/** Email simples para RH. */
function notifyHr_(subject, htmlBody) {
  MailApp.sendEmail({
    to: CONFIG.HR_NOTIFY_EMAIL,
    subject: '[' + CONFIG.ORG_NAME + '] ' + subject,
    htmlBody: htmlBody,
  });
}

// ---------- Helpers de apresentação ----------------------------------------
function card_(title, innerHtml) {
  return '<div style="font-family:Arial,Helvetica,sans-serif;max-width:620px;margin:0 auto;' +
    'border:1px solid #e3e6ea;border-radius:12px;overflow:hidden">' +
    '<div style="background:' + CONFIG.BRAND_COLOR + ';color:#fff;padding:16px 24px;font-size:16px;font-weight:bold">' +
    CONFIG.ORG_NAME + ' — ' + esc_(title) + '</div>' +
    '<div style="padding:22px 24px;color:#222">' + innerHtml + '</div>' +
    '<div style="padding:12px 24px;background:#f4f6f9;color:#999;font-size:12px">' +
    'Mensagem automática do sistema de Onboarding &amp; Offboarding.</div></div>';
}

function esc_(s) {
  return String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

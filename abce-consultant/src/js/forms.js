/**
 * Contact / quotation form.
 *
 * Honesty contract — this matters more than the validation:
 * There is no backend and no email service wired into this build, so the form
 * NEVER claims a message was sent. On a valid submit it hands the enquiry to
 * the visitor's own email client via a mailto: link, and the status message
 * says plainly that nothing was transmitted by the website and that the
 * visitor must press send themselves. A copy-to-clipboard fallback covers
 * devices with no mail client configured.
 *
 * To wire a real backend later, add an endpoint to the form element:
 *     <form data-contact-form data-endpoint="https://api.example.com/enquiries">
 * The form will then POST JSON there and report the real result. Nothing else
 * needs to change.
 */

const RULES = {
  name: {
    required: true,
    test: (v) => v.trim().length >= 2,
    message: 'Enter your name.',
  },
  company: {
    required: true,
    test: (v) => v.trim().length >= 2,
    message: 'Enter your company or organisation.',
  },
  email: {
    required: true,
    // Deliberately permissive: the only reliable validator is a delivery attempt.
    test: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()),
    message: 'Enter a valid email address, for example name@company.com.',
  },
  telephone: {
    required: false,
    test: (v) => v.trim() === '' || /^[+\d][\d\s()\-.]{6,}$/.test(v.trim()),
    message: 'Enter a telephone number, or leave this blank.',
  },
  category: {
    required: true,
    test: (v) => v !== '',
    message: 'Choose the category your enquiry relates to.',
  },
  subject: {
    required: true,
    test: (v) => v.trim().length >= 3,
    message: 'Add a short subject.',
  },
  message: {
    required: true,
    test: (v) => v.trim().length >= 20,
    message: 'Describe what you need — at least 20 characters, including specification and quantity if you have them.',
  },
};

export function initContactForm() {
  const form = document.querySelector('[data-contact-form]');
  if (!form) return;

  const status = form.querySelector('[data-form-status]');
  const submit = form.querySelector('[data-form-submit]');
  const endpoint = form.dataset.endpoint || '';

  // Take over validation from the browser so messages are consistent and
  // styled, but keep the `required` attributes in the HTML for no-JS users.
  form.setAttribute('novalidate', '');

  const fields = [...form.querySelectorAll('[data-rule]')];

  fields.forEach((input) => {
    // Validate on blur, then live-clear the error once it is corrected.
    input.addEventListener('blur', () => validateField(input));
    input.addEventListener('input', () => {
      if (input.closest('.field')?.classList.contains('has-error')) validateField(input);
    });
  });

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const invalid = fields.filter((input) => !validateField(input));
    if (invalid.length) {
      showStatus(
        status,
        'error',
        'Check the form',
        `${invalid.length} ${invalid.length === 1 ? 'field needs' : 'fields need'} attention. The first one has been focused.`,
      );
      invalid[0].focus();
      return;
    }

    const data = collect(form);

    if (endpoint) {
      await submitToEndpoint({ endpoint, data, form, status, submit });
      return;
    }

    handOffToMailClient({ data, status });
  });

  // Copy-to-clipboard fallback, for a device with no mail client.
  form.querySelector('[data-copy-enquiry]')?.addEventListener('click', async (event) => {
    event.preventDefault();
    const invalid = fields.filter((input) => !validateField(input));
    if (invalid.length) {
      invalid[0].focus();
      showStatus(status, 'error', 'Check the form', 'Complete the form before copying the enquiry.');
      return;
    }
    const text = plainText(collect(form));
    try {
      await navigator.clipboard.writeText(text);
      showStatus(
        status,
        'ok',
        'Enquiry copied to your clipboard',
        `Paste it into an email to ${data_email()} — nothing has been sent from this website.`,
      );
    } catch {
      showStatus(
        status,
        'error',
        'Could not copy automatically',
        `Your browser blocked clipboard access. Select the text in the message field and copy it manually, then email it to ${data_email()}.`,
      );
    }
  });
}

const data_email = () =>
  document.querySelector('[data-company-email]')?.textContent?.trim() || 'General@abceconsu.com';

/* ----------------------------------------------------------- validation */
function validateField(input) {
  const rule = RULES[input.dataset.rule];
  const wrap = input.closest('.field');
  const error = wrap?.querySelector('.field__error');
  if (!rule) return true;

  const ok = rule.test(input.value);

  wrap?.classList.toggle('has-error', !ok);
  input.setAttribute('aria-invalid', ok ? 'false' : 'true');
  if (error) error.textContent = ok ? '' : rule.message;

  return ok;
}

/* -------------------------------------------------------------- collect */
function collect(form) {
  const get = (name) => form.querySelector(`[name="${name}"]`)?.value?.trim() ?? '';
  return {
    name: get('name'),
    company: get('company'),
    email: get('email'),
    telephone: get('telephone'),
    category: get('category'),
    subject: get('subject'),
    message: get('message'),
  };
}

function plainText(d) {
  return [
    `Name:      ${d.name}`,
    `Company:   ${d.company}`,
    `Email:     ${d.email}`,
    `Telephone: ${d.telephone || '—'}`,
    `Category:  ${d.category}`,
    '',
    d.message,
  ].join('\n');
}

/* ------------------------------------------------------- mailto hand-off */
function handOffToMailClient({ data, status }) {
  const href =
    `mailto:${data_email()}` +
    `?subject=${encodeURIComponent(`Quotation request — ${data.subject}`)}` +
    `&body=${encodeURIComponent(plainText(data))}`;

  // mailto: has a practical URL length limit; above it, go straight to the
  // clipboard route rather than silently truncating the enquiry.
  if (href.length > 1800) {
    showStatus(
      status,
      'error',
      'Your enquiry is too long for an email link',
      `Use "Copy enquiry" below and paste it into an email to ${data_email()}. Nothing has been sent from this website.`,
    );
    return;
  }

  window.location.href = href;

  showStatus(
    status,
    'ok',
    'Your email program is opening with this enquiry',
    `Nothing has been sent by this website — please press send in your email program. ` +
      `If it did not open, use "Copy enquiry" below, or write to ${data_email()} directly.`,
  );
}

/* --------------------------------------------- real backend, if configured */
async function submitToEndpoint({ endpoint, data, form, status, submit }) {
  const original = submit?.innerHTML;
  submit?.setAttribute('aria-disabled', 'true');
  if (submit) submit.innerHTML = '<span class="btn__spinner" aria-hidden="true"></span> Sending';

  try {
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    form.reset();
    showStatus(
      status,
      'ok',
      'Enquiry received',
      'Thank you — your enquiry has been sent and we will come back to you.',
    );
  } catch (err) {
    showStatus(
      status,
      'error',
      'Your enquiry was not sent',
      `Something went wrong submitting the form (${err.message}). Please email ${data_email()} directly so your request is not lost.`,
    );
  } finally {
    submit?.removeAttribute('aria-disabled');
    if (submit && original) submit.innerHTML = original;
  }
}

/* --------------------------------------------------------------- status */
function showStatus(el, kind, heading, body) {
  if (!el) return;
  el.hidden = false;
  el.classList.toggle('form-status--error', kind === 'error');
  el.innerHTML = '';

  const strong = document.createElement('strong');
  strong.textContent = heading;
  const p = document.createElement('p');
  p.textContent = body;

  el.append(strong, p);
  el.setAttribute('role', 'status');
  el.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
}

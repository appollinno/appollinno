/**
 * Quotation request list.
 *
 * Lets a visitor collect catalogue items while they browse, then carry that
 * list into the contact form. The list is per-browser and never leaves the
 * device until the visitor sends the enquiry themselves — consistent with
 * the rest of the site, which has no backend and does not pretend otherwise.
 *
 * Storage can throw (private mode, blocked site data), so every read and
 * write is guarded and the feature degrades to "works until you navigate".
 */
const KEY = 'abce-request';
const MAX = 80;

const read = () => {
  try {
    const raw = JSON.parse(localStorage.getItem(KEY) ?? '[]');
    return Array.isArray(raw) ? raw.filter((i) => i && typeof i.name === 'string') : [];
  } catch {
    return [];
  }
};

const write = (items) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(items.slice(0, MAX)));
  } catch { /* the list simply will not outlive this page */ }
};

/** Plain-text rendering, used for the contact form message. */
export function requestAsText(items = read()) {
  if (!items.length) return '';
  const byStream = new Map();
  for (const i of items) {
    if (!byStream.has(i.stream)) byStream.set(i.stream, []);
    byStream.get(i.stream).push(i.name);
  }
  return [...byStream.entries()]
    .map(([stream, names]) => `${stream}\n${names.map((n) => `  - ${n}`).join('\n')}`)
    .join('\n\n');
}

export function initRequestList() {
  let items = read();

  const dock = document.querySelector('[data-request-dock]');
  const panel = document.querySelector('[data-request-panel]');
  const countEl = document.querySelector('[data-request-count]');
  const listEl = document.querySelector('[data-request-list]');
  const emptyEl = document.querySelector('[data-request-empty]');
  const noteEl = document.querySelector('[data-request-note]');
  const live = document.querySelector('[data-request-live]');
  const addButtons = [...document.querySelectorAll('[data-add-item]')];

  const has = (name) => items.some((i) => i.name === name);

  const announce = (msg) => { if (live) live.textContent = msg; };

  const syncAddButtons = () => {
    for (const btn of addButtons) {
      const added = has(btn.dataset.addItem);
      btn.setAttribute('aria-pressed', String(added));
      const label = btn.querySelector('.cat-item__addLabel');
      if (label) label.textContent = added ? btn.dataset.labelAdded : btn.dataset.labelAdd;
    }
  };

  const renderPanel = () => {
    if (!listEl) return;
    listEl.innerHTML = '';
    for (const item of items) {
      const li = document.createElement('li');
      li.className = 'request-item';

      const text = document.createElement('span');
      text.className = 'request-item__text';
      const name = document.createElement('span');
      name.className = 'request-item__name';
      name.textContent = item.name;
      const meta = document.createElement('span');
      meta.className = 'request-item__meta';
      meta.textContent = item.stream;
      text.append(name, meta);

      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'request-item__remove';
      remove.textContent = panel?.dataset.labelRemove ?? 'Remove';
      remove.addEventListener('click', () => {
        items = items.filter((i) => i.name !== item.name);
        persist();
        announce(`${item.name} ${panel?.dataset.labelRemoved ?? 'removed'}`);
        // Keep focus somewhere sensible after the row disappears.
        (listEl.querySelector('.request-item__remove') ?? panel?.querySelector('[data-request-close]'))?.focus();
      });

      li.append(text, remove);
      listEl.append(li);
    }

    const any = items.length > 0;
    if (emptyEl) emptyEl.hidden = any;
    if (noteEl) noteEl.hidden = !any;
    listEl.hidden = !any;
  };

  const persist = () => {
    write(items);
    if (countEl) countEl.textContent = String(items.length);
    if (dock) dock.hidden = items.length === 0;
    syncAddButtons();
    renderPanel();
  };

  // --- add / remove from the catalogue ---------------------------------
  for (const btn of addButtons) {
    btn.addEventListener('click', () => {
      const name = btn.dataset.addItem;
      const stream = btn.dataset.addStream;
      if (has(name)) {
        items = items.filter((i) => i.name !== name);
        announce(`${name} ${panel?.dataset.labelRemoved ?? 'removed'}`);
      } else {
        if (items.length >= MAX) return;
        items.push({ name, stream });
        announce(`${name} ${panel?.dataset.labelAdded ?? 'added'}`);
      }
      persist();
    });
  }

  // --- panel ------------------------------------------------------------
  document.querySelector('[data-request-open]')?.addEventListener('click', () => {
    if (typeof panel?.showModal === 'function') panel.showModal();
    else panel?.setAttribute('open', '');
  });
  document.querySelector('[data-request-close]')?.addEventListener('click', () => panel?.close());
  // Clicking the backdrop (outside the panel's own box) closes it.
  panel?.addEventListener('click', (event) => {
    if (event.target === panel) panel.close();
  });
  document.querySelector('[data-request-clear]')?.addEventListener('click', () => {
    items = [];
    persist();
    announce(panel?.dataset.labelCleared ?? '');
    panel?.querySelector('[data-request-close]')?.focus();
  });

  persist();

  // --- hand the list to the contact form --------------------------------
  const message = document.querySelector('#f-message');
  if (message && items.length && !message.value.trim()) {
    const intro = message.dataset.requestIntro ?? '';
    message.value = `${intro ? intro + '\n\n' : ''}${requestAsText(items)}\n\n`;
    const notice = document.querySelector('[data-request-prefilled]');
    if (notice) notice.hidden = false;
    // Put the caret at the end so they can type straight away.
    message.setSelectionRange(message.value.length, message.value.length);
  }
}

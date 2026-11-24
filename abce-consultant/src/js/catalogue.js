/**
 * Catalogue search and stream filtering.
 *
 * Progressive by construction: every item is already in the HTML. This
 * module reveals the controls and hides non-matching rows. With script
 * unavailable the visitor simply sees the whole catalogue, which is a
 * perfectly good outcome for a product list.
 */
const DEBOUNCE = 120;

export function initCatalogue() {
  const root = document.querySelector('[data-catalogue]');
  if (!root) return;

  const controls = root.querySelector('[data-catalogue-controls]');
  const search = root.querySelector('[data-catalogue-search]');
  const count = root.querySelector('[data-catalogue-count]');
  const empty = root.querySelector('[data-catalogue-empty]');
  const items = [...root.querySelectorAll('.cat-item')];
  const chips = [...root.querySelectorAll('.chip')];
  if (!items.length) return;

  const strings = root.dataset;
  const text = {
    showing: strings.labelShowing ?? 'Showing',
    of: strings.labelOf ?? 'of',
    one: strings.labelOne ?? 'item matches',
    many: strings.labelMany ?? 'items match',
  };

  // Only reveal the controls once we know we can drive them.
  controls?.removeAttribute('hidden');

  let stream = 'all';
  let query = '';
  let timer;

  const normalise = (s) =>
    s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  const apply = () => {
    const q = normalise(query.trim());
    let shown = 0;

    for (const el of items) {
      const matchesStream = stream === 'all' || el.dataset.stream === stream;
      const matchesText = !q || normalise(el.dataset.name).includes(q);
      const show = matchesStream && matchesText;
      el.hidden = !show;
      if (show) shown += 1;
    }

    if (empty) empty.hidden = shown !== 0;
    if (count) {
      count.textContent = shown === items.length
        ? `${items.length} ${text.many}`
        : `${text.showing} ${shown} ${text.of} ${items.length}`;
    }
  };

  search?.addEventListener('input', (event) => {
    query = event.target.value;
    window.clearTimeout(timer);
    // Debounced so the live region is not re-announced on every keystroke.
    timer = window.setTimeout(apply, DEBOUNCE);
  });

  // A search input's native clear button fires `search`, not `input`.
  search?.addEventListener('search', (event) => {
    query = event.target.value;
    apply();
  });

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      stream = chip.dataset.stream;
      chips.forEach((c) => c.setAttribute('aria-pressed', String(c === chip)));
      apply();
    });
  });

  apply();
}

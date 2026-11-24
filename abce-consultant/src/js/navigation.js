/**
 * Navigation: sticky header state, accessible mobile panel, back-to-top.
 *
 * Accessibility contract for the mobile panel:
 *  - the trigger carries aria-expanded and aria-controls
 *  - the panel is `hidden` when closed, so it is out of the a11y tree and
 *    cannot be reached by keyboard or screen reader
 *  - focus moves into the panel on open and back to the trigger on close
 *  - Tab is trapped inside the panel while it is open
 *  - Escape closes it
 *  - background scroll is locked while it is open
 *  - it is force-closed when the viewport reaches the desktop breakpoint,
 *    so a resize can never leave an invisible panel holding focus
 */

const DESKTOP = '(min-width: 64em)';

export function initNavigation() {
  initStickyHeader();
  initMobileNav();
  initBackToTop();
}

/* ---------------------------------------------------------------- header */
function initStickyHeader() {
  const header = document.querySelector('[data-header]');
  if (!header) return;

  // A sentinel band the height of the header, pinned to the top of the
  // document. While any of it is on screen we are still "at the top"; once it
  // has scrolled away the header takes its solid state. Cheaper and smoother
  // than a scroll listener, and it must NOT use a negative rootMargin — that
  // would make a band at y=0 non-intersecting from the very first frame.
  const sentinel = document.createElement('div');
  sentinel.setAttribute('aria-hidden', 'true');
  sentinel.style.cssText =
    'position:absolute;top:0;left:0;width:1px;height:var(--header-h);pointer-events:none;visibility:hidden';
  document.body.prepend(sentinel);

  if (!('IntersectionObserver' in window)) {
    header.classList.add('is-stuck');
    return;
  }

  new IntersectionObserver(
    ([entry]) => header.classList.toggle('is-stuck', !entry.isIntersecting),
    { threshold: 0 },
  ).observe(sentinel);
}

/* ----------------------------------------------------------- mobile nav */
function initMobileNav() {
  const toggle = document.querySelector('#nav-toggle');
  const panel = document.querySelector('[data-mobile-nav]');
  if (!toggle || !panel) return;

  const label = toggle.querySelector('.visually-hidden');
  const desktop = window.matchMedia(DESKTOP);
  let lastFocused = null;

  const focusables = () =>
    [...panel.querySelectorAll('a[href], button:not([disabled])')].filter(
      (el) => el.offsetParent !== null,
    );

  const open = () => {
    lastFocused = document.activeElement;
    panel.hidden = false;
    toggle.setAttribute('aria-expanded', 'true');
    if (label) label.textContent = 'Close menu';
    document.body.classList.add('nav-open');
    document.addEventListener('keydown', onKeydown);

    // The panel is still `visibility: hidden` until `.is-open` lands, and a
    // visibility-hidden element cannot take focus — calling focus() here
    // would silently do nothing and leave the keyboard user outside the
    // panel. So add the class first, then move focus on the next frame.
    requestAnimationFrame(() => {
      panel.classList.add('is-open');
      requestAnimationFrame(() => focusables()[0]?.focus());
    });
  };

  const close = ({ restoreFocus = true } = {}) => {
    panel.classList.remove('is-open');
    toggle.setAttribute('aria-expanded', 'false');
    if (label) label.textContent = 'Open menu';
    document.body.classList.remove('nav-open');
    document.removeEventListener('keydown', onKeydown);

    const finish = () => { panel.hidden = true; };
    // Wait for the close transition before removing from the a11y tree.
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) finish();
    else window.setTimeout(finish, 300);

    if (restoreFocus && lastFocused instanceof HTMLElement) lastFocused.focus();
  };

  const isOpen = () => toggle.getAttribute('aria-expanded') === 'true';

  function onKeydown(event) {
    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== 'Tab') return;

    const items = focusables();
    if (!items.length) return;
    const first = items[0];
    const last = items[items.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  toggle.addEventListener('click', () => (isOpen() ? close() : open()));

  // Following a link inside the panel should not leave it open behind the
  // new page in browsers that restore the page from cache.
  panel.addEventListener('click', (event) => {
    if (event.target.closest('a[href]')) close({ restoreFocus: false });
  });

  const onBreakpoint = (event) => {
    if (event.matches && isOpen()) close({ restoreFocus: false });
  };
  if (desktop.addEventListener) desktop.addEventListener('change', onBreakpoint);
  else desktop.addListener(onBreakpoint); // Safari < 14
}

/* --------------------------------------------------------- back to top */
function initBackToTop() {
  const btn = document.querySelector('[data-to-top]');
  if (!btn) return;

  btn.hidden = false;

  let ticking = false;
  const update = () => {
    btn.classList.toggle('is-visible', window.scrollY > window.innerHeight * 0.9);
    ticking = false;
  };
  update();

  window.addEventListener(
    'scroll',
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(update);
    },
    { passive: true },
  );

  btn.addEventListener('click', () => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' });
    // Send focus somewhere sensible rather than leaving it on a now-hidden button.
    document.querySelector('.skip-link')?.focus({ preventScroll: true });
  });
}

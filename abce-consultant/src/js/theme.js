/**
 * Colour theme.
 *
 * Order of authority: an explicit choice the visitor made here, otherwise
 * the operating system preference, which is also followed live if they
 * change it and have expressed no preference of their own.
 *
 * The initial theme is applied by a tiny inline script in <head> before
 * first paint — see head-meta.html. Without that the page would paint light
 * and then flip, which is worse than having no dark mode at all.
 */
const KEY = 'abce-theme';

export function initTheme() {
  const toggle = document.querySelector('[data-theme-toggle]');
  const media = window.matchMedia('(prefers-color-scheme: dark)');

  const stored = () => {
    try {
      const v = localStorage.getItem(KEY);
      return v === 'dark' || v === 'light' ? v : null;
    } catch {
      return null; // private mode, blocked storage — fall back to the OS
    }
  };

  const current = () =>
    document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';

  const apply = (theme, { persist } = { persist: true }) => {
    document.documentElement.setAttribute('data-theme', theme);
    if (toggle) {
      toggle.setAttribute('aria-pressed', String(theme === 'dark'));
      const label = theme === 'dark' ? toggle.dataset.labelLight : toggle.dataset.labelDark;
      const sr = toggle.querySelector('.visually-hidden');
      if (sr && label) sr.textContent = label;
    }
    // Keep the address-bar colour in step with the page.
    document.querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', theme === 'dark' ? '#0B1623' : '#0B2545');

    if (!persist) return;
    try {
      localStorage.setItem(KEY, theme);
    } catch { /* nothing to do: the choice simply will not outlive the tab */ }
  };

  apply(current(), { persist: false });

  toggle?.addEventListener('click', () => {
    apply(current() === 'dark' ? 'light' : 'dark');
  });

  // Follow the system only while the visitor has not chosen for themselves.
  const onSystem = (event) => {
    if (stored()) return;
    apply(event.matches ? 'dark' : 'light', { persist: false });
  };
  if (media.addEventListener) media.addEventListener('change', onSystem);
  else media.addListener(onSystem);
}

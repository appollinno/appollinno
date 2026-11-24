/**
 * Product and long-page behaviour.
 *
 * 1. In-page index: marks the entry for the section currently in view, so a
 *    long page tells you where you are. Progressive — the links work as plain
 *    anchors without this.
 * 2. Deep-link prefill: /contact.html?category=... arrives from a category's
 *    "Request a quotation" button and preselects that category on the form.
 */

export function initSectionIndex() {
  const indexes = document.querySelectorAll('[data-section-index]');
  if (!indexes.length || !('IntersectionObserver' in window)) return;

  indexes.forEach((nav) => {
    const links = [...nav.querySelectorAll('a[href^="#"]')];
    const map = new Map();

    links.forEach((link) => {
      const id = decodeURIComponent(link.getAttribute('href').slice(1));
      const section = document.getElementById(id);
      if (section) map.set(section, link);
    });
    if (!map.size) return;

    const setActive = (link) => {
      links.forEach((l) => {
        const on = l === link;
        l.classList.toggle('is-active', on);
        if (on) l.setAttribute('aria-current', 'true');
        else l.removeAttribute('aria-current');
      });
    };

    const observer = new IntersectionObserver(
      (entries) => {
        // Choose the entry nearest the top of the viewport among those visible.
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length) setActive(map.get(visible[0].target));
      },
      { rootMargin: '-25% 0px -60% 0px', threshold: 0 },
    );

    map.forEach((_link, section) => observer.observe(section));
  });
}

export function initCategoryPrefill() {
  const select = document.querySelector('#service-category');
  if (!select) return;

  const requested = new URLSearchParams(window.location.search).get('category');
  if (!requested) return;

  const match = [...select.options].find(
    (o) => o.value.toLowerCase() === requested.toLowerCase(),
  );
  if (match) select.value = match.value;
}

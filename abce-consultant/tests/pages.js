/** The pages under test, and what must be true of each. */
export const PAGES = [
  { slug: 'index',      path: '/',                h1: /Engineering Confidence/i, title: /ABCE Consultant LDA/ },
  { slug: 'about',      path: '/about.html',      h1: /supplier judged/i,        title: /About Us/ },
  { slug: 'products',   path: '/products.html',   h1: /Five supply streams/i,    title: /Products/ },
  { slug: 'services',   path: '/services.html',   h1: /requisition/i,            title: /Services/ },
  { slug: 'quality',    path: '/quality.html',    h1: /standard is part/i,       title: /Quality/ },
  { slug: 'industries', path: '/industries.html', h1: /Six sectors/i,            title: /Industries/ },
  { slug: 'clients',    path: '/clients.html',    h1: /Who we work for/i,        title: /Clients/ },
  { slug: 'contact',    path: '/contact.html',    h1: /Send us the specification/i, title: /Contact/ },
];

/** Console messages that are environmental noise rather than site defects. */
export const IGNORABLE_CONSOLE = [
  /favicon\.ico/i,
  /Download the React DevTools/i,
];

/** Attaches console/page-error collection. Returns the collected array. */
export function collectErrors(page) {
  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() !== 'error') return;
    const text = msg.text();
    if (IGNORABLE_CONSOLE.some((r) => r.test(text))) return;
    errors.push(`console: ${text}`);
  });
  page.on('pageerror', (err) => errors.push(`pageerror: ${err.message}`));
  page.on('requestfailed', (req) => {
    const f = req.failure();
    if (f && !IGNORABLE_CONSOLE.some((r) => r.test(req.url()))) {
      errors.push(`requestfailed: ${req.url()} — ${f.errorText}`);
    }
  });
  return errors;
}

/**
 * Scrolls the whole page so scroll-triggered content reveals, then waits for
 * the motion to settle.
 *
 * The settle step is essential, not cosmetic: an element captured halfway
 * through its fade has a blended colour (e.g. #d9dde1 instead of #4A5B70),
 * which makes a contrast checker report dozens of violations that do not
 * exist once the animation finishes — and that noise hides the real ones.
 */
export async function scrollThrough(page, step = 700) {
  await page.evaluate(async (s) => {
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    // Re-read scrollHeight every iteration: lazy images make the document
    // taller as we go, and a loop bound to the initial height stops short.
    let y = 0;
    let guard = 0;
    while (y < document.documentElement.scrollHeight && guard < 400) {
      window.scrollTo(0, y);
      await sleep(70);
      y += s;
      guard += 1;
    }
    window.scrollTo(0, document.documentElement.scrollHeight);
    await sleep(400);

    // Second pass. The first one races lazy images: each image that resolves
    // makes the page taller, so sections can be scrolled past before their
    // trigger positions are correct. By now everything has loaded, so this
    // pass catches whatever the first one outran.
    y = 0;
    guard = 0;
    while (y < document.documentElement.scrollHeight && guard < 400) {
      window.scrollTo(0, y);
      await sleep(40);
      y += s;
      guard += 1;
    }
    window.scrollTo(0, 0);
    await sleep(250);
  }, step);

  // Wait until every revealed element has actually reached full opacity.
  await page.waitForFunction(
    () =>
      [...document.querySelectorAll('[data-reveal]')].every(
        (el) => parseFloat(getComputedStyle(el).opacity) > 0.99,
      ),
    null,
    { timeout: 15_000 },
  );
  // One more frame-pair so transforms have committed before anything measures.
  await page.waitForTimeout(250);
}

/**
 * Ensures every image has finished loading.
 *
 * A fast programmatic scroll can move past a loading="lazy" image before the
 * browser decides to fetch it, so it is still pending once we stop. Nudge any
 * stragglers into view and wait for them. This is a test-harness concern:
 * a real visitor scrolling at human speed triggers them normally.
 */
export async function settleImages(page, timeout = 20_000) {
  const deadline = Date.now() + timeout;
  for (;;) {
    const pending = await page.evaluate(() => {
      const bad = [...document.images].filter((i) => {
        if (i.complete) return false;
        // An image inside a display:none subtree (the closed mobile panel,
        // for instance) is never fetched by the browser, so waiting on it
        // would spin until the timeout. It is not a broken image.
        const r = i.getBoundingClientRect();
        return r.width > 0 || r.height > 0;
      });
      // Nudge every pending image, not just the first: one that can never
      // resolve would otherwise starve the rest of their turn.
      bad.forEach((i) => i.scrollIntoView({ block: 'center' }));
      return bad.map((i) => i.getAttribute('src'));
    });
    if (!pending.length) return;
    if (Date.now() > deadline) {
      throw new Error(`images never finished loading: ${pending.join(', ')}`);
    }
    await page.waitForTimeout(300);
  }
}

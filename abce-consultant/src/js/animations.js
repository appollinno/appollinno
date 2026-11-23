/**
 * Motion — GSAP + ScrollTrigger.
 *
 * Design intent: one orchestrated moment on load (the hero), restrained
 * scroll reveals everywhere else, and real parallax only on large media.
 *
 * Contract:
 *  - If `prefers-reduced-motion: reduce` is set, nothing here runs at all and
 *    the `js-motion` class is never applied, so content renders in its final
 *    state with no resting transforms.
 *  - If GSAP fails to load for any reason, `revealFallback()` clears the
 *    resting states so content is never left invisible.
 */

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export async function initAnimations() {
  if (reduced()) return;

  let gsap, ScrollTrigger;
  try {
    ({ gsap } = await import('gsap'));
    ({ ScrollTrigger } = await import('gsap/ScrollTrigger'));
    gsap.registerPlugin(ScrollTrigger);
  } catch (err) {
    console.warn('[abce] motion library unavailable; showing content unanimated.', err);
    revealFallback();
    return;
  }

  gsap.defaults({ ease: 'power3.out', duration: 0.8 });

  heroSequence(gsap);
  bannerSequence(gsap);
  scrollReveals(gsap);
  parallax(gsap);

  keepTriggersAligned(ScrollTrigger);
}

/**
 * Lazy-loaded images arrive *while* the visitor scrolls, and each one that
 * resolves makes the document taller. Every ScrollTrigger start/end measured
 * before that point is then wrong, and sections further down can be scrolled
 * past without ever firing — leaving real content stuck at opacity 0.
 *
 * So: remeasure on window load, and again (debounced) as images finish.
 */
function keepTriggersAligned(ScrollTrigger) {
  let pending;

  /**
   * Remeasure, but never while the visitor is somewhere other than the top
   * of the page.
   *
   * ScrollTrigger.refresh() saves the scroll position, recalculates, and
   * restores it. If an image resolves just after someone has started moving,
   * the restore puts them back where they were when the refresh was queued —
   * so a click on "Explore our solutions", or on back-to-top, visibly snaps
   * back. (refresh(true) only defers that; it does not prevent it.)
   *
   * Remeasuring is only really valuable before the visitor has moved, which
   * is exactly when it is also safe. Once they are scrolling, slightly stale
   * trigger positions cost nothing visible, and revealFailsafe() below
   * guarantees nothing can stay hidden.
   */
  const refresh = () => {
    clearTimeout(pending);
    pending = window.setTimeout(() => {
      if (window.scrollY > 4) return;
      ScrollTrigger.refresh(true);
    }, 250);
  };

  window.addEventListener('load', refresh);

  const images = [...document.images];
  let outstanding = images.filter((img) => !img.complete).length;
  images.forEach((img) => {
    if (img.complete) return;
    const done = () => {
      outstanding -= 1;
      refresh();
      img.removeEventListener('load', done);
      img.removeEventListener('error', done);
    };
    img.addEventListener('load', done);
    img.addEventListener('error', done);
  });

  // Fonts can also shift layout once they swap in.
  if (document.fonts?.ready) document.fonts.ready.then(refresh);

  if (outstanding === 0) refresh();

  revealFailsafe();
}

/**
 * Last-resort guarantee that no content is ever permanently invisible.
 *
 * Scroll-driven reveals are an enhancement, but they have failure modes we
 * cannot fully control: a trigger measured against a stale layout, a very
 * fast scroll past a section before its images resolve, a browser that
 * throttles rAF in a background tab. Any of those can leave a block of real
 * content at opacity 0 with no way back.
 *
 * So, a short time after load, anything still hidden is simply shown. In
 * normal use this never fires, because every trigger has already run.
 */
function revealFailsafe() {
  const clear = () => {
    const stuck = document.querySelectorAll('[data-reveal]:not(.reveal-done)');
    stuck.forEach((el) => {
      if (parseFloat(getComputedStyle(el).opacity) > 0.99) return;
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.classList.add('reveal-done');
    });
  };
  // Re-check periodically rather than once: images and fonts keep arriving.
  const start = Date.now();
  const tick = window.setInterval(() => {
    clear();
    if (Date.now() - start > 12_000) window.clearInterval(tick);
  }, 4_000);
}

/** Clear every resting state so nothing stays hidden. */
function revealFallback() {
  document.documentElement.classList.remove('js-motion');
}

/* ------------------------------------------------------------------ hero */
function heroSequence(gsap) {
  const hero = document.querySelector('.hero');
  if (!hero) return;

  const lines = hero.querySelectorAll('.hero__title .line > span');
  const sweep = hero.querySelector('[data-hero-sweep]');
  const tl = gsap.timeline({ defaults: { ease: 'power4.out' } });

  // The single measurement sweep: a cyan datum travelling across the frame
  // once, as though the shot were being surveyed. It runs with the headline,
  // not before it, so it never delays the content.
  if (sweep) {
    tl.fromTo(
      sweep,
      { xPercent: 0, left: '0%', opacity: 0 },
      { left: '100%', opacity: 1, duration: 1.5, ease: 'power2.inOut' },
      0,
    ).to(sweep, { opacity: 0, duration: 0.4 }, 1.1);
  }

  // The from-state must clear `y` as well as set `yPercent`.
  // The browser resolves the CSS `translateY(104%)` resting state into a pixel
  // matrix before GSAP ever sees it, so GSAP parses it as y:161px, yPercent:0.
  // Animating yPercent alone then leaves that pixel offset in place and the
  // text stays clipped. Setting both ends explicitly removes the ambiguity.
  tl.fromTo(
      lines,
      { y: 0, yPercent: 104 },
      { y: 0, yPercent: 0, duration: 1.1, stagger: 0.12 },
      0.15,
    )
    .fromTo('.hero__rule', { scaleX: 0 }, { scaleX: 1, duration: 1, ease: 'power2.out' }, 0.7)
    .to('.hero__sub', { opacity: 1, duration: 0.7 }, 0.85)
    .to('.hero__actions', { opacity: 1, duration: 0.7 }, 1)
    .to('.scroll-cue', { opacity: 1, duration: 0.6 }, 1.2)
    .add(() => {
      hero.querySelectorAll('.hero__title .line > span, .hero__rule')
        .forEach((el) => el.classList.add('reveal-done'));
    });
}

/** Inner pages get a quieter version of the same idea. */
function bannerSequence(gsap) {
  const banner = document.querySelector('.banner');
  if (!banner) return;
  gsap.from(banner.querySelectorAll('.crumbs, h1, .lede, .banner__actions'), {
    y: 18,
    opacity: 0,
    duration: 0.7,
    stagger: 0.08,
    ease: 'power3.out',
  });
}

/* --------------------------------------------------------------- reveals */
function scrollReveals(gsap) {
  const targets = document.querySelectorAll('[data-reveal]');

  targets.forEach((el) => {
    const kind = el.getAttribute('data-reveal');
    const vars =
      kind === 'rule'
        ? { scaleX: 1, duration: 0.9, ease: 'power2.out' }
        : kind === 'fade'
          ? { opacity: 1, duration: 0.7 }
          : { opacity: 1, y: 0, duration: 0.75 };

    gsap.to(el, {
      ...vars,
      scrollTrigger: {
        trigger: el,
        start: 'top 88%',
        once: true,
      },
      onComplete: () => el.classList.add('reveal-done'),
    });
  });

  // Rows and cards inside a list reveal together with a small stagger rather
  // than each firing its own trigger, which reads as noise.
  document.querySelectorAll('.spec-list, .grid, .plate-grid, .roster, .process').forEach((group) => {
    const items = group.querySelectorAll(':scope > [data-reveal]');
    if (items.length < 2) return;
    items.forEach((el) => gsap.killTweensOf(el));
    gsap.to(items, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      stagger: 0.07,
      scrollTrigger: { trigger: group, start: 'top 85%', once: true },
      onComplete: () => items.forEach((el) => el.classList.add('reveal-done')),
    });
  });
}

/* -------------------------------------------------------------- parallax */
function parallax(gsap) {
  // Hero background drifts slightly slower than the page. The media box is
  // overscanned by 8% in CSS so no edge is ever revealed.
  const heroMedia = document.querySelector('.hero__media');
  if (heroMedia) {
    gsap.to(heroMedia, {
      yPercent: 9,
      ease: 'none',
      scrollTrigger: {
        trigger: '.hero',
        start: 'top top',
        end: 'bottom top',
        scrub: true,
      },
    });
  }

  // Figure images scale-drift inside their frame. Subtle: 6% over the whole
  // scroll of the element through the viewport.
  gsap.utils.toArray('.figure__parallax').forEach((img) => {
    gsap.fromTo(
      img,
      { scale: 1.06, yPercent: -2.5 },
      {
        scale: 1.06,
        yPercent: 2.5,
        ease: 'none',
        scrollTrigger: {
          trigger: img.closest('.figure') ?? img,
          start: 'top bottom',
          end: 'bottom top',
          scrub: true,
        },
      },
    );
  });
}

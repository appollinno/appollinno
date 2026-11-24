/**
 * Build-time renderers.
 *
 * Content lives once, as data, in src/content/*.js. These functions turn it
 * into the static markup emitted into each page by the abceHtml() Vite plugin.
 * Nothing here runs in the browser, so long lists cost no client-side JS and
 * are fully present in the HTML for crawlers and for no-JS visitors.
 */
import { site, locales, localised } from '../../site.config.js';
import { copy as copyEn } from './copy/en.js';
import { copy as copyPt } from './copy/pt.js';

const COPY = { en: copyEn, pt: copyPt };
import { t } from './ui.js';
import { contentFor } from './index.js';

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const img = (name, alt, { cls = '', width = 1920, height = 1080, lazy = true, sizes } = {}) =>
  `<img src="/assets/images/${name}.jpg" alt="${esc(alt)}"${cls ? ` class="${cls}"` : ''} width="${width}" height="${height}"${
    sizes ? ` sizes="${sizes}"` : ''
  } ${lazy ? 'loading="lazy" decoding="async"' : 'loading="eager" fetchpriority="high"'}>`;

/* ======================================================================== *
 * Products
 * ======================================================================== */

/** Home page: the five streams as specification rows. */
export function productStreamRows(locale = 'en') {
  const { categories } = contentFor(locale);
  const base = locales[locale].base;
  return `<ul class="spec-list">
${categories
  .map(
    (c) => `      <li class="spec-row spec-row--link spec-row--media" data-reveal>
        <span class="spec-row__index tabular" aria-hidden="true">${c.ref}</span>
        <div class="figure figure--wide">${img(c.image, `${c.name} supplied by ${site.shortName}`, {
          cls: 'figure__parallax',
          width: 608,
          height: 342,
          sizes: '(min-width: 56em) 19rem, 100vw',
        })}</div>
        <div class="spec-row__content">
          <h3 class="spec-row__title"><a href="${base}/products.html#${c.id}">${esc(c.name)}</a></h3>
          <p class="spec-row__body">${esc(c.summary)}</p>
        </div>
      </li>`,
  )
  .join('\n')}
    </ul>`;
}

/** Products page: in-page index. */
export function productIndex(locale = 'en') {
  const { categories } = contentFor(locale);
  return `<nav class="cluster" aria-label="${esc(COPY[locale].prod_indexSr)}">
      <a class="btn btn--primary" href="#catalogue">${esc(COPY[locale].prod_searchCta)}</a>
${categories
  .map(
    (c) =>
      `      <a class="btn btn--ghost" href="#${c.id}"><span class="tabular" aria-hidden="true">${c.ref}</span> ${esc(c.short)}</a>`,
  )
  .join('\n')}
    </nav>`;
}

/** Products page: one full band per category, alternating surface. */
export function productBands(locale = 'en') {
  const { categories } = contentFor(locale);
  const base = locales[locale].base;
  return categories
    .map((c, i) => {
      const dark = i % 2 === 1;
      const groups = c.groups
        .map(
          (g) => `            <div class="spec-group">
              <h3 class="spec-group__head">${esc(g.heading)}</h3>
              <ul class="item-list">
${g.items.map((it) => `                <li>${esc(it)}</li>`).join('\n')}
              </ul>
            </div>`,
        )
        .join('\n');

      return `  <section class="section ${dark ? 'surface-navy' : 'surface-paper'}" id="${c.id}" aria-labelledby="${c.id}-h">
    <div class="container">
      <div class="split split--7-5">
        <div class="stack--lg stack" data-reveal>
          <div>
            <span class="datum" aria-hidden="true"></span>
            <h2 id="${c.id}-h"><span class="h-ref tabular" aria-hidden="true">${c.ref}</span>${esc(c.name)}</h2>
            <p class="lede">${esc(c.summary)}</p>
          </div>
          <div class="figure figure--wide">${img(c.image, `${c.name}`, {
            cls: 'figure__parallax',
            width: 1024,
            height: 576,
            sizes: '(min-width: 56em) 40rem, 100vw',
          })}
            <p class="figure__plate">${esc(c.short)}</p>
          </div>
          <ul class="detail-strip">
${c.details
  .map(
    (d) => `            <li class="detail-strip__item">
              <!-- alt="" is deliberate: the caption below is the text
                   alternative, and repeating it would read out twice. -->
              <div class="figure figure--square">${img(d.img, '', {
                width: 480,
                height: 480,
                sizes: '(min-width: 56em) 13rem, 45vw',
              })}</div>
              <p class="detail-strip__cap">${esc(d.cap)}</p>
            </li>`,
  )
  .join('\n')}
          </ul>
          <p class="notice">${esc(c.note)}</p>
          <p><a class="btn btn--${dark ? 'accent' : 'primary'}" href="${base}/contact.html?category=${encodeURIComponent(
            c.name,
          )}#quote">Request a quotation</a></p>
        </div>
        <div class="spec-groups" data-reveal>
${groups}
        </div>
      </div>
    </div>
  </section>`;
    })
    .join('\n\n');
}


/**
 * The full catalogue as one filterable list.
 *
 * Every item is rendered server-side, so with JavaScript unavailable the
 * visitor still gets the complete catalogue — the search box and the stream
 * filters are revealed by script and are purely an enhancement.
 */
export function productCatalogue(locale = 'en') {
  const tr = t(locale);
  const { categories } = contentFor(locale);
  const items = categories.flatMap((c) =>
    c.groups.flatMap((g) =>
      g.items.map((name) => ({ name, group: g.heading, stream: c })),
    ),
  );

  const filters = [
    `          <button class="chip" type="button" data-stream="all" aria-pressed="true">${esc(
      tr('cat.all'),
    )} <span class="chip__n tabular">${items.length}</span></button>`,
    ...categories.map((c) => {
      const n = c.groups.reduce((a, g) => a + g.items.length, 0);
      return `          <button class="chip" type="button" data-stream="${c.id}" aria-pressed="false">${esc(
        c.short,
      )} <span class="chip__n tabular">${n}</span></button>`;
    }),
  ].join('\n');

  const rows = items
    .map(
      (i) => `        <li class="cat-item" data-stream="${i.stream.id}" data-name="${esc(
        i.name.toLowerCase(),
      )}">
          <span class="cat-item__text">
            <span class="cat-item__name">${esc(i.name)}</span>
            <span class="cat-item__meta">${esc(i.stream.short)} &middot; ${esc(i.group)}</span>
          </span>
          <button class="cat-item__add" type="button"
                  data-add-item="${esc(i.name)}" data-add-stream="${esc(i.stream.name)}"
                  data-label-add="${esc(tr('req.add'))}" data-label-added="${esc(tr('req.added'))}">
            <span class="cat-item__addLabel">${esc(tr('req.add'))}</span>
          </button>
        </li>`,
    )
    .join('\n');

  return `<div class="catalogue" data-catalogue
      data-label-showing="${esc(tr('cat.showing'))}"
      data-label-of="${esc(tr('cat.of'))}"
      data-label-one="${esc(tr('cat.resultsOne'))}"
      data-label-many="${esc(tr('cat.resultsMany'))}">
      <div class="catalogue__controls" data-catalogue-controls hidden>
        <div class="field catalogue__search">
          <label class="field__label" for="cat-search">${esc(tr('cat.searchLabel'))}</label>
          <input id="cat-search" type="search" autocomplete="off" spellcheck="false"
                 placeholder="${esc(tr('cat.searchPlaceholder'))}" data-catalogue-search>
        </div>
        <div class="catalogue__filters" role="group" aria-label="${esc(tr('cat.searchLabel'))}">
${filters}
        </div>
      </div>

      <p class="catalogue__count" data-catalogue-count role="status" aria-live="polite"></p>

      <ul class="catalogue__list" data-catalogue-list>
${rows}
      </ul>

      <p class="notice catalogue__empty" data-catalogue-empty hidden>
        <strong>${esc(tr('cat.none'))}</strong> ${esc(tr('cat.noneHint'))}
      </p>
    </div>`;
}

/** Contact form: service category options. */
export function productSelectOptions(locale = 'en') {
  const { categories } = contentFor(locale);
  const extra = ['Logistics & freight forwarding', 'Customs clearance & documentation', 'Warehousing & inventory', 'Other / multiple categories'];
  return [...categories.map((c) => c.name), ...extra]
    .map((name) => `              <option value="${esc(name)}">${esc(name)}</option>`)
    .join('\n');
}

/* ======================================================================== *
 * Services
 * ======================================================================== */

/** Home page: condensed services overview. */
export function serviceOverview(locale = 'en') {
  const { services } = contentFor(locale);
  const base = locales[locale].base;
  return `<ul class="grid grid--3">
${services
  .map(
    (s) => `      <li class="card card--link" data-reveal>
        <h3 class="card__title"><a class="card__link" href="${base}/services.html#${s.id}">${esc(s.name)}</a></h3>
        <p class="card__body">${esc(s.summary)}</p>
      </li>`,
  )
  .join('\n')}
    </ul>`;
}

/** Services page: full detail per service. */
export function serviceSections(locale = 'en') {
  const { services } = contentFor(locale);
  return `<ul class="spec-list">
${services
  .map(
    (s) => `      <li class="spec-row" id="${s.id}" data-reveal>
        <span class="spec-row__index tabular" aria-hidden="true">${s.ref}</span>
        <div class="spec-row__content split split--5-7">
          <div>
            <h3 class="spec-row__title">${esc(s.name)}</h3>
            <p class="spec-row__body">${esc(s.summary)}</p>
          </div>
          <ul class="item-list item-list--two-up">
${s.points.map((p) => `            <li>${esc(p)}</li>`).join('\n')}
          </ul>
        </div>
      </li>`,
  )
  .join('\n')}
    </ul>`;
}

/** Services page: in-page index. */
export function serviceIndex(locale = 'en') {
  const { services } = contentFor(locale);
  return `<nav class="service-index" aria-label="${esc(COPY[locale].svc_srOnly)}">
      <ul class="service-index__list">
${services
  .map(
    (s) =>
      `        <li><a href="#${s.id}"><span class="tabular" aria-hidden="true">${s.ref}</span> ${esc(s.name)}</a></li>`,
  )
  .join('\n')}
      </ul>
    </nav>`;
}

/** The six-step procurement workflow. */
export function workflowSteps(locale = 'en') {
  const { workflow } = contentFor(locale);
  return `<ol class="process">
${workflow
  .map(
    (w) => `      <li class="process__step" data-reveal>
        <span class="process__num" aria-hidden="true"></span>
        <div>
          <h3 class="process__title">${esc(w.title)}</h3>
          <p class="process__body">${esc(w.body)}</p>
        </div>
      </li>`,
  )
  .join('\n')}
    </ol>`;
}

/* ======================================================================== *
 * Standards
 * ======================================================================== */

export function standardFamilies(locale = 'en') {
  const { families } = contentFor(locale);
  return families
    .map(
      (f, i) => `  <section class="section ${i % 2 === 1 ? 'surface-mist' : 'surface-paper'}" id="${f.id}" aria-labelledby="${f.id}-h">
    <div class="container">
      <div class="section-head" data-reveal>
        <span class="datum" aria-hidden="true"></span>
        <h2 id="${f.id}-h">${esc(f.body)} — ${esc(f.name)}</h2>
        <p class="lede">${esc(f.intro)}</p>
        <dl class="coverage">
          <div class="coverage__row">
            <dt>Primary coverage</dt><dd>${esc(f.coverage)}</dd>
          </div>
          <div class="coverage__row">
            <dt>Typical outputs</dt><dd>${esc(f.outputs)}</dd>
          </div>
        </dl>
      </div>
      <div class="plate-grid plate-grid--3 standards-grid" data-reveal>
${f.entries
  .map(
    (e) => `        <article class="plate plate--light">
          <h3 class="plate__code">${esc(e.code)}</h3>
          <hr class="plate__rule">
          <p class="plate__scope">${esc(e.scope)}</p>
        </article>`,
  )
  .join('\n')}
      </div>
    </div>
  </section>`,
    )
    .join('\n\n');
}

export function standardsIndex(locale = 'en') {
  const { families } = contentFor(locale);
  return `<nav class="cluster" aria-label="${esc(COPY[locale].qual_scopeTitle)}">
${families
  .map((f) => `      <a class="btn btn--ghost" href="#${f.id}">${esc(f.body)}</a>`)
  .join('\n')}
    </nav>`;
}

/* ======================================================================== *
 * Industries
 * ======================================================================== */

/** Home page: industry expertise, compact. */
export function industryCards(locale = 'en') {
  const { industries } = contentFor(locale);
  const base = locales[locale].base;
  return `<ul class="grid grid--3">
${industries
  .map(
    (n) => `      <li class="industry-card card card--navy card--link" data-reveal>
        <div class="figure figure--wide">${img(n.image, `${n.name} sector operations`, {
          width: 608,
          height: 342,
          sizes: '(min-width: 56em) 22rem, 100vw',
        })}</div>
        <h3 class="card__title"><a class="card__link" href="${base}/industries.html#${n.id}">${esc(n.name)}</a></h3>
        <p class="card__body">${esc(n.summary)}</p>
      </li>`,
  )
  .join('\n')}
    </ul>`;
}

/** Industries page: full sections. */
export function industrySections(locale = 'en') {
  const { industries } = contentFor(locale);
  return industries
    .map(
      (n, i) => `  <section class="section ${i % 2 === 1 ? 'surface-mist' : 'surface-paper'}" id="${n.id}" aria-labelledby="${n.id}-h">
    <div class="container">
      <div class="split ${i % 2 === 1 ? 'split--5-7' : 'split--7-5'} split--center">
        <div class="${i % 2 === 1 ? 'order-last' : ''}" data-reveal>
          <span class="datum" aria-hidden="true"></span>
          <h2 id="${n.id}-h">${esc(n.name)}</h2>
          <p class="lede">${esc(n.summary)}</p>
          <h3 class="subhead">${esc(COPY[locale].ind_capHead)}</h3>
          <ul class="item-list">
${n.capabilities.map((c) => `            <li>${esc(c)}</li>`).join('\n')}
          </ul>
        </div>
        <div class="figure figure--wide" data-reveal>${img(n.image, `${n.name} sector operations`, {
          cls: 'figure__parallax',
          width: 1024,
          height: 576,
          sizes: '(min-width: 56em) 32rem, 100vw',
        })}
          <p class="figure__plate">${esc(n.name)}</p>
        </div>
      </div>
    </div>
  </section>`,
    )
    .join('\n\n');
}

export function industryIndex(locale = 'en') {
  const { industries } = contentFor(locale);
  return `<nav class="cluster" aria-label="${esc(COPY[locale].ind_h1)}">
${industries.map((n) => `      <a class="btn btn--ghost" href="#${n.id}">${esc(n.name)}</a>`).join('\n')}
    </nav>`;
}

/* ======================================================================== *
 * Clients & values
 * ======================================================================== */

export function clientRoster(locale = 'en') {
  const { clients } = contentFor(locale);
  return `<ul class="roster">
${clients
  .map(
    (c) => `      <li class="roster__item" data-reveal>
        <span class="roster__name">${esc(c.name)}${
          c.note ? `<span class="roster__note">${esc(c.note)}</span>` : ''
        }</span>
      </li>`,
  )
  .join('\n')}
    </ul>`;
}

export function valuesList(locale = 'en') {
  // Wording for the first three is the company's own, from the corporate
  // presentation. Do not paraphrase them. Held in the copy modules so the
  // Portuguese build gets its own version rather than this one.
  const cp = COPY[locale];
  const detail = [cp.val_excellence, cp.val_quality, cp.val_safety, cp.val_operational];
  return `<ul class="grid grid--2 values">
${localised[locale].values
  .map(
    (v, i) => `      <li class="card card--navy" data-reveal>
        <h3 class="card__title">${esc(v)}</h3>
        <p class="card__body">${esc(detail[i] ?? '')}</p>
      </li>`,
  )
  .join('\n')}
    </ul>`;
}


/**
 * The quotation request dock and panel, included on every page.
 *
 * A native <dialog> is used deliberately: modal focus containment, Escape
 * to close and inertness of the page behind it come from the platform
 * rather than from hand-written JavaScript that would have to be kept
 * correct. The dock stays hidden until there is something in the list.
 */
export function requestDock(locale = 'en') {
  const tr = t(locale);
  const base = locales[locale].base;
  return `<div class="request-dock" data-request-dock hidden>
      <button class="request-dock__btn" type="button" data-request-open aria-haspopup="dialog">
        <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 3h6a1 1 0 0 1 1 1v1H8V4a1 1 0 0 1 1-1Z"/><path d="M8 5H6a1 1 0 0 0-1 1v13a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-2"/><path d="m9 13 2 2 4-4"/></svg>
        <span>${esc(tr('req.openList'))}</span>
        <span class="request-dock__n tabular" data-request-count>0</span>
      </button>
    </div>

    <dialog class="request-panel" data-request-panel aria-labelledby="request-panel-title"
      data-label-remove="${esc(tr('req.remove'))}"
      data-label-added="${esc(tr('req.itemAdded'))}"
      data-label-removed="${esc(tr('req.itemRemoved'))}"
      data-label-cleared="${esc(tr('req.empty'))}">
      <div class="request-panel__head">
        <h2 id="request-panel-title">${esc(tr('req.title'))}</h2>
        <button class="icon-btn" type="button" data-request-close>
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>
          <span class="visually-hidden">${esc(tr('req.close'))}</span>
        </button>
      </div>

      <ul class="request-panel__list" data-request-list></ul>

      <p class="request-panel__empty" data-request-empty>
        <strong>${esc(tr('req.empty'))}</strong><br>${esc(tr('req.emptyHint'))}
      </p>

      <div class="request-panel__foot">
        <p class="request-panel__note" data-request-note>${esc(tr('req.sentTo'))}</p>
        <div class="cluster">
          <a class="btn btn--accent" href="${base}/contact.html#quote" data-request-continue>${esc(tr('req.send'))}</a>
          <button class="btn btn--ghost" type="button" data-request-clear>${esc(tr('req.clearAll'))}</button>
        </div>
      </div>
    </dialog>

    <span class="visually-hidden" role="status" aria-live="polite" data-request-live></span>`;
}

/* ======================================================================== *
 * Registry consumed by the abceHtml() plugin
 * ======================================================================== */
export const blocks = {
  'products.streamRows': productStreamRows,
  'products.index': productIndex,
  'products.bands': productBands,
  'products.catalogue': productCatalogue,
  'products.selectOptions': productSelectOptions,
  'services.overview': serviceOverview,
  'services.sections': serviceSections,
  'services.index': serviceIndex,
  'services.workflow': workflowSteps,
  'standards.families': standardFamilies,
  'standards.index': standardsIndex,
  'industries.cards': industryCards,
  'industries.sections': industrySections,
  'industries.index': industryIndex,
  'clients.roster': clientRoster,
  'company.values': valuesList,
  'request.dock': requestDock,
};

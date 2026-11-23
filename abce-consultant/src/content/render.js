/**
 * Build-time renderers.
 *
 * Content lives once, as data, in src/content/*.js. These functions turn it
 * into the static markup emitted into each page by the abceHtml() Vite plugin.
 * Nothing here runs in the browser, so long lists cost no client-side JS and
 * are fully present in the HTML for crawlers and for no-JS visitors.
 */
import { site } from '../../site.config.js';
import { categories } from './products.js';
import { services, workflow } from './services.js';
import { families } from './standards.js';
import { industries } from './industries.js';
import { clients } from './clients.js';

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
export function productStreamRows() {
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
          <h3 class="spec-row__title"><a href="/products.html#${c.id}">${esc(c.name)}</a></h3>
          <p class="spec-row__body">${esc(c.summary)}</p>
        </div>
      </li>`,
  )
  .join('\n')}
    </ul>`;
}

/** Products page: in-page index. */
export function productIndex() {
  return `<nav class="cluster" aria-label="Product categories">
${categories
  .map(
    (c) =>
      `      <a class="btn btn--ghost" href="#${c.id}"><span class="tabular" aria-hidden="true">${c.ref}</span> ${esc(c.short)}</a>`,
  )
  .join('\n')}
    </nav>`;
}

/** Products page: one full band per category, alternating surface. */
export function productBands() {
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
          <p><a class="btn btn--${dark ? 'accent' : 'primary'}" href="/contact.html?category=${encodeURIComponent(
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

/** Contact form: service category options. */
export function productSelectOptions() {
  const extra = ['Logistics & freight forwarding', 'Customs clearance & documentation', 'Warehousing & inventory', 'Other / multiple categories'];
  return [...categories.map((c) => c.name), ...extra]
    .map((name) => `              <option value="${esc(name)}">${esc(name)}</option>`)
    .join('\n');
}

/* ======================================================================== *
 * Services
 * ======================================================================== */

/** Home page: condensed services overview. */
export function serviceOverview() {
  return `<ul class="grid grid--3">
${services
  .map(
    (s) => `      <li class="card card--link" data-reveal>
        <h3 class="card__title"><a class="card__link" href="/services.html#${s.id}">${esc(s.name)}</a></h3>
        <p class="card__body">${esc(s.summary)}</p>
      </li>`,
  )
  .join('\n')}
    </ul>`;
}

/** Services page: full detail per service. */
export function serviceSections() {
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
export function serviceIndex() {
  return `<nav class="service-index" aria-label="Services">
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
export function workflowSteps() {
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

export function standardFamilies() {
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

export function standardsIndex() {
  return `<nav class="cluster" aria-label="Standards families">
${families
  .map((f) => `      <a class="btn btn--ghost" href="#${f.id}">${esc(f.body)}</a>`)
  .join('\n')}
    </nav>`;
}

/* ======================================================================== *
 * Industries
 * ======================================================================== */

/** Home page: industry expertise, compact. */
export function industryCards() {
  return `<ul class="grid grid--3">
${industries
  .map(
    (n) => `      <li class="industry-card card card--navy card--link" data-reveal>
        <div class="figure figure--wide">${img(n.image, `${n.name} sector operations`, {
          width: 608,
          height: 342,
          sizes: '(min-width: 56em) 22rem, 100vw',
        })}</div>
        <h3 class="card__title"><a class="card__link" href="/industries.html#${n.id}">${esc(n.name)}</a></h3>
        <p class="card__body">${esc(n.summary)}</p>
      </li>`,
  )
  .join('\n')}
    </ul>`;
}

/** Industries page: full sections. */
export function industrySections() {
  return industries
    .map(
      (n, i) => `  <section class="section ${i % 2 === 1 ? 'surface-mist' : 'surface-paper'}" id="${n.id}" aria-labelledby="${n.id}-h">
    <div class="container">
      <div class="split ${i % 2 === 1 ? 'split--5-7' : 'split--7-5'} split--center">
        <div class="${i % 2 === 1 ? 'order-last' : ''}" data-reveal>
          <span class="datum" aria-hidden="true"></span>
          <h2 id="${n.id}-h">${esc(n.name)}</h2>
          <p class="lede">${esc(n.summary)}</p>
          <h3 class="subhead">Procurement and logistics capability</h3>
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

export function industryIndex() {
  return `<nav class="cluster" aria-label="Industries served">
${industries.map((n) => `      <a class="btn btn--ghost" href="#${n.id}">${esc(n.name)}</a>`).join('\n')}
    </nav>`;
}

/* ======================================================================== *
 * Clients & values
 * ======================================================================== */

export function clientRoster() {
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

export function valuesList() {
  // Wording for the first three is the company's own, from the corporate
  // presentation. Do not paraphrase them.
  const detail = {
    'Excellence in Execution':
      'Commitment to delivering services with great attention to detail and efficiency.',
    'Uncompromising Quality Assurance':
      'A stringent quality control system that ensures only the best materials and services are provided.',
    Safety:
      'Alignment with global Health, Safety and Environmental (HSE) regulations to protect workers and stakeholders across all operations.',
    'Operational Excellence':
      'Procurement, inspection, freight and clearance run as one chain, because that is where delays actually come from.',
  };
  return `<ul class="grid grid--2 values">
${site.values
  .map(
    (v) => `      <li class="card card--navy" data-reveal>
        <h3 class="card__title">${esc(v)}</h3>
        <p class="card__body">${esc(detail[v] ?? '')}</p>
      </li>`,
  )
  .join('\n')}
    </ul>`;
}

/* ======================================================================== *
 * Registry consumed by the abceHtml() plugin
 * ======================================================================== */
export const blocks = {
  'products.streamRows': productStreamRows,
  'products.index': productIndex,
  'products.bands': productBands,
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
};

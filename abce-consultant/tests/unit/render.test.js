import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { blocks } from '../../src/content/render.js';
import { categories } from '../../src/content/products.js';
import { services } from '../../src/content/services.js';

const names = Object.keys(blocks);
const render = (n) => blocks[n]();
const render2 = (n, locale) => blocks[n](locale);

describe('the content block registry', () => {
  it('exposes every block the pages ask for', () => {
    // If a block is renamed without updating the pages, the build throws.
    // Catching it here is faster than finding out at build time.
    for (const n of [
      'products.streamRows', 'products.index', 'products.bands',
      'products.selectOptions', 'services.overview', 'services.sections',
      'services.index', 'services.workflow', 'standards.families',
      'standards.index', 'industries.cards', 'industries.sections',
      'industries.index', 'clients.roster', 'company.values',
      'company.coverage',
    ]) {
      expect(names, `block "${n}"`).toContain(n);
    }
  });

  it('every block renders non-trivial HTML', () => {
    for (const n of names) {
      const out = render(n);
      expect(typeof out, n).toBe('string');
      expect(out.length, n).toBeGreaterThan(80);
    }
  });

  it('no block leaves an unresolved token or directive behind', () => {
    for (const n of names) {
      const out = render(n);
      expect(out, `${n} has an unresolved {{ token }}`).not.toMatch(/\{\{/);
      expect(out, `${n} has an unresolved directive`).not.toMatch(/<!--@/);
      expect(out, `${n} contains "undefined"`).not.toMatch(/>undefined</);
      expect(out, `${n} contains "[object Object]"`).not.toContain('[object Object]');
    }
  });
});

describe('HTML escaping', () => {
  it('escapes ampersands in content, so the markup stays valid', () => {
    // "Civil & Structural Bulk Materials" must not emit a bare &.
    const out = render('products.bands');
    expect(out).toContain('Civil &amp; Structural Bulk Materials');
    // No bare ampersand that is not the start of an entity.
    const bare = out.match(/&(?!(amp|lt|gt|quot|#\d+|#x[0-9a-f]+);)/gi) ?? [];
    expect(bare, 'bare ampersands in rendered HTML').toEqual([]);
  });

  it('escapes content used inside an attribute', () => {
    // Category names go into a query string on the quote links.
    const out = render('products.bands');
    expect(out).toContain('category=Civil%20%26%20Structural%20Bulk%20Materials');
  });

  it('escapes the select options', () => {
    const out = render('products.selectOptions');
    expect(out).toContain('<option value="Civil &amp; Structural Bulk Materials">');
    expect(out.match(/<option /g)).toHaveLength(categories.length + 4);
  });
});

describe('internal link integrity', () => {
  it('every in-page index link has a matching section id', () => {
    // An index may also point at a section defined by the page itself rather
    // than by a block — the catalogue on products.html is one — so the page
    // source counts as a source of ids too.
    const pairs = [
      ['products.index', 'products.bands', 'products.html'],
      ['services.index', 'services.sections', 'services.html'],
      ['standards.index', 'standards.families', 'quality.html'],
      ['industries.index', 'industries.sections', 'industries.html'],
    ];
    for (const [indexBlock, bodyBlock, pageFile] of pairs) {
      const targets = [...render(indexBlock).matchAll(/href="#([^"]+)"/g)].map((m) => m[1]);
      const haystack = render(bodyBlock) + readFileSync(pageFile, 'utf8');
      expect(targets.length, indexBlock).toBeGreaterThan(0);
      const missing = targets.filter((t) => !haystack.includes(`id="${t}"`));
      expect(missing, `${indexBlock} points at ids nothing defines`).toEqual([]);
    }
  });

  it('home page stream rows link to real product sections', () => {
    const rows = render('products.streamRows');
    for (const c of categories) {
      expect(rows).toContain(`href="/products.html#${c.id}"`);
    }
  });

  it('home page service cards link to real service sections', () => {
    const cards = render('services.overview');
    for (const s of services) {
      expect(cards).toContain(`href="/services.html#${s.id}"`);
    }
  });
});

describe('markup shape', () => {
  it('section-producing blocks open and close the same number of sections', () => {
    for (const n of ['products.bands', 'standards.families', 'industries.sections']) {
      const out = render(n);
      const open = (out.match(/<section\b/g) ?? []).length;
      const close = (out.match(/<\/section>/g) ?? []).length;
      expect(open, `${n} unbalanced <section>`).toBe(close);
      expect(open).toBeGreaterThan(0);
    }
  });

  it('every list block opens and closes its list items', () => {
    for (const n of ['products.streamRows', 'services.overview', 'clients.roster', 'company.values']) {
      const out = render(n);
      expect((out.match(/<li\b/g) ?? []).length, `${n} <li>`).toBe(
        (out.match(/<\/li>/g) ?? []).length,
      );
    }
  });

  it('every content image has an alt attribute', () => {
    for (const n of names) {
      const imgs = render(n).match(/<img\b[^>]*>/g) ?? [];
      const noAlt = imgs.filter((t) => !/\salt="/.test(t));
      expect(noAlt, `${n} has <img> without alt`).toEqual([]);
    }
  });

  it('every content image declares width and height', () => {
    // Intrinsic dimensions are what keep CLS at 0.003.
    for (const n of names) {
      const imgs = render(n).match(/<img\b[^>]*>/g) ?? [];
      const noDims = imgs.filter((t) => !(/\swidth="\d+"/.test(t) && /\sheight="\d+"/.test(t)));
      expect(noDims, `${n} has <img> without width/height`).toEqual([]);
    }
  });

  it('the workflow renders exactly six numbered steps', () => {
    const out = render('services.workflow');
    expect((out.match(/class="process__step"/g) ?? []).length).toBe(6);
    expect(out).toMatch(/^<ol class="process">/);
  });

  it('the client roster uses no images', () => {
    expect(render('clients.roster')).not.toMatch(/<img/);
  });

  /* ---------------------------------------------------------------------- *
   * Coverage band.
   *
   * The whole point of this block is that its figures are COUNTED, never
   * typed. These tests fail if anyone replaces a derived count with a
   * literal, which is exactly the drift that would turn an honest figure
   * into a claim.
   * ---------------------------------------------------------------------- */
  describe('the coverage band', () => {
    const figures = (locale) =>
      [...render2('company.coverage', locale).matchAll(/class="coverage__n tabular">(\d+)</g)]
        .map((m) => Number(m[1]));

    it('states six figures', () => {
      expect(figures('en')).toHaveLength(6);
    });

    it('counts match the content model, not hard-coded numbers', () => {
      const groups = categories.reduce((n, c) => n + c.groups.length, 0);
      const items = categories.reduce(
        (n, c) => n + c.groups.reduce((m, g) => m + g.items.length, 0),
        0,
      );
      const [cats, grp, itm, svc] = figures('en');
      expect(cats).toBe(categories.length);
      expect(grp).toBe(groups);
      expect(itm).toBe(items);
      expect(svc).toBe(services.length);
    });

    it('the line-item figure agrees with the catalogue it links to', () => {
      // The catalogue prints its own total in the "All products" chip. If
      // these two ever disagree, one of them is lying to the reader.
      const [, , items] = figures('en');
      const chip = render('products.catalogue').match(
        /data-stream="all"[^>]*>[^<]*<span class="chip__n tabular">(\d+)</,
      );
      expect(chip, 'catalogue "all" chip not found').not.toBeNull();
      expect(Number(chip[1])).toBe(items);
    });

    it('both locales report identical figures', () => {
      // Counts describe the catalogue, not the language. A difference here
      // means the two content trees have drifted apart.
      expect(figures('pt')).toEqual(figures('en'));
    });

    it('every figure links to a page that can be counted against it', () => {
      const hrefs = [...render2('company.coverage', 'en').matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
      expect(hrefs).toHaveLength(6);
      for (const h of hrefs) expect(h).toMatch(/^\/(products|services|industries|quality)\.html/);
    });

    it('the Portuguese band links into the Portuguese tree', () => {
      const hrefs = [...render2('company.coverage', 'pt').matchAll(/href="([^"]+)"/g)].map((m) => m[1]);
      for (const h of hrefs) expect(h).toMatch(/^\/pt\//);
    });
  });
});

import { describe, it, expect } from 'vitest';
import { UI, LOCALES, t } from '../../src/content/ui.js';
import { copy as en } from '../../src/content/copy/en.js';
import { copy as pt } from '../../src/content/copy/pt.js';
import { contentFor, assertParity } from '../../src/content/index.js';
import { locales, localised, nav } from '../../site.config.js';
import { blocks } from '../../src/content/render.js';

const flat = (obj, prefix = '') =>
  Object.entries(obj).flatMap(([k, v]) =>
    v && typeof v === 'object' && !Array.isArray(v)
      ? flat(v, `${prefix}${k}.`)
      : [[`${prefix}${k}`, v]],
  );

describe('interface strings', () => {
  it('every key exists in every locale', () => {
    const base = Object.keys(UI.en).sort();
    for (const loc of LOCALES) {
      expect(Object.keys(UI[loc]).sort(), `locale ${loc}`).toEqual(base);
    }
  });

  it('no string is left empty or identical by accident in a required place', () => {
    for (const loc of LOCALES) {
      for (const [k, v] of Object.entries(UI[loc])) {
        expect(typeof v, `${loc}.${k}`).toBe('string');
        expect(v.trim().length, `${loc}.${k} is empty`).toBeGreaterThan(0);
      }
    }
  });

  it('a missing key throws rather than rendering blank', () => {
    expect(() => t('en')('does.not.exist')).toThrow(/missing/i);
    expect(() => t('xx')).toThrow(/unknown locale/i);
  });
});

describe('page copy', () => {
  it('English and Portuguese expose exactly the same keys', () => {
    const a = flat(en).map(([k]) => k).sort();
    const b = flat(pt).map(([k]) => k).sort();
    const missingPt = a.filter((k) => !b.includes(k));
    const extraPt = b.filter((k) => !a.includes(k));
    expect({ missingPt, extraPt }).toEqual({ missingPt: [], extraPt: [] });
  });

  it('no Portuguese value was left as its English original', () => {
    // Codes and proper names legitimately match; prose should not.
    const same = flat(en)
      .filter(([, v]) => typeof v === 'string' && v.length > 40)
      .filter(([k, v]) => flat(pt).find(([pk]) => pk === k)?.[1] === v)
      .map(([k]) => k);
    expect(same, 'untranslated Portuguese copy').toEqual([]);
  });

  it('every page has a translated title and description', () => {
    for (const key of Object.keys(en.meta)) {
      for (const [name, c] of [['en', en], ['pt', pt]]) {
        expect(c.meta[key].title.trim().length, `${name}.${key}.title`).toBeGreaterThan(2);
        expect(c.meta[key].description.length, `${name}.${key}.description`).toBeGreaterThan(80);
      }
    }
    expect(pt.meta.home.title).not.toBe(en.meta.home.title);
  });
});

describe('locale configuration', () => {
  it('English is at the root and Portuguese under /pt', () => {
    expect(locales.en.base).toBe('');
    expect(locales.pt.base).toBe('/pt');
    expect(locales.pt.htmlLang).toBe('pt-MZ');
  });

  it('each locale points at the other', () => {
    expect(locales.en.other).toBe('pt');
    expect(locales.pt.other).toBe('en');
  });

  it('navigation is labelled in both languages', () => {
    for (const item of nav) {
      expect(item.label.en, item.key).toBeTruthy();
      expect(item.label.pt, item.key).toBeTruthy();
      expect(item.label.pt).not.toBe(item.label.en);
    }
  });

  it('company facts are translated but contact details are not', () => {
    expect(localised.pt.positioning).not.toBe(localised.en.positioning);
    expect(localised.pt.values).toHaveLength(4);
    expect(localised.pt.vision.length).toBeGreaterThan(60);
  });
});

describe('content parity between locales', () => {
  it('the two content bundles are structurally identical', () => {
    expect(assertParity()).toEqual([]);
  });

  it('both locales carry the full 60-item catalogue', () => {
    for (const loc of LOCALES) {
      const n = contentFor(loc).categories.reduce(
        (a, c) => a + c.groups.reduce((x, g) => x + g.items.length, 0), 0,
      );
      expect(n, `catalogue size for ${loc}`).toBe(60);
    }
  });

  it('product names are actually translated, not copied', () => {
    const e = contentFor('en').categories.map((c) => c.name);
    const p = contentFor('pt').categories.map((c) => c.name);
    expect(e.filter((n, i) => n === p[i])).toEqual([]);
  });

  it('client names are identical, because proper names are not translated', () => {
    expect(contentFor('pt').clients.map((c) => c.name))
      .toEqual(contentFor('en').clients.map((c) => c.name));
  });

  it('standards codes are identical in both locales', () => {
    const codes = (loc) => contentFor(loc).families.flatMap((f) => f.entries.map((e) => e.code));
    expect(codes('pt')).toContain('API Spec 5L');
    expect(codes('pt')).toContain('ISO 45001');
  });
});

describe('render blocks in both locales', () => {
  it('every block renders for every locale', () => {
    for (const loc of LOCALES) {
      for (const name of Object.keys(blocks)) {
        const out = blocks[name](loc);
        expect(typeof out, `${loc}:${name}`).toBe('string');
        expect(out.length, `${loc}:${name}`).toBeGreaterThan(80);
      }
    }
  });

  it('Portuguese blocks prefix their internal links with /pt', () => {
    const out = blocks['products.streamRows']('pt');
    expect(out).toContain('href="/pt/products.html#');
    expect(out).not.toMatch(/href="\/products\.html#/);
  });

  it('English blocks carry no locale prefix', () => {
    const out = blocks['products.streamRows']('en');
    expect(out).toContain('href="/products.html#');
    expect(out).not.toContain('/pt/');
  });
});

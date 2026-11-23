import { describe, it, expect } from 'vitest';
import { existsSync } from 'node:fs';
import { site, nav } from '../../site.config.js';
import { categories, categoryOptions } from '../../src/content/products.js';
import { services, workflow } from '../../src/content/services.js';
import { families } from '../../src/content/standards.js';
import { industries } from '../../src/content/industries.js';
import { clients } from '../../src/content/clients.js';

/** Every id becomes a URL fragment and an HTML id, so it must be safe. */
const SLUG = /^[a-z0-9]+(-[a-z0-9]+)*$/;

describe('company facts', () => {
  it('publishes the real address, email and both telephone numbers', () => {
    expect(site.address.full).toBe(
      'Rua Alberto Cassimo, N.º 60, COOP, Maputo City, Mozambique',
    );
    expect(site.email).toBe('General@abceconsu.com');
    expect(site.phones).toHaveLength(2);
    expect(site.phones.map((p) => p.display)).toEqual([
      '+258 84 239 5576',
      '+258 85 699 2494',
    ]);
  });

  it('each tel: href is the display number with separators stripped', () => {
    // A mismatch here means a visitor taps the number and calls someone else.
    for (const { display, href } of site.phones) {
      expect(href).toBe(display.replace(/\s/g, ''));
      expect(href).toMatch(/^\+\d{9,15}$/);
    }
  });

  it('the production origin has no trailing slash', () => {
    // Canonicals and the sitemap concatenate onto it; a trailing slash
    // would produce https://host//about.html.
    expect(site.url).toMatch(/^https:\/\//);
    expect(site.url.endsWith('/')).toBe(false);
  });

  it('every nav href points at a page that exists', () => {
    for (const item of nav) {
      const file = item.href.replace(/^\//, '');
      expect(existsSync(file), `${item.label} -> ${file}`).toBe(true);
    }
  });
});

describe('product streams', () => {
  it('has exactly the five streams, with unique slug ids and refs', () => {
    expect(categories).toHaveLength(5);
    const ids = categories.map((c) => c.id);
    expect(new Set(ids).size).toBe(5);
    ids.forEach((id) => expect(id).toMatch(SLUG));
    expect(categories.map((c) => c.ref)).toEqual(['01', '02', '03', '04', '05']);
  });

  it('every category carries the fields the renderer needs', () => {
    for (const c of categories) {
      expect(c.name, c.id).toBeTruthy();
      expect(c.short, c.id).toBeTruthy();
      expect(c.summary.length, c.id).toBeGreaterThan(60);
      expect(c.note.length, c.id).toBeGreaterThan(40);
      expect(c.groups.length, c.id).toBeGreaterThan(0);
      expect(c.details.length, c.id).toBeGreaterThan(0);
    }
  });

  it('contains every subcategory named in the brief', () => {
    const all = categories
      .flatMap((c) => c.groups.flatMap((g) => g.items))
      .map((i) => i.toLowerCase());
    const REQUIRED = [
      'structural steel beams', 'rebar', 'cement', 'aggregates',
      'specialized concrete additives', 'bitumen', 'prefabricated steel profiles',
      'bolts, nuts, washers and anchors',
      'line pipes', 'casing and tubing', 'flanges and fittings', 'carbon steel',
      'stainless steel', 'exotic alloys', 'industrial valves',
      'centrifugal and positive displacement pumps',
      'bearings, gaskets, seals and oem spare parts',
      'wire rope slings', 'synthetic webbing slings', 'alloy chain slings',
      'heavy-duty shackles', 'turnbuckles', 'lifting hooks', 'swivels',
      'chain hoists', 'lever hoists', 'beam clamps', 'spreader beams',
      'high-voltage cables', 'switchgears', 'transformers', 'industrial lighting',
      'motors', 'explosion-proof enclosures', 'control panels',
      'process monitoring devices',
      'electric tools', 'pneumatic tools', 'hydraulic tools', 'torque tools',
      'welding machines', 'air compressors', 'power generators',
      'welding electrodes', 'abrasives', 'lubricants', 'industrial chemicals',
      'hse safety supplies',
    ];
    expect(REQUIRED).toHaveLength(48);
    expect(REQUIRED.filter((r) => !all.includes(r))).toEqual([]);
  });

  it('contains the items the corporate presentation added', () => {
    const all = categories
      .flatMap((c) => c.groups.flatMap((g) => g.items))
      .map((i) => i.toLowerCase());
    for (const item of [
      'threaded rods', 'eye bolts', 'sockets', 'master links', 'snatch blocks',
      'adhesives', 'heavy-duty hand tools', 'sandwich panels',
      'pre-engineered steel frames',
    ]) {
      expect(all, `deck item "${item}"`).toContain(item);
    }
  });

  it('lists no subcategory twice within a category', () => {
    for (const c of categories) {
      const items = c.groups.flatMap((g) => g.items);
      expect(new Set(items).size, `${c.id} has duplicates`).toBe(items.length);
    }
  });

  it('offers every category on the contact form', () => {
    for (const c of categories) expect(categoryOptions).toContain(c.name);
  });
});

describe('services', () => {
  it('has ten services with unique slug ids and sequential refs', () => {
    expect(services).toHaveLength(10);
    const ids = services.map((s) => s.id);
    expect(new Set(ids).size).toBe(10);
    ids.forEach((id) => expect(id).toMatch(SLUG));
    expect(services.map((s) => s.ref)).toEqual([
      '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
    ]);
  });

  it('every service has a summary and at least three points', () => {
    for (const s of services) {
      expect(s.summary.length, s.id).toBeGreaterThan(60);
      expect(s.points.length, s.id).toBeGreaterThanOrEqual(3);
    }
  });

  it('covers the ten services named in the brief', () => {
    const names = services.map((s) => s.name);
    for (const n of [
      'End-to-End Procurement', 'Certified Product Sourcing', 'Quality Inspection',
      'Global Freight Forwarding', 'Customs Clearance', 'Import/Export Documentation',
      'Warehousing', 'Inventory Management', 'Critical Delivery Coordination',
      '24/7 Emergency Support',
    ]) {
      expect(names).toContain(n);
    }
  });

  it('the procurement workflow is the six supplied steps, in order', () => {
    expect(workflow).toHaveLength(6);
    expect(workflow.map((w) => w.title)).toEqual([
      'Define requirements and compliance needs',
      'Source through vetted suppliers',
      'Perform quality assurance',
      'Conduct pre-dispatch inspection',
      'Coordinate logistics and customs',
      'Support fulfillment and inventory management',
    ]);
  });
});

describe('standards', () => {
  it('has the four families, each with coverage and outputs', () => {
    expect(families.map((f) => f.body)).toEqual(['API', 'ASME', 'ISO', 'ASTM & EN']);
    for (const f of families) {
      expect(f.coverage, f.body).toBeTruthy();
      expect(f.outputs, f.body).toBeTruthy();
      expect(f.entries.length, f.body).toBeGreaterThan(0);
    }
  });

  it('lists the API and ISO standards by their exact codes', () => {
    const codes = families.flatMap((f) => f.entries.map((e) => e.code));
    for (const c of [
      'API Spec 5L', 'API Spec 6A', 'API Spec 6D',
      'ISO 9001', 'ISO 14001', 'ISO 45001',
    ]) {
      expect(codes).toContain(c);
    }
  });

  it('never claims ABCE itself holds a certification', () => {
    // The whole page rests on this distinction. If data ever starts
    // asserting ABCE is certified, the test should stop it.
    const prose = families
      .flatMap((f) => [f.intro, ...f.entries.map((e) => e.scope)])
      .join(' ')
      .toLowerCase();
    for (const claim of [
      'we are certified', 'abce is certified', 'our certification',
      'certified company', 'we hold iso',
    ]) {
      expect(prose, `must not contain "${claim}"`).not.toContain(claim);
    }
  });
});

describe('industries and clients', () => {
  it('has the six sectors with unique slug ids and capabilities', () => {
    expect(industries).toHaveLength(6);
    const ids = industries.map((i) => i.id);
    expect(new Set(ids).size).toBe(6);
    ids.forEach((id) => expect(id).toMatch(SLUG));
    for (const i of industries) {
      expect(i.capabilities.length, i.id).toBeGreaterThanOrEqual(3);
      expect(i.summary.length, i.id).toBeGreaterThan(60);
    }
  });

  it('lists the nine client organisations exactly as supplied', () => {
    expect(clients.map((c) => c.name)).toEqual([
      'AQUAREL', 'Saipem Mozambique', 'B2B Engineering', 'Merec Industries',
      'Total Energies', 'Mercy Land', 'Puma Energy', 'CFM Centro',
      'Dust Engineering',
    ]);
    expect(clients.find((c) => c.name === 'AQUAREL').note).toBe('Tratamento de Águas');
  });

  it('attaches no logo, testimonial or claim to any client', () => {
    for (const c of clients) {
      expect(Object.keys(c).every((k) => ['name', 'note'].includes(k)), c.name).toBe(true);
    }
  });
});

describe('referenced imagery exists on disk', () => {
  const imageExists = (n) => existsSync(`public/assets/images/${n}.jpg`);

  it('every product image and detail shot is present', () => {
    const missing = [];
    for (const c of categories) {
      if (!imageExists(c.image)) missing.push(`${c.id} -> ${c.image}`);
      for (const d of c.details) if (!imageExists(d.img)) missing.push(`${c.id} -> ${d.img}`);
    }
    expect(missing).toEqual([]);
  });

  it('every industry and standards image is present', () => {
    const missing = [
      ...industries.filter((i) => !imageExists(i.image)).map((i) => `${i.id} -> ${i.image}`),
      ...families.filter((f) => !imageExists(f.image)).map((f) => `${f.id} -> ${f.image}`),
    ];
    expect(missing).toEqual([]);
  });

  it('the supplied logo is in place', () => {
    expect(existsSync('public/assets/images/logo/abce-logo.png')).toBe(true);
  });
});

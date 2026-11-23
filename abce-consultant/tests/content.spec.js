import { test, expect } from '@playwright/test';
import { scrollThrough } from './pages.js';

test.describe('Product content', () => {
  const CATEGORIES = [
    'Civil & Structural Bulk Materials',
    'Mechanical, Piping & Flow Control',
    'Rigging & Lifting Equipment',
    'Electrical Systems & Components',
    'Tools, Operational Equipment & Consumables',
  ];

  test('all five categories are present with their own section and heading', async ({ page }) => {
    await page.goto('/products.html');
    for (const name of CATEGORIES) {
      await expect(page.getByRole('heading', { name, exact: true })).toHaveCount(1);
    }
    await expect(page.locator('section[id]')).not.toHaveCount(0);
    for (const id of ['civil-structural', 'mechanical-piping', 'rigging-lifting', 'electrical', 'tools-consumables']) {
      await expect(page.locator(`section#${id}`)).toHaveCount(1);
    }
  });

  test('every subcategory from the brief is listed', async ({ page }) => {
    await page.goto('/products.html');
    const body = (await page.locator('main').innerText()).toLowerCase();

    // 48 items, exactly as supplied by the company.
    const ITEMS = [
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
    const missing = ITEMS.filter((i) => !body.includes(i));
    expect(missing, 'subcategories missing from the Products page').toEqual([]);
  });

  test('each category offers a quotation route', async ({ page }) => {
    await page.goto('/products.html');
    const quoteLinks = page.locator('a[href*="/contact.html"][href*="category="]');
    await expect(quoteLinks).toHaveCount(5);
  });

  test('a category quote link preselects that category on the contact form', async ({ page }) => {
    await page.goto('/products.html');
    await page.locator('section#rigging-lifting a[href*="category="]').click();
    await expect(page).toHaveURL(/contact\.html/);
    await expect(page.locator('#service-category')).toHaveValue('Rigging & Lifting Equipment');
  });
});

test.describe('Services content', () => {
  test('all ten services and the six-step workflow are present', async ({ page }) => {
    await page.goto('/services.html');
    for (const id of [
      'end-to-end-procurement', 'certified-product-sourcing', 'quality-inspection',
      'global-freight-forwarding', 'customs-clearance', 'documentation',
      'warehousing', 'inventory-management', 'critical-delivery', 'emergency-support',
    ]) {
      await expect(page.locator(`#${id}`)).toHaveCount(1);
    }
    await expect(page.locator('.process .process__step')).toHaveCount(6);
  });
});

test.describe('Quality and compliance', () => {
  test('every standard from the brief is listed', async ({ page }) => {
    await page.goto('/quality.html');
    const body = await page.locator('main').innerText();
    for (const code of [
      'API Spec 5L', 'API Spec 6A', 'API Spec 6D',
      'Pressure equipment', 'Boilers', 'Piping components', 'Flanges',
      'ISO 9001', 'ISO 14001', 'ISO 45001',
      'Rebar', 'Structural steel', 'Industrial fasteners',
    ]) {
      expect(body, `standard "${code}" must appear`).toContain(code);
    }
  });

  test('standards alignment is explicitly distinguished from certification held', async ({ page }) => {
    await page.goto('/quality.html');
    const body = await page.locator('main').innerText();
    // This disclaimer is a correctness requirement, not decoration: the site
    // must never imply ABCE itself holds these certifications.
    expect(body).toContain('Standards alignment');
    expect(body).toContain('Certified product sourcing');
    expect(body).toMatch(/Neither of the above is a certification held by ABCE Consultant LDA/i);
  });
});

test.describe('Industries and clients', () => {
  test('all six sectors have their own section', async ({ page }) => {
    await page.goto('/industries.html');
    for (const id of ['energy', 'oil-gas', 'mining', 'processing', 'industrial', 'construction']) {
      await expect(page.locator(`section#${id}`)).toHaveCount(1);
    }
  });

  test('all nine client names appear as text', async ({ page }) => {
    await page.goto('/clients.html');
    const body = await page.locator('main').innerText();
    for (const name of [
      'AQUAREL', 'Saipem Mozambique', 'B2B Engineering', 'Merec Industries',
      'Total Energies', 'Mercy Land', 'Puma Energy', 'CFM Centro', 'Dust Engineering',
    ]) {
      expect(body, `client "${name}" must be listed`).toContain(name);
    }
    expect(body).toContain('Tratamento de Águas');
  });

  test('no client logo images are used', async ({ page }) => {
    await page.goto('/clients.html');
    const srcs = await page.locator('.roster img').count();
    expect(srcs, 'client roster must be text-only until approved logos exist').toBe(0);
  });
});

test.describe('Company details are correct everywhere', () => {
  test('footer carries the real address, email and both phone numbers', async ({ page }) => {
    await page.goto('/');
    const footer = page.locator('.site-footer');
    await expect(footer).toContainText('Rua Alberto Cassimo, N.º 60, COOP');
    await expect(footer).toContainText('Maputo City, Mozambique');
    await expect(footer.locator('a[href="mailto:General@abceconsu.com"]')).toHaveCount(1);
    await expect(footer.locator('a[href="tel:+258842395576"]')).toHaveCount(1);
    await expect(footer.locator('a[href="tel:+258856992494"]')).toHaveCount(1);
  });

  test('vision and mission appear verbatim on the About page', async ({ page }) => {
    await page.goto('/about.html');
    const body = await page.locator('main').innerText();
    expect(body).toContain(
      'Become the most trusted logistics and procurement partner locally and globally for energy and mining industries.',
    );
    expect(body).toContain(
      'Deliver precision-engineered components, bulk materials, and expert logistics through rigorous quality control and on-time delivery.',
    );
    for (const v of [
      'Excellence in Execution', 'Uncompromising Quality Assurance', 'Safety', 'Operational Excellence',
    ]) {
      expect(body).toContain(v);
    }
  });
});

test.describe('Scroll-revealed content is actually readable', () => {
  test('nothing stays hidden after scrolling the home page', async ({ page }) => {
    await page.goto('/');
    await scrollThrough(page);
    const hidden = await page.evaluate(() =>
      [...document.querySelectorAll('[data-reveal]')]
        .filter((el) => parseFloat(getComputedStyle(el).opacity) < 0.9)
        .map((el) => el.className),
    );
    expect(hidden, 'elements left invisible after scrolling').toEqual([]);
  });

  test('with reduced motion, all content is visible without scrolling', async ({ page }) => {
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.goto('/');
    const hidden = await page.evaluate(() =>
      [...document.querySelectorAll('[data-reveal]')]
        .filter((el) => parseFloat(getComputedStyle(el).opacity) < 0.9).length,
    );
    expect(hidden, 'reduced motion must never hide content').toBe(0);
    // The headline must be in place immediately, not waiting on a timeline.
    await expect(page.locator('h1')).toBeVisible();
  });
});

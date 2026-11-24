import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { PAGES, scrollThrough } from './pages.js';

const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa'];
const ptPath = (p) => (p === '/' ? '/pt/' : `/pt${p}`);

test.describe('Portuguese site', () => {
  for (const p of PAGES) {
    test(`${p.slug}: served at /pt with the right language`, async ({ page }) => {
      const res = await page.goto(ptPath(p.path));
      expect(res?.status(), ptPath(p.path)).toBe(200);
      await expect(page.locator('html')).toHaveAttribute('lang', 'pt-MZ');
      await expect(page.locator('h1')).toHaveCount(1);
      await expect(page.locator('h1')).not.toBeEmpty();
    });
  }

  test('the home page is genuinely in Portuguese', async ({ page }) => {
    await page.goto('/pt/');
    await expect(page).toHaveTitle(/Soluções Integradas de Aprovisionamento/);
    await expect(page.locator('.hero__title')).toContainText('Engenharia que dá confiança');
    await expect(page.locator('.nav__link').first()).toHaveText('Início');
  });

  test('navigation stays inside the Portuguese site', async ({ page }, testInfo) => {
    test.skip(!['desktop-1440', 'laptop-1024'].includes(testInfo.project.name), 'desktop only');
    await page.goto('/pt/');
    for (const href of await page.locator('.nav a').evaluateAll((as) => as.map((a) => a.getAttribute('href')))) {
      expect(href, 'every nav link must stay in /pt').toMatch(/^\/pt\//);
    }
    await page.locator('.nav a[href="/pt/products.html"]').click();
    await expect(page).toHaveURL(/\/pt\/products\.html/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'pt-MZ');
  });

  test('the language switcher goes both ways and lands on the same page', async ({ page }) => {
    await page.goto('/services.html');
    const toPt = page.locator('.lang-switch');
    await expect(toPt).toHaveText('Português');
    await expect(toPt).toHaveAttribute('hreflang', 'pt-MZ');
    await toPt.click();
    await expect(page).toHaveURL(/\/pt\/services\.html/);

    const toEn = page.locator('.lang-switch');
    await expect(toEn).toHaveText('English');
    await toEn.click();
    await expect(page).toHaveURL(/\/services\.html/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
  });

  test('each page declares both languages as alternates', async ({ page }) => {
    for (const path of ['/', '/pt/']) {
      await page.goto(path);
      const alts = await page.locator('link[rel="alternate"]').evaluateAll((ls) =>
        ls.map((l) => `${l.getAttribute('hreflang')} ${l.getAttribute('href')}`),
      );
      expect(alts.some((a) => a.startsWith('en '))).toBe(true);
      expect(alts.some((a) => a.startsWith('pt-MZ '))).toBe(true);
      expect(alts.some((a) => a.startsWith('x-default '))).toBe(true);
    }
  });

  test('canonicals are distinct per language', async ({ page }) => {
    await page.goto('/about.html');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href', 'https://www.abceconsu.com/about.html');
    await page.goto('/pt/about.html');
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      'href', 'https://www.abceconsu.com/pt/about.html');
  });

  test('the Portuguese catalogue is complete and searchable', async ({ page }) => {
    await page.goto('/pt/products.html#catalogue');
    await expect(page.locator('.cat-item')).toHaveCount(60);
    await expect(page.locator('[data-catalogue-search]')).toBeVisible();
    await page.locator('[data-catalogue-search]').fill('válvulas');
    await expect(page.locator('.cat-item:visible')).toHaveCount(1);
    await expect(page.locator('.cat-item:visible')).toContainText('Válvulas industriais');
  });

  test('the Portuguese form validates in Portuguese', async ({ page }) => {
    await page.goto('/pt/contact.html#quote');
    await page.locator('[data-form-submit]').click();
    await expect(page.locator('[data-form-status]')).toContainText(/Verifique o formulário/i);
    await expect(page.locator('#e-name')).toHaveText(/Indique o seu nome/i);
  });

  test('the Portuguese form still refuses to claim it sent anything', async ({ page }) => {
    await page.route('mailto:**', (r) => r.abort());
    await page.goto('/pt/contact.html#quote');
    await page.locator('#f-name').fill('Cremildo Manhique');
    await page.locator('#f-company').fill('Operador SA');
    await page.locator('#f-email').fill('compras@operador.co.mz');
    await page.locator('#service-category').selectOption({ index: 1 });
    await page.locator('#f-subject').fill('Tubo API 5L');
    await page.locator('#f-message').fill('Precisamos de 500 m de tubo API 5L Grau B, 8 polegadas, com certificados de fábrica.');
    await page.locator('[data-form-submit]').click();
    await expect(page.locator('[data-form-status]')).toContainText(/Nada foi enviado por este site/i);
  });

  test('the Portuguese quality page keeps the certification disclaimer', async ({ page }) => {
    await page.goto('/pt/quality.html');
    const body = await page.locator('main').innerText();
    expect(body).toContain('Alinhamento normativo');
    expect(body).toContain('Fornecimento de produtos certificados');
    expect(body).toMatch(/Nenhum dos pontos acima é uma certificação detida pela ABCE Consultant LDA/i);
  });

  test('contact details are identical in both languages', async ({ page }) => {
    for (const path of ['/contact.html', '/pt/contact.html']) {
      await page.goto(path);
      const main = page.locator('main');
      await expect(main).toContainText('Rua Alberto Cassimo, N.º 60, COOP');
      await expect(main.locator('a[href="mailto:General@abceconsu.com"]').first()).toBeVisible();
      await expect(main.locator('a[href="tel:+258842395576"]').first()).toBeVisible();
    }
  });

  test('client names are not translated', async ({ page }) => {
    await page.goto('/pt/clients.html');
    const body = await page.locator('main').innerText();
    for (const n of ['AQUAREL', 'Saipem Mozambique', 'Puma Energy', 'CFM Centro']) {
      expect(body).toContain(n);
    }
  });

  for (const p of PAGES) {
    test(`${p.slug}: no horizontal overflow in Portuguese`, async ({ page }) => {
      await page.goto(ptPath(p.path));
      await scrollThrough(page);
      const { sw, cw } = await page.evaluate(() => ({
        sw: document.documentElement.scrollWidth,
        cw: document.documentElement.clientWidth,
      }));
      expect(sw, `${ptPath(p.path)} overflows`).toBeLessThanOrEqual(cw + 1);
    });

    test(`${p.slug}: no accessibility violations in Portuguese`, async ({ page }, testInfo) => {
      test.skip(testInfo.project.name !== 'desktop-1440', 'one viewport is enough');
      await page.goto(ptPath(p.path));
      await scrollThrough(page);
      const r = await new AxeBuilder({ page }).withTags(TAGS).analyze();
      expect(
        r.violations.map((v) => `${v.id}: ${v.nodes[0]?.any?.[0]?.message ?? v.help}`),
        `axe on ${ptPath(p.path)}`,
      ).toEqual([]);
    });
  }

  test('the sitemap lists both languages with alternates', async ({ request }) => {
    const xml = await (await request.get('/sitemap.xml')).text();
    expect(xml).toContain('https://www.abceconsu.com/pt/products.html');
    expect(xml).toContain('hreflang="pt-MZ"');
    expect(xml).toContain('hreflang="en"');
  });
});

import { test, expect } from '@playwright/test';

test.describe('Quotation form validation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/contact.html#quote');
  });

  test('submitting an empty form blocks and reports every required field', async ({ page }) => {
    await page.locator('[data-form-submit]').click();

    const status = page.locator('[data-form-status]');
    await expect(status).toBeVisible();
    await expect(status).toContainText(/check the form/i);

    // Five required fields: name, company, email, category, subject, message.
    await expect(page.locator('.field.has-error')).toHaveCount(6);
    await expect(page.locator('#f-name')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#f-name')).toBeFocused();

    // Nothing may have navigated or claimed success.
    await expect(page).toHaveURL(/contact\.html/);
    await expect(status).not.toContainText(/thank you/i);
  });

  test('rejects a malformed email and accepts a valid one', async ({ page }) => {
    const email = page.locator('#f-email');
    await email.fill('not-an-email');
    await email.blur();
    await expect(page.locator('#e-email')).toHaveText(/valid email address/i);
    await expect(email).toHaveAttribute('aria-invalid', 'true');

    await email.fill('buyer@operator.co.mz');
    await email.blur();
    await expect(email).toHaveAttribute('aria-invalid', 'false');
    await expect(page.locator('#e-email')).toHaveText('');
  });

  test('rejects a too-short message', async ({ page }) => {
    const msg = page.locator('#f-message');
    await msg.fill('need pipe');
    await msg.blur();
    await expect(page.locator('#e-message')).toHaveText(/at least 20 characters/i);
  });

  test('telephone is optional but validated when filled', async ({ page }) => {
    const tel = page.locator('#f-tel');
    await tel.fill('');
    await tel.blur();
    await expect(page.locator('.field:has(#f-tel)')).not.toHaveClass(/has-error/);

    await tel.fill('abc');
    await tel.blur();
    await expect(page.locator('#e-tel')).toHaveText(/telephone number/i);

    await tel.fill('+258 84 239 5576');
    await tel.blur();
    await expect(page.locator('.field:has(#f-tel)')).not.toHaveClass(/has-error/);
  });

  test('an error clears as soon as the field is corrected', async ({ page }) => {
    const name = page.locator('#f-name');
    await name.fill('');
    await name.blur();
    await expect(page.locator('.field:has(#f-name)')).toHaveClass(/has-error/);
    await name.fill('Cremildo');
    await expect(page.locator('.field:has(#f-name)')).not.toHaveClass(/has-error/);
  });

  test('a complete form NEVER claims the message was sent', async ({ page }) => {
    // There is no backend. The form must hand off to the visitor's mail
    // client and say so — a false "sent" confirmation would be a lie.
    await page.route('mailto:**', (r) => r.abort());

    await page.locator('#f-name').fill('Cremildo Manhique');
    await page.locator('#f-company').fill('Operator SA');
    await page.locator('#f-email').fill('buyer@operator.co.mz');
    await page.locator('#f-tel').fill('+258 84 239 5576');
    await page.locator('#service-category').selectOption({ index: 1 });
    await page.locator('#f-subject').fill('API 5L line pipe enquiry');
    await page.locator('#f-message').fill(
      'We need 500 m of API 5L Grade B line pipe, 8 inch, with mill certificates, delivered to Maputo by March.',
    );

    await expect(page.locator('.field.has-error')).toHaveCount(0);
    await page.locator('[data-form-submit]').click();

    const status = page.locator('[data-form-status]');
    await expect(status).toBeVisible();
    await expect(status).toContainText(/email program/i);
    await expect(status).toContainText(/Nothing has been sent by this website/i);
    await expect(status).not.toContainText(/we have received/i);
  });

  test('every field has a programmatically associated label', async ({ page }) => {
    const unlabelled = await page.evaluate(() =>
      [...document.querySelectorAll('form input, form select, form textarea')]
        .filter((el) => {
          if (el.type === 'hidden') return false;
          const byFor = el.id && document.querySelector(`label[for="${el.id}"]`);
          return !(byFor || el.getAttribute('aria-label') || el.closest('label'));
        })
        .map((el) => el.name || el.id || el.tagName),
    );
    expect(unlabelled).toEqual([]);
  });

  test('the category select offers all five product streams', async ({ page }) => {
    const options = await page.locator('#service-category option').allTextContents();
    for (const c of [
      'Civil & Structural Bulk Materials',
      'Mechanical, Piping & Flow Control',
      'Rigging & Lifting Equipment',
      'Electrical Systems & Components',
      'Tools, Operational Equipment & Consumables',
    ]) {
      expect(options).toContain(c);
    }
  });

  test('the no-backend limitation is disclosed on the page itself', async ({ page }) => {
    await expect(page.locator('.form__note')).toContainText(/no mail server/i);
  });
});

test.describe('Contact routes work', () => {
  test('email and telephone links use correct protocols', async ({ page }) => {
    await page.goto('/contact.html');
    const main = page.locator('main');
    await expect(main.locator('a[href="mailto:General@abceconsu.com"]').first()).toBeVisible();
    await expect(main.locator('a[href="tel:+258842395576"]').first()).toBeVisible();
    await expect(main.locator('a[href="tel:+258856992494"]').first()).toBeVisible();
  });

  test('no map is embedded while the location is unverified', async ({ page }) => {
    await page.goto('/contact.html');
    await expect(page.locator('iframe')).toHaveCount(0);
    await expect(page.locator('main')).toContainText(/No map is embedded/i);
  });
});

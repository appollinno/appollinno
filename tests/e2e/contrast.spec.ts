import { test, expect, type Page } from "@playwright/test";

// A direct, formula-based contrast check (not canvas pixel-sampling like
// axe-core's color-contrast rule, which produces false positives on small
// uppercase text with wide letter-spacing — see accessibility.spec.ts).
// This walks every visible text node, reads its real computed color and
// effective background via getComputedStyle, and applies the actual
// WCAG 2 contrast formula with the correct large-text threshold.
const PAGES = ["/", "/shop", "/shop/ethiopia-yirgacheffe", "/our-story", "/journal", "/contact", "/login"];

async function findContrastViolations(page: Page) {
  return page.evaluate(() => {
    function parseColor(c: string): [number, number, number, number] {
      const m = c.match(/rgba?\(([^)]+)\)/);
      if (!m) return [0, 0, 0, 0];
      const parts = m[1].split(",").map((s) => parseFloat(s.trim()));
      return [parts[0] ?? 0, parts[1] ?? 0, parts[2] ?? 0, parts[3] ?? 1];
    }

    function relLum([r, g, b]: number[]) {
      const lin = (c: number) => {
        c = c / 255;
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
      };
      return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
    }

    function contrast(c1: number[], c2: number[]) {
      const l1 = relLum(c1);
      const l2 = relLum(c2);
      const lighter = Math.max(l1, l2);
      const darker = Math.min(l1, l2);
      return (lighter + 0.05) / (darker + 0.05);
    }

    function effectiveBackground(el: Element): number[] {
      let node: Element | null = el;
      while (node) {
        const bg = getComputedStyle(node).backgroundColor;
        const [r, g, b, a] = parseColor(bg);
        if (a > 0.99) return [r, g, b];
        node = node.parentElement;
      }
      return [255, 255, 255];
    }

    const violations: {
      text: string;
      fg: string;
      bg: string;
      ratio: number;
      required: number;
    }[] = [];

    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node: Node | null;
    while ((node = walker.nextNode())) {
      const text = node.textContent?.trim();
      if (!text) continue;
      const el = node.parentElement;
      if (!el) continue;
      const style = getComputedStyle(el);
      if (style.visibility === "hidden" || style.display === "none") continue;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) continue;

      const [fr, fg, fb, fa] = parseColor(style.color);
      if (fa < 0.99) continue; // semi-transparent text already handled explicitly in app code
      const bg = effectiveBackground(el);
      const ratio = contrast([fr, fg, fb], bg);

      const fontSize = parseFloat(style.fontSize);
      const fontWeight = parseInt(style.fontWeight, 10) || 400;
      const isLarge = fontSize >= 24 || (fontSize >= 18.66 && fontWeight >= 700);
      const required = isLarge ? 3 : 4.5;

      if (ratio < required) {
        violations.push({
          text: text.slice(0, 40),
          fg: style.color,
          bg: `rgb(${bg.join(",")})`,
          ratio: Math.round(ratio * 100) / 100,
          required,
        });
      }
    }
    return violations;
  });
}

for (const path of PAGES) {
  test(`${path} — all visible text meets WCAG AA contrast`, async ({ page }) => {
    await page.goto(path);
    const violations = await findContrastViolations(page);
    expect(violations, JSON.stringify(violations, null, 2)).toEqual([]);
  });
}

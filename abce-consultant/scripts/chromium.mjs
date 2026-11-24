/**
 * Portable Chromium resolution.
 *
 * On a developer machine, `npx playwright install` puts a matching browser
 * where Playwright expects it and nothing special is needed. Some CI and
 * sandbox images instead ship a single system Chromium at a fixed path, which
 * will not match the version Playwright looks for.
 *
 * This resolves that: if Playwright's own browser is missing but a system
 * Chromium exists, we point at it. Set ABCE_CHROMIUM to override.
 */
import { existsSync } from 'node:fs';
import { chromium } from 'playwright';

const CANDIDATES = [
  process.env.ABCE_CHROMIUM,
  '/opt/pw-browsers/chromium',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
  '/usr/bin/google-chrome',
].filter(Boolean);

/** Playwright launch options, with an executablePath only when one is needed. */
export function chromiumLaunchOptions() {
  const args = ['--no-sandbox', '--disable-dev-shm-usage'];

  let bundled = true;
  try {
    bundled = existsSync(chromium.executablePath());
  } catch {
    bundled = false;
  }
  if (bundled) return { args };

  const found = CANDIDATES.find((p) => existsSync(p));
  if (!found) {
    throw new Error(
      'No Chromium found. Run `npx playwright install chromium`, or set ABCE_CHROMIUM to a Chromium binary.',
    );
  }
  return { args, executablePath: found };
}

/** Convenience launcher for the standalone scripts. */
export async function launchChromium() {
  return chromium.launch(chromiumLaunchOptions());
}

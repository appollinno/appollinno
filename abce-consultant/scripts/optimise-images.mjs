/**
 * Re-encodes the sourced photography for the web.
 *
 * Wikimedia serves large, high-quality renders. They are the right source,
 * but shipping them untouched costs several megabytes per page. This caps
 * each image at the largest size the layout can actually display and
 * re-encodes it as progressive JPEG at a quality chosen per role.
 *
 * Idempotent: re-running on already-optimised files changes little, and the
 * script refuses to make a file larger than it found it.
 *
 * Run: npm run images
 */
import { execFileSync } from 'node:child_process';
import { readdirSync, statSync, renameSync, unlinkSync, existsSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const DIR = 'public/assets/images';

/** Byte budget above which a file is re-processed even if its width is fine. */
const BUDGET = 200 * 1024;

// Largest CSS pixel width each role is ever displayed at, doubled for 2x
// screens, then capped at something sane for a photographic background.
const ROLES = [
  // Full-bleed home hero: the only image that spans a 1920 viewport.
  { test: /^hero-industrial/,  maxW: 1920, q: 72 },
  // Social card: rendered once, no second chance, so keep quality high.
  { test: /^og-/,              maxW: 1200, q: 86 },
  // Page banners: full width but always behind a heavy navy scrim.
  { test: /^(about-facility|cat-mechanical-piping|svc-freight|qual-standards|ind-oil-gas|clients-industrial|contact-maputo)/,
    maxW: 1600, q: 74 },
  // Detail-strip thumbnails: displayed at ~13rem square. Must precede the
  // generic `cat-` rule below, because ROLES is matched with .find().
  { test: /^(sub-|cat-electrical)/, maxW: 520, q: 78 },
  // In-page figures: never wider than ~40rem of layout, so 1280 covers 2x.
  { test: /^(ind|cat|about|svc|qual)-/, maxW: 1280, q: 76 },
  // hero-port is a sidebar figure on the contact page, not a hero.
  { test: /^hero-port/,        maxW: 1100, q: 76 },
  // Detail-strip thumbnails: displayed at ~13rem square.
];

const roleFor = (name) => ROLES.find((r) => r.test.test(name)) ?? { maxW: 1280, q: 76 };

let before = 0;
let after = 0;
const rows = [];

/**
 * Writes a WebP sibling next to a JPEG. The build wraps every <img> in a
 * <picture> offering it, so supporting browsers fetch markedly fewer bytes
 * while the JPEG stays as the fallback. A WebP that comes out no smaller
 * than its JPEG is discarded rather than shipped.
 */
const SMALL_W = 640;

/**
 * Writes the narrow variant (JPEG + WebP) used by srcset. Skipped when the
 * image is already at or below the small width.
 */
function writeSmall(src, file, quality, width) {
  if (width <= SMALL_W) return false;
  const stem = file.replace(/\.jpe?g$/i, '');
  for (const [ext, extra] of [['jpg', []], ['webp', ['-define', 'webp:method=5']]]) {
    execFileSync('convert', [
      src, '-strip', '-resize', `${SMALL_W}x>`, '-sampling-factor', '4:2:0',
      '-interlace', 'JPEG', '-quality', String(quality), ...extra,
      join(DIR, `${stem}-${SMALL_W}.${ext}`),
    ]);
  }
  return true;
}

function writeWebp(src, file, quality, jpegBytes) {
  const dest = join(DIR, file.replace(/\.jpe?g$/i, '.webp'));
  execFileSync('convert', [
    src, '-strip', '-quality', String(quality - 6), '-define', 'webp:method=5', dest,
  ]);
  if (statSync(dest).size >= jpegBytes) unlinkSync(dest);
}

for (const file of readdirSync(DIR).filter((f) => /\.jpe?g$/i.test(f))) {
  const src = join(DIR, file);
  const tmp = join(DIR, `.opt-${file}`);
  const { maxW, q } = roleFor(file);
  const startBytes = statSync(src).size;

  // Already small enough and already narrow enough? Leave it alone — every
  // extra JPEG round-trip is irreversible generation loss for no gain.
  const width = Number(
    execFileSync('identify', ['-format', '%w', src], { encoding: 'utf8' }).trim(),
  );
  if (width <= maxW && startBytes <= BUDGET) {
    // The JPEG needs no further work, but it still wants its siblings.
    writeWebp(src, file, q, startBytes);
    writeSmall(src, file, q, width);
    before += startBytes;
    after += startBytes;
    rows.push([file, startBytes, startBytes, 'jpeg kept']);
    continue;
  }

  execFileSync('convert', [
    src,
    '-auto-orient',
    '-strip',                      // drop EXIF: smaller, and no stray GPS data
    '-resize', `${maxW}x${maxW}>`, // only ever shrink
    '-sampling-factor', '4:2:0',
    '-interlace', 'JPEG',          // progressive
    '-quality', String(q),
    '-colorspace', 'sRGB',
    tmp,
  ]);

  const endBytes = statSync(tmp).size;
  if (endBytes < startBytes) {
    renameSync(tmp, src);
  } else {
    unlinkSync(tmp); // never regress a file
  }

  const final = statSync(src).size;

  writeWebp(src, file, q, final);
  writeSmall(src, file, q, Number(
    execFileSync('identify', ['-format', '%w', src], { encoding: 'utf8' }).trim(),
  ));

  before += startBytes;
  after += final;
  rows.push([file, startBytes, final]);
}

rows.sort((a, b) => b[2] - a[2]);
const kb = (n) => `${Math.round(n / 1024)}KB`;
console.log('largest files after optimisation:');
for (const [f, s0, s1, note] of rows.slice(0, 10)) {
  console.log(`  ${f.padEnd(28)} ${kb(s0).padStart(7)} -> ${kb(s1).padStart(7)}${note ? '  (' + note + ')' : ''}`);
}
console.log(
  `\ntotal ${kb(before)} -> ${kb(after)}  (${Math.round((1 - after / before) * 100)}% smaller, ${rows.length} files)`,
);

// Manifest consumed by the build to construct srcset without shelling out
// to ImageMagick for every <img> on every build.
const manifest = {};
for (const f of readdirSync(DIR).filter((x) => /\.jpe?g$/i.test(x) && !/-\d+\.jpe?g$/i.test(x))) {
  const stem = f.replace(/\.jpe?g$/i, '');
  const w = Number(execFileSync('identify', ['-format', '%w', join(DIR, f)], { encoding: 'utf8' }).trim());
  const h = Number(execFileSync('identify', ['-format', '%h', join(DIR, f)], { encoding: 'utf8' }).trim());
  manifest[f] = {
    width: w,
    height: h,
    webp: existsSync(join(DIR, `${stem}.webp`)),
    small: existsSync(join(DIR, `${stem}-${SMALL_W}.jpg`)) ? SMALL_W : null,
    smallWebp: existsSync(join(DIR, `${stem}-${SMALL_W}.webp`)),
  };
}
writeFileSync('image-manifest.json', JSON.stringify(manifest, null, 1));
console.log(`manifest: ${Object.keys(manifest).length} images`);

const webpFiles = readdirSync(DIR).filter((f) => f.endsWith('.webp'));
const webpBytes = webpFiles.reduce((n, f) => n + statSync(join(DIR, f)).size, 0);
console.log(
  `webp: ${webpFiles.length} files, ${kb(webpBytes)} ` +
  `(${Math.round((1 - webpBytes / after) * 100)}% below the JPEG set)`,
);

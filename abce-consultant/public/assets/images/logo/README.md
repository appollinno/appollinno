# Brand assets

`abce-logo.png` is the **official ABCE Consultant LDA logo exactly as supplied**
— byte-for-byte the file the company provided. It has not been recoloured,
redrawn, cropped, stretched or regenerated, and it must not be.

| Property | Value |
|---|---|
| File | `abce-logo.png` |
| Dimensions | 354 × 276 px |
| Format | PNG, opaque (no alpha) |
| Background | `#ECF4F6` (very light blue-grey) |
| Artwork bounds within the file | x 70–278, y 74–222 |

## How it is used on the site

The file is **opaque**, not transparent, and the artwork sits inside a wide
blank margin. Two consequences shaped the design, and both were solved by
adapting the site rather than the logo:

1. **The header bar is `--brand-bg` (`#ECF4F6`), the logo's own background
   colour.** The logo's margin therefore blends into the bar and the mark
   reads as though it were transparent. This is why the header is a solid
   light bar on every page rather than transparent over the hero.

2. **On dark grounds** (footer, mobile menu) the logo sits on a light plate of
   the same colour — `.brand--plated` — so it reads as a deliberate badge
   rather than a stray pale rectangle.

3. **`.brand__frame` is a window onto the artwork region** (source pixels
   62,66 → 286,230). Shown whole at header height the lockup renders about
   28 px tall and "CONSULTANT LDA" is unreadable, so the *blank margin* is
   framed out. The artwork itself is shown complete, at its exact aspect
   ratio, with an 8 px margin on every side. Nothing is cropped into,
   distorted or recoloured.

To resize the logo anywhere, change `--logo-h` on `.brand__frame` — that is
the rendered height of the artwork, and every other value derives from it.

## Icons

`favicon-32.png`, `apple-touch-icon.png` and `icon-512.png` are generated from
this same file by `npm run icons`. The logo is **letterboxed** into a square
on its own background colour — never cropped to the mark and never stretched.

A consequence worth knowing: because the full stacked lockup is letterboxed
into a square, the favicon is small at 32 px. A sharper icon would use the
"A" mark alone, but that means cropping the logo, which was explicitly ruled
out. Supply a square mark-only version and `scripts/icons.mjs` will use it.

## If the logo is ever replaced

Drop the new file in as `abce-logo.png` and then:

- re-measure the artwork bounds and update the `--logo-win-*` values on
  `.brand__frame` in `src/css/components.css`;
- update `--brand-bg` in `src/css/variables.css` if the background differs;
- run `npm run icons` to regenerate the favicons and the share card.

If a **transparent** SVG or PNG becomes available, prefer it: `--brand-bg` and
the plate can then be dropped entirely, and a transparent header over the hero
becomes possible again.

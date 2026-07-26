// Generates public/og-image.png — the 1200x630 social preview card.
//
// Run manually after changing the name/title/stack copy below:
//   node scripts/gen-og-image.mjs
//
// This is NOT wired into `prebuild`. The output is committed so that builds
// stay hermetic and don't depend on the host's installed fonts (librsvg
// resolves `font-family` against system fonts, so the same script on a
// different OS can produce different metrics).

import sharp from 'sharp';
import { readFile, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');

const W = 1200;
const H = 630;
const PHOTO = 260;

// Mirrors the dark-theme design tokens in src/app/globals.css.
const BG = '#07070c';
const PANEL = '#0f0f19';
const TEXT = '#ececf4';
const MUTED = '#9c9cb0';
const ACCENT = '#9d7bff';
const ACCENT_2 = '#4fd8e8';

const NAME = 'Jefry Kurniawan';
const TITLE = 'Backend Developer · .NET Specialist';
const STACK = '.NET  ·  C#  ·  SQL Server  ·  REST APIs  ·  React';
const NOTE = '5+ years · Singapore public-sector &amp; fintech · Remote-ready (GMT+7)';
const SITE = 'porto-jefry.vercel.app';

const FONT = 'Segoe UI, Helvetica Neue, Arial, sans-serif';
const MONO = 'Consolas, DejaVu Sans Mono, Courier New, monospace';

const background = `
<svg width="${W}" height="${H}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${BG}"/>
      <stop offset="100%" stop-color="${PANEL}"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.78" cy="0.28" r="0.55">
      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <rect width="${W}" height="${H}" fill="url(#glow)"/>

  <!-- accent rule, echoes the site's kicker styling -->
  <rect x="80" y="150" width="64" height="5" rx="2.5" fill="${ACCENT}"/>

  <text x="80" y="132" font-family="${MONO}" font-size="21"
        letter-spacing="4" fill="${ACCENT}">// PORTFOLIO</text>

  <text x="80" y="248" font-family="${FONT}" font-size="76"
        font-weight="700" fill="${TEXT}">${NAME}</text>

  <text x="80" y="312" font-family="${FONT}" font-size="34"
        font-weight="600" fill="${ACCENT}">${TITLE}</text>

  <text x="80" y="378" font-family="${MONO}" font-size="24"
        fill="${MUTED}">${STACK}</text>

  <text x="80" y="452" font-family="${FONT}" font-size="23"
        fill="${MUTED}">${NOTE}</text>

  <rect x="80" y="516" width="${W - 160}" height="1" fill="${TEXT}" opacity="0.12"/>

  <text x="80" y="562" font-family="${MONO}" font-size="22"
        fill="${ACCENT_2}">${SITE}</text>
</svg>`;

const photoMask = `
<svg width="${PHOTO}" height="${PHOTO}" xmlns="http://www.w3.org/2000/svg">
  <circle cx="${PHOTO / 2}" cy="${PHOTO / 2}" r="${PHOTO / 2}" fill="#fff"/>
</svg>`;

const photoRing = `
<svg width="${PHOTO + 16}" height="${PHOTO + 16}" xmlns="http://www.w3.org/2000/svg">
  <circle cx="${(PHOTO + 16) / 2}" cy="${(PHOTO + 16) / 2}" r="${PHOTO / 2 + 6}"
          fill="none" stroke="${ACCENT}" stroke-opacity="0.55" stroke-width="3"/>
</svg>`;

const circularPhoto = await sharp(await readFile(join(ROOT, 'public/cv-photo.webp')))
    .resize(PHOTO, PHOTO, { fit: 'cover', position: 'top' })
    .composite([{ input: Buffer.from(photoMask), blend: 'dest-in' }])
    .png()
    .toBuffer();

const out = await sharp(Buffer.from(background))
    .composite([
        { input: Buffer.from(photoRing), top: 178, left: 842 },
        { input: circularPhoto, top: 186, left: 850 },
    ])
    .png({ compressionLevel: 9 })
    .toBuffer();

await writeFile(join(ROOT, 'public/og-image.png'), out);
console.log(`Wrote public/og-image.png (${W}x${H}, ${(out.length / 1024).toFixed(1)} KB)`);

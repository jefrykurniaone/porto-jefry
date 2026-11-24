import { createRequire } from 'node:module';
import { writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import sharp from 'sharp';

const require = createRequire(import.meta.url);
const fontkit = require('fontkit');

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const FONT_PATH = join(ROOT, 'src/app/fonts/JetBrainsMono-latin-wght.woff2');
const APP_DIR = join(ROOT, 'src/app');

const BG = '#07070c';
const TEXT = '#ececf4';
const ACCENT = '#9d7bff';

const VIEWBOX = 64;
const TILE_RADIUS = 14;
const MONOGRAM = 'JK';
const INK_WIDTH = 44;
const EMBOLDEN_UNITS = 56;
const BAR_GAP_UNITS = 130;
const BAR_HEIGHT_UNITS = 110;

const ICO_SIZES = [16, 32, 48];
const APPLE_SIZE = 180;
const APPLE_SCALE = 0.78;

function layoutMonogram(font) {
    const run = font.layout(MONOGRAM);
    let penX = 0;
    const paths = run.glyphs.map((glyph, index) => {
        const d = glyph.path.translate(penX, 0).toSVG();
        penX += run.positions[index].xAdvance;
        return d;
    });
    const firstBox = run.glyphs[0].bbox;
    const lastBox = run.glyphs.at(-1).bbox;
    const lastOrigin = penX - run.positions.at(-1).xAdvance;
    return {
        paths,
        minX: firstBox.minX,
        maxX: lastOrigin + lastBox.maxX,
        capHeight: font.capHeight,
    };
}

function buildSvg(mark, { radius, scale }) {
    const half = EMBOLDEN_UNITS / 2;
    const inkWidth = mark.maxX - mark.minX + EMBOLDEN_UNITS;
    const units = (INK_WIDTH * scale) / inkWidth;
    const top = mark.capHeight + half;
    const bottom = -(BAR_GAP_UNITS + BAR_HEIGHT_UNITS);
    const inkHeight = (top - bottom) * units;
    const originX = (VIEWBOX - inkWidth * units) / 2 + (half - mark.minX) * units;
    const originY = (VIEWBOX - inkHeight) / 2 + top * units;
    const barX = mark.minX - half;
    const glyphs = mark.paths.map((d) => `<path d="${d}"/>`).join('');
    return [
        `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEWBOX} ${VIEWBOX}">`,
        `<rect width="${VIEWBOX}" height="${VIEWBOX}" rx="${radius}" fill="${BG}"/>`,
        `<g transform="translate(${originX.toFixed(3)} ${originY.toFixed(3)}) scale(${units.toFixed(5)} ${(-units).toFixed(5)})">`,
        `<g fill="${TEXT}" stroke="${TEXT}" stroke-width="${EMBOLDEN_UNITS}" stroke-linejoin="round">${glyphs}</g>`,
        `<rect x="${barX}" y="${bottom}" width="${inkWidth}" height="${BAR_HEIGHT_UNITS}" fill="${ACCENT}"/>`,
        '</g>',
        '</svg>',
        '',
    ].join('\n');
}

function renderPng(svg, size) {
    return sharp(Buffer.from(svg), { density: (72 * size) / VIEWBOX })
        .resize(size, size)
        .png()
        .toBuffer();
}

function packIco(pngs) {
    const HEADER_BYTES = 6;
    const ENTRY_BYTES = 16;
    const header = Buffer.alloc(HEADER_BYTES + ENTRY_BYTES * pngs.length);
    header.writeUInt16LE(1, 2);
    header.writeUInt16LE(pngs.length, 4);
    let offset = header.length;
    pngs.forEach(({ size, data }, index) => {
        const entry = HEADER_BYTES + ENTRY_BYTES * index;
        header.writeUInt8(size, entry);
        header.writeUInt8(size, entry + 1);
        header.writeUInt16LE(1, entry + 4);
        header.writeUInt16LE(32, entry + 6);
        header.writeUInt32LE(data.length, entry + 8);
        header.writeUInt32LE(offset, entry + 12);
        offset += data.length;
    });
    return Buffer.concat([header, ...pngs.map(({ data }) => data)]);
}

async function main() {
    const mark = layoutMonogram(fontkit.openSync(FONT_PATH));
    const tabSvg = buildSvg(mark, { radius: TILE_RADIUS, scale: 1 });
    const appleSvg = buildSvg(mark, { radius: 0, scale: APPLE_SCALE });

    const icoPngs = await Promise.all(
        ICO_SIZES.map(async (size) => ({ size, data: await renderPng(tabSvg, size) })),
    );

    await writeFile(join(APP_DIR, 'icon.svg'), tabSvg);
    await writeFile(join(APP_DIR, 'favicon.ico'), packIco(icoPngs));
    await writeFile(join(APP_DIR, 'apple-icon.png'), await renderPng(appleSvg, APPLE_SIZE));
}

await main();

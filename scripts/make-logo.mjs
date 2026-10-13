// Builds transparent brand assets from the supplied white-on-black JPEG logo.
// Usage: node scripts/make-logo.mjs
import fs from 'node:fs/promises';
import sharp from 'sharp';

const SOURCE = 'public/WMS logo.jfif';
const OUT = 'public/brand';
const BLACK_POINT = 40;
const WHITE_POINT = 215;
/** Rows of the source that hold the WMS mark (with ®) and the tagline. */
const MARK_ROWS = [180, 380];
const FULL_ROWS = [180, 450];

await fs.mkdir(OUT, { recursive: true });
const { data, info } = await sharp(SOURCE).greyscale().raw().toBuffer({ resolveWithObject: true });

/** White (or black) pixels whose alpha comes from the source brightness. */
function tinted(rgb) {
  const pixels = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < info.width * info.height; i++) {
    const level = Math.round(((data[i] - BLACK_POINT) / (WHITE_POINT - BLACK_POINT)) * 255);
    pixels.set([...rgb, Math.max(0, Math.min(255, level))], i * 4);
  }
  return sharp(pixels, { raw: { width: info.width, height: info.height, channels: 4 } });
}

async function crop(rgb, [top, bottom], file, width) {
  const region = await tinted(rgb).extract({ left: 0, top, width: info.width, height: bottom - top }).png().toBuffer();
  await sharp(region).trim({ threshold: 1 }).resize({ width }).png({ compressionLevel: 9 }).toFile(`${OUT}/${file}`);
}

await crop([255, 255, 255], MARK_ROWS, 'wms-mark.png', 480);
await crop([255, 255, 255], FULL_ROWS, 'wms-logo.png', 640);
await crop([10, 10, 12], MARK_ROWS, 'wms-mark-dark.png', 480);

const mark = await sharp(`${OUT}/wms-mark.png`).resize({ width: 132 }).toBuffer();
const tile = await sharp({ create: { width: 180, height: 180, channels: 4, background: '#0a0a0a' } })
  .composite([{ input: mark, gravity: 'center' }]).png().toBuffer();
for (const size of [48, 180]) await sharp(tile).resize(size).png().toFile(`${OUT}/favicon-${size}.png`);
console.log('brand assets written to', OUT);

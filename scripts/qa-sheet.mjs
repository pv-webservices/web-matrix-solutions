// Combines QA screenshots into one contact sheet.
// Usage: node scripts/qa-sheet.mjs <dir> <prefix> <out.png> [tileWidth] [columns]
import sharp from 'sharp';
import fs from 'node:fs/promises';

const [dir, prefix, out, tileArg = '560', colsArg = '3'] = process.argv.slice(2);
const tileWidth = Number(tileArg);
const columns = Number(colsArg);
const files = (await fs.readdir(dir)).filter(file => file.startsWith(prefix) && file.endsWith('.png')).sort();
const tiles = await Promise.all(files.map(file => sharp(`${dir}/${file}`).resize({ width: tileWidth }).toBuffer({ resolveWithObject: true })));
const tileHeight = Math.max(...tiles.map(tile => tile.info.height));
const gap = 8;
await sharp({ create: { width: columns * (tileWidth + gap), height: Math.ceil(tiles.length / columns) * (tileHeight + gap), channels: 3, background: '#2a2a2a' } })
  .composite(tiles.map((tile, index) => ({ input: tile.data, left: (index % columns) * (tileWidth + gap), top: Math.floor(index / columns) * (tileHeight + gap) })))
  .png().toFile(out);
console.log(files.join('\n'));

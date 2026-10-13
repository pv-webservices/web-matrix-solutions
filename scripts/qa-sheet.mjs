// Tiles the screenshots in qa/scroll for one width into a contact sheet: node scripts/qa-sheet.mjs 1440 [cols]
import fs from 'node:fs';
import sharp from 'sharp';
const width = process.argv[2] ?? '1440';
const cols = Number(process.argv[3] ?? 3);
const files = fs.readdirSync('qa/scroll').filter(f => f.startsWith(`${width}-`) && f.endsWith('.jpg')).sort();
const tileW = 640;
const meta = await sharp(`qa/scroll/${files[0]}`).metadata();
const tileH = Math.round(tileW * meta.height / meta.width);
const tiles = await Promise.all(files.map(f => sharp(`qa/scroll/${f}`).resize(tileW, tileH).toBuffer()));
const rows = Math.ceil(tiles.length / cols);
await sharp({ create: { width: cols * tileW, height: rows * tileH, channels: 3, background: '#222' } })
  .composite(tiles.map((input, i) => ({ input, left: (i % cols) * tileW, top: Math.floor(i / cols) * tileH })))
  .jpeg({ quality: 70 }).toFile(`qa/sheet-${width}.jpg`);
console.log(files.join('\n'));

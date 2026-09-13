import fs from 'node:fs/promises';
import sharp from 'sharp';
const assets=JSON.parse(await fs.readFile('scripts/asset-downloads.json','utf8'));
await fs.mkdir('public/assets',{recursive:true});
await Promise.all(assets.map(async a=>{const res=await fetch(a.url);if(!res.ok)throw new Error(`${a.name}: ${res.status}`);const bytes=Buffer.from(await res.arrayBuffer());await sharp(bytes).webp({quality:86,effort:6}).toFile(`public/assets/${a.name}.webp`);const meta=await sharp(bytes).metadata();console.log(a.name,meta.width,meta.height)}));
await fs.writeFile('public/assets/provenance.json',JSON.stringify(assets.map(({url,...a})=>a),null,2));
await fs.mkdir('public/fonts',{recursive:true});
await fs.copyFile('node_modules/@fontsource-variable/inter/files/inter-latin-wght-normal.woff2','public/fonts/inter-latin.woff2');

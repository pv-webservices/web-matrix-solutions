// Generates site imagery with the OpenAI Images API. Reads OPENAI_API_KEY from .env.
// Usage: node scripts/generate-images.mjs [name ...]   (no names = all missing images)
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import sharp from 'sharp';
import { prompts } from './image-prompts.mjs';

const env = Object.fromEntries(readFileSync('.env', 'utf8').split(/\r?\n/).filter(l => l.includes('=')).map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim().replace(/^['"]|['"]$/g, '')]));
const KEY = env.OPENAI_API_KEY;
if (!KEY) throw new Error('OPENAI_API_KEY missing from .env');

const MODEL = 'gpt-image-2';
const OUT = 'public/assets/gen';
const CONCURRENCY = 4;
mkdirSync(OUT, { recursive: true });

const wanted = process.argv.slice(2);
const queue = prompts.filter(p => wanted.length ? wanted.includes(p.name) : !existsSync(`${OUT}/${p.name}.webp`));

async function generate({ name, prompt, size = '1536x1024', width = 1400 }) {
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ model: MODEL, prompt, size, quality: 'medium', n: 1 }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`${name}: ${json.error?.message ?? res.status}`);
  const buffer = Buffer.from(json.data[0].b64_json, 'base64');
  await sharp(buffer).resize({ width, withoutEnlargement: true }).webp({ quality: 80 }).toFile(`${OUT}/${name}.webp`);
  console.log('ok', name);
}

const failures = [];
async function worker() {
  while (queue.length) {
    const item = queue.shift();
    try { await generate(item); } catch (error) { failures.push(item.name); console.error('fail', error.message); }
  }
}
await Promise.all(Array.from({ length: CONCURRENCY }, worker));
writeFileSync(`${OUT}/provenance.json`, JSON.stringify({ model: MODEL, quality: 'medium', images: prompts.map(p => ({ name: p.name, prompt: p.prompt })) }, null, 2));
if (failures.length) { console.error('failed:', failures.join(', ')); process.exit(1); }

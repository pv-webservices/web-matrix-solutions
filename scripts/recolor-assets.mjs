// Shifts blue/violet light in selected images into the brand orange range, and cuts the
// black background out of the approach sphere. Originals are left untouched.
// Usage: node scripts/recolor-assets.mjs
import sharp from 'sharp';

const FEATHER = 18;

const jobs = [
  { from: 'public/assets/gen/service-web.webp', to: 'public/assets/gen/service-web-orange.webp', range: [175, 300], target: [8, 36] },
  { from: 'public/assets/gen/social-feed.webp', to: 'public/assets/gen/social-feed-orange.webp', range: [180, 290], target: [10, 34] },
  { from: 'public/assets/work-mobile.webp', to: 'public/assets/work-mobile-orange.webp', range: [250, 345], target: [6, 30] },
  { from: 'public/assets/process-sphere.webp', to: 'public/assets/approach-orb.webp', range: [250, 350], target: [2, 34], cutout: true },
];

function rgbToHsv(r, g, b) {
  const max = Math.max(r, g, b);
  const d = max - Math.min(r, g, b);
  let h = 0;
  if (d) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return [h, max ? d / max : 0, max];
}

function hsvToRgb(h, s, v) {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  const [r, g, b] = h < 60 ? [c, x, 0] : h < 120 ? [x, c, 0] : h < 180 ? [0, c, x] : h < 240 ? [0, x, c] : h < 300 ? [x, 0, c] : [c, 0, x];
  return [r + m, g + m, b + m];
}

/** 1 inside the source hue range, fading to 0 across FEATHER degrees outside it. */
function weight(h, [start, end]) {
  if (h >= start && h <= end) return 1;
  const distance = h < start ? start - h : h - end;
  return Math.max(0, 1 - distance / FEATHER);
}

async function recolor({ from, to, range, target, cutout = false }) {
  const { data, info } = await sharp(from).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const out = Buffer.alloc(info.width * info.height * 4);
  for (let i = 0; i < info.width * info.height; i++) {
    let [r, g, b] = [data[i * 3] / 255, data[i * 3 + 1] / 255, data[i * 3 + 2] / 255];
    const [h, s, v] = rgbToHsv(r, g, b);
    const w = weight(h, range);
    if (w > 0 && s > 0.05) {
      const t = Math.min(1, Math.max(0, (h - range[0]) / (range[1] - range[0])));
      const [nr, ng, nb] = hsvToRgb(target[0] + t * (target[1] - target[0]), s, v);
      [r, g, b] = [r + (nr - r) * w, g + (ng - g) * w, b + (nb - b) * w];
    }
    let alpha = 1;
    if (cutout) {
      // Brightness becomes coverage; un-premultiply so edges keep their colour.
      alpha = Math.min(1, Math.max(0, (Math.max(r, g, b) - 0.04) / 0.5));
      if (alpha > 0) [r, g, b] = [Math.min(1, r / alpha), Math.min(1, g / alpha), Math.min(1, b / alpha)];
    }
    out.set([r * 255, g * 255, b * 255, alpha * 255].map(Math.round), i * 4);
  }
  await sharp(out, { raw: { width: info.width, height: info.height, channels: 4 } }).webp({ quality: 82, alphaQuality: 90 }).toFile(to);
  console.log('wrote', to);
}

for (const job of jobs) await recolor(job);

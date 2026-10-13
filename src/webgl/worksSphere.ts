import {
  CanvasTexture, DoubleSide, Group, LinearSRGBColorSpace, Mesh, MeshBasicMaterial, PerspectiveCamera,
  PlaneGeometry, Scene, ShaderMaterial, TextureLoader, WebGLRenderer, type Texture,
} from 'three';
import { cardFragment, cardVertex, neonWavesFragment, screenVertex } from './shaders';

const RADIUS = 3.4;
const CARD_W = 1.5;
const CARD_H = 1.0;
const BANDS = [-56, -29, -2, 26, 53];
const SPACING = 1.32;
const FOV = 30;
const MAX_DPR = 1.75;
const EASE = 0.07;

export interface WorksSphereOptions {
  canvas: HTMLCanvasElement;
  images: readonly string[];
  titles: readonly [string, string];
}

export interface WorksSphere {
  setProgress: (progress: number) => void;
  setPointer: (x: number, y: number) => void;
  resize: () => void;
  start: () => void;
  stop: () => void;
  dispose: () => void;
}

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const span = (value: number, from: number, to: number) => clamp01((value - from) / (to - from));
const smooth = (value: number) => value * value * (3 - 2 * value);

/** A plane bent onto the sphere surface around latitude/longitude (radians). */
function sphereCard(lat: number, lon: number, scale: number): PlaneGeometry {
  const geometry = new PlaneGeometry(CARD_W * scale, CARD_H * scale, 18, 12);
  const position = geometry.attributes.position;
  const lonRadius = RADIUS * Math.cos(lat);
  for (let i = 0; i < position.count; i++) {
    const vLat = lat + position.getY(i) / RADIUS;
    const vLon = lon + position.getX(i) / lonRadius;
    position.setXYZ(i, RADIUS * Math.cos(vLat) * Math.sin(vLon), RADIUS * Math.sin(vLat), RADIUS * Math.cos(vLat) * Math.cos(vLon));
  }
  return geometry;
}

/** Deterministic pseudo-random sequence so the layout is identical every load. */
function seeded(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 16807) % 2147483647;
    return (state - 1) / 2147483646;
  };
}

function titleTexture(text: string): CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 512;
  const font = 'italic 360px "Instrument Serif", Georgia, serif';
  const texture = new CanvasTexture(canvas);
  texture.anisotropy = 4;
  const draw = () => {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = font;
    ctx.fillText(text, 1024, 270);
    texture.needsUpdate = true;
  };
  draw();
  document.fonts?.load(font).then(draw).catch(() => undefined);
  return texture;
}

export function createWorksSphere({ canvas, images, titles }: WorksSphereOptions): WorksSphere {
  const renderer = new WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.outputColorSpace = LinearSRGBColorSpace;
  renderer.setClearColor(0x050505, 1);

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 100);
  const shared = { uTime: { value: 0 }, uSpread: { value: 1 }, uOpacity: { value: 0 }, uDim: { value: 1 } };

  const background = new ShaderMaterial({
    vertexShader: screenVertex, fragmentShader: neonWavesFragment, depthTest: false, depthWrite: false,
    uniforms: { uTime: shared.uTime, uIntensity: { value: 0 }, uShift: { value: 0 }, uRes: { value: [1, 1] } },
  });
  const backgroundMesh = new Mesh(new PlaneGeometry(2, 2), background);
  backgroundMesh.frustumCulled = false;
  backgroundMesh.renderOrder = -1;
  scene.add(backgroundMesh);

  const loader = new TextureLoader();
  const textures: Texture[] = images.map(src => {
    const texture = loader.load(src);
    texture.anisotropy = 8;
    return texture;
  });

  const globe = new Group();
  scene.add(globe);
  const random = seeded(7);
  let cardIndex = 0;
  BANDS.forEach((degrees, band) => {
    const lat = (degrees * Math.PI) / 180;
    const count = Math.max(4, Math.floor((2 * Math.PI * RADIUS * Math.cos(lat)) / (CARD_W * SPACING)));
    for (let i = 0; i < count; i++) {
      const lon = (i / count) * Math.PI * 2 + band * 0.55 + (random() - 0.5) * 0.18;
      const scale = 0.84 + random() * 0.3;
      const material = new ShaderMaterial({
        vertexShader: cardVertex, fragmentShader: cardFragment, transparent: true, side: DoubleSide,
        uniforms: {
          ...shared, uSeed: { value: random() },
          uMap: { value: textures[cardIndex % textures.length] },
          uSize: { value: [CARD_W * scale, CARD_H * scale] },
        },
      });
      globe.add(new Mesh(sphereCard(lat + (random() - 0.5) * 0.08, lon, scale), material));
      cardIndex++;
    }
  });

  // The intro title sits inside the globe (front cards pass over it); the outro title floats above everything.
  const titleMaterials = titles.map((text, index) => new MeshBasicMaterial({ map: titleTexture(text), transparent: true, depthWrite: false, depthTest: index === 0, opacity: 0 }));
  titleMaterials.forEach((material, index) => {
    const title = new Mesh(new PlaneGeometry(6, 1.5), material);
    title.renderOrder = index;
    scene.add(title);
  });

  let target = 0;
  let progress = 0;
  const pointer = { x: 0, y: 0, ex: 0, ey: 0 };
  let frame = 0;
  let last = performance.now();

  function update(now: number) {
    const delta = Math.min(0.05, (now - last) / 1000);
    last = now;
    shared.uTime.value += delta;
    progress += (target - progress) * EASE;
    pointer.ex += (pointer.x - pointer.ex) * 0.05;
    pointer.ey += (pointer.y - pointer.ey) * 0.05;

    const enter = smooth(span(progress, 0, 0.22));
    const exit = smooth(span(progress, 0.78, 1));
    shared.uSpread.value = 1 - enter;
    shared.uOpacity.value = enter;
    shared.uDim.value = 1 - exit * 0.62;
    background.uniforms.uIntensity.value = 0.25 + enter * 0.75 - exit * 0.45;
    background.uniforms.uShift.value = progress * 4;

    globe.rotation.y = progress * Math.PI * 2.6 + shared.uTime.value * 0.04 + pointer.ex * 0.25;
    globe.rotation.x = -0.18 + Math.sin(progress * Math.PI) * 0.32 + pointer.ey * 0.15;
    globe.rotation.z = Math.sin(progress * Math.PI * 2) * 0.08;
    globe.scale.setScalar(0.72 + enter * 0.28 + exit * 0.06);

    titleMaterials[0].opacity = enter * (1 - smooth(span(progress, 0.72, 0.86)));
    titleMaterials[1].opacity = smooth(span(progress, 0.8, 0.94));
    renderer.render(scene, camera);
  }

  function loop(now: number) {
    update(now);
    frame = requestAnimationFrame(loop);
  }

  function resize() {
    const width = canvas.clientWidth || 1;
    const height = canvas.clientHeight || 1;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_DPR));
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    // Keep the whole globe in frame on narrow screens; let it bleed off the edges on wide ones.
    const fit = 2 * Math.tan((FOV * Math.PI) / 360) * Math.min(camera.aspect, 1.15);
    camera.position.z = Math.max(10.6, (camera.aspect < 0.8 ? 8.2 : 9.4) / fit);
    camera.updateProjectionMatrix();
    background.uniforms.uRes.value = [width, height];
  }

  resize();
  return {
    setProgress: value => { target = clamp01(value); },
    setPointer: (x, y) => { pointer.x = x; pointer.y = y; },
    resize,
    start: () => {
      if (frame) return;
      last = performance.now();
      frame = requestAnimationFrame(loop);
    },
    stop: () => { cancelAnimationFrame(frame); frame = 0; },
    dispose: () => {
      cancelAnimationFrame(frame);
      scene.traverse(object => {
        if (object instanceof Mesh) {
          object.geometry.dispose();
          (object.material as ShaderMaterial | MeshBasicMaterial).dispose();
        }
      });
      titleMaterials.forEach(material => material.map?.dispose());
      textures.forEach(texture => texture.dispose());
      renderer.dispose();
    },
  };
}

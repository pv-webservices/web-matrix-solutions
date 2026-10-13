/** Full-screen quad: positions are already in clip space. */
export const screenVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.9999, 1.0);
  }
`;

const grain = /* glsl */ `
  float grain(vec2 co) { return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453); }
`;

/** Glowing neon lines that wander and cross, like light caught in water. */
export const neonWavesFragment = /* glsl */ `
  uniform float uTime;
  uniform float uIntensity;
  uniform float uShift;
  uniform vec2 uRes;
  varying vec2 vUv;
  ${grain}

  float wave(vec2 q, float freq, float amp, float phase) {
    float y = sin(q.x * freq + phase) * amp + sin(q.x * freq * 0.47 - phase * 1.3) * amp * 0.7;
    return 0.0045 / max(abs(q.y - y), 0.0009);
  }

  void main() {
    vec2 p = (vUv - 0.5) * vec2(uRes.x / uRes.y, 1.0) * 2.0;
    float t = uTime * 0.22 + uShift;
    float glow = 0.0;
    for (int i = 0; i < 5; i++) {
      float fi = float(i);
      float a = fi * 1.05 + 0.4;
      mat2 r = mat2(cos(a), -sin(a), sin(a), cos(a));
      vec2 q = r * p;
      q.y += sin(fi * 2.3 + t * 0.4) * 0.55;
      glow += wave(q, 1.2 + fi * 0.28, 0.32, t * (0.8 + fi * 0.17) + fi * 1.7);
    }
    vec3 col = vec3(0.06, 0.28, 1.0) * glow + vec3(0.55, 0.8, 1.0) * glow * glow * 0.012;
    col = 1.0 - exp(-col * 0.9);
    col *= smoothstep(2.1, 0.3, length(p * vec2(0.62, 1.0)));
    col *= uIntensity;
    col += vec3(0.008, 0.009, 0.022);
    col += (grain(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.035;
    gl_FragColor = vec4(col, 1.0);
  }
`;

/** Flowing aurora with a glowing planet horizon and a pointer light. */
export const auroraFragment = /* glsl */ `
  uniform float uTime;
  uniform float uFade;
  uniform vec2 uRes;
  uniform vec2 uPointer;
  varying vec2 vUv;
  ${grain}

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x), mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0)), u.x), u.y);
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p = p * 2.03 + 11.7; a *= 0.5; }
    return v;
  }

  void main() {
    float aspect = uRes.x / uRes.y;
    vec2 p = (vUv - 0.5) * vec2(aspect, 1.0);
    vec2 m = (uPointer - 0.5) * vec2(aspect, 1.0);
    float t = uTime * 0.06;

    vec2 q = vec2(fbm(p * 1.5 + t), fbm(p * 1.5 - t + 3.1));
    vec2 r = vec2(fbm(p * 2.0 + q * 1.7 + vec2(1.7, 9.2) + t * 1.4), fbm(p * 2.0 + q * 1.7 + vec2(8.3, 2.8) - t));
    float f = fbm(p * 1.3 + r * 1.6);

    vec3 deep = vec3(0.006, 0.008, 0.02);
    vec3 blue = vec3(0.1, 0.32, 1.0);
    vec3 violet = vec3(0.42, 0.2, 0.95);
    vec3 col = mix(deep, blue * 0.5, smoothstep(0.42, 0.95, f) * 0.75);
    col = mix(col, violet * 0.55, smoothstep(0.58, 1.0, r.x) * 0.5);

    float ribbon = sin((p.y + f * 0.8 + p.x * 0.3) * 10.0 - uTime * 0.35);
    col += blue * pow(max(ribbon, 0.0), 14.0) * 0.28 * smoothstep(0.35, 0.9, f);

    // Planet horizon rising from the bottom edge.
    float curve = p.y + 0.62 - 0.32 * p.x * p.x / max(aspect * 0.5, 0.6);
    float rim = exp(-abs(curve) * 26.0);
    float halo = exp(-max(curve, 0.0) * 5.0) * step(0.0, curve);
    col += vec3(0.25, 0.55, 1.0) * rim * 0.9 + blue * halo * 0.35;
    col *= mix(1.0, 0.18, step(curve, 0.0) * smoothstep(0.0, -0.08, curve));

    col += vec3(0.3, 0.5, 1.0) * 0.16 * exp(-length(p - m) * 3.2);
    col *= smoothstep(1.25, 0.25, length(p * vec2(0.55, 1.0)));
    col *= uFade;
    col += (grain(gl_FragCoord.xy + fract(uTime)) - 0.5) * 0.04;
    gl_FragColor = vec4(col, 1.0);
  }
`;

/** Card on the works sphere: pushed outward while scattered, rounded corners, darker when facing away. */
export const cardVertex = /* glsl */ `
  uniform float uSpread;
  uniform float uTime;
  uniform float uSeed;
  varying vec2 vUv;
  varying float vFacing;
  void main() {
    vUv = uv;
    vec3 n = normalize(position);
    vec3 pos = position + n * (uSpread * (1.2 + uSeed * 3.4) + sin(uTime * 1.1 + uSeed * 6.283) * 0.035);
    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    vFacing = dot(normalize(normalMatrix * n), normalize(-mv.xyz));
    gl_Position = projectionMatrix * mv;
  }
`;

export const cardFragment = /* glsl */ `
  uniform sampler2D uMap;
  uniform float uOpacity;
  uniform float uDim;
  uniform vec2 uSize;
  varying vec2 vUv;
  varying float vFacing;

  float roundedBox(vec2 p, vec2 b, float r) {
    vec2 q = abs(p) - b + r;
    return length(max(q, 0.0)) + min(max(q.x, q.y), 0.0) - r;
  }

  void main() {
    vec2 p = (vUv - 0.5) * uSize;
    float d = roundedBox(p, uSize * 0.5, 0.07);
    float aa = fwidth(d) * 1.2;
    float mask = 1.0 - smoothstep(-aa, aa, d);
    if (mask < 0.01) discard;
    vec3 col = texture2D(uMap, vUv).rgb;
    float shade = gl_FrontFacing ? mix(0.5, 1.0, smoothstep(0.05, 0.7, vFacing)) : 0.26;
    col *= shade * uDim;
    float edge = 1.0 - smoothstep(0.0, 0.025, -d);
    col += vec3(0.45, 0.65, 1.0) * edge * 0.35 * uDim;
    gl_FragColor = vec4(col, mask * uOpacity);
  }
`;

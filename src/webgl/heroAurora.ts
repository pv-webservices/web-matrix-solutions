import { auroraFragment } from './shaders';

const MAX_DPR = 1.5;
const VERTEX = `
  attribute vec2 aPosition;
  varying vec2 vUv;
  void main() {
    vUv = aPosition * 0.5 + 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

export interface HeroAurora {
  setPointer: (x: number, y: number) => void;
  setFade: (value: number) => void;
  resize: () => void;
  start: () => void;
  stop: () => void;
  dispose: () => void;
}

function compile(gl: WebGLRenderingContext, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error('Could not create shader');
  gl.shaderSource(shader, `precision highp float;\n${source}`);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(shader) ?? 'Shader compile failed');
  return shader;
}

/**
 * Full-screen aurora shader behind the hero, in plain WebGL so three.js stays out of the
 * first load. `animate: false` renders a single still frame.
 */
export function createHeroAurora(canvas: HTMLCanvasElement, animate: boolean): HeroAurora {
  const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreference: 'high-performance' });
  if (!gl) throw new Error('WebGL unavailable');

  const program = gl.createProgram();
  const vertex = compile(gl, gl.VERTEX_SHADER, VERTEX);
  const fragment = compile(gl, gl.FRAGMENT_SHADER, auroraFragment);
  gl.attachShader(program, vertex);
  gl.attachShader(program, fragment);
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) throw new Error('Shader link failed');
  gl.useProgram(program);

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const position = gl.getAttribLocation(program, 'aPosition');
  gl.enableVertexAttribArray(position);
  gl.vertexAttribPointer(position, 2, gl.FLOAT, false, 0, 0);

  const uniform = (name: string) => gl.getUniformLocation(program, name);
  const u = { time: uniform('uTime'), fade: uniform('uFade'), res: uniform('uRes'), pointer: uniform('uPointer') };

  const state = { time: 12, fade: 1 };
  const pointer = { x: 0.5, y: 0.7, ex: 0.5, ey: 0.7 };
  let frame = 0;
  let last = performance.now();

  const render = () => {
    gl.uniform1f(u.time, state.time);
    gl.uniform1f(u.fade, state.fade);
    gl.uniform2f(u.pointer, pointer.ex, pointer.ey);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
  };

  function loop(now: number) {
    state.time += Math.min(0.05, (now - last) / 1000);
    last = now;
    pointer.ex += (pointer.x - pointer.ex) * 0.04;
    pointer.ey += (pointer.y - pointer.ey) * 0.04;
    render();
    frame = requestAnimationFrame(loop);
  }

  function resize() {
    const dpr = Math.min(window.devicePixelRatio, MAX_DPR);
    canvas.width = Math.max(1, Math.round(canvas.clientWidth * dpr));
    canvas.height = Math.max(1, Math.round(canvas.clientHeight * dpr));
    gl!.viewport(0, 0, canvas.width, canvas.height);
    gl!.uniform2f(u.res, canvas.width, canvas.height);
    if (!frame) render();
  }

  resize();
  return {
    setPointer: (x, y) => { pointer.x = x; pointer.y = y; },
    setFade: value => {
      state.fade = value;
      if (!frame) render();
    },
    resize,
    start: () => {
      if (frame || !animate) return;
      last = performance.now();
      frame = requestAnimationFrame(loop);
    },
    stop: () => { cancelAnimationFrame(frame); frame = 0; },
    dispose: () => {
      cancelAnimationFrame(frame);
      gl.deleteBuffer(buffer);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
    },
  };
}

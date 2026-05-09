/**
 * Псевдо-3D стекло как в примере OGL Fresnel: выпуклая «капля» внутри панели
 * даёт нормали как у изогнутой поверхности → по краям (и углам) сильнее скользящий
 * угол, как у тора в демо.
 *
 * @see https://oframe.github.io/ogl/examples/?src=fresnel.html
 * @see https://github.com/oframe/ogl/blob/master/examples/fresnel.html
 */
import { Color, Mesh, Program, Renderer, Triangle } from "ogl";

const LENS_VERT = /* glsl */ `
attribute vec2 uv;
attribute vec2 position;

varying vec2 vUv;

void main() {
  vUv = uv;
  gl_Position = vec4(position, 0.0, 1.0);
}
`;

/**
 * z(p) = amp · (1 − |p|²)² на нормированном прямоугольнике (−1,1)² → нормали как у линзы.
 * Fresnel: те же pow(dot, ·) и pow(1−dot, ·), смешивание uBaseColor / uFresnelColor.
 */
const LENS_FRAG = /* glsl */ `
precision highp float;

varying vec2 vUv;

uniform vec2 uResolution;
uniform float uIntensity;
uniform float uLensAmp;
uniform float uFresnelPower;
uniform vec3 uBaseColor;
uniform vec3 uFresnelColor;
uniform float uAlphaBody;
uniform float uAlphaRim;

void main() {
  vec2 res = uResolution;
  float ar = res.x / max(res.y, 1.0);

  vec2 p = (vUv - 0.5) * 2.0;
  p.x *= ar;

  vec2 pn = vec2(p.x / ar, p.y);

  if (abs(pn.x) >= 1.0 || abs(pn.y) >= 1.0) {
    gl_FragColor = vec4(0.0);
    return;
  }

  float r2 = dot(pn, pn);
  float inner = max(0.0, 1.0 - r2);

  vec2 dZd = -4.0 * uLensAmp * inner * pn;
  vec3 N = normalize(vec3(-dZd.x, -dZd.y, 1.0));
  vec3 V = vec3(0.0, 0.0, 1.0);

  float facing = abs(dot(V, N));
  float glancing = 1.0 - facing;

  float fFace = pow(facing, uFresnelPower);
  float fGlance = pow(glancing, uFresnelPower);

  vec3 rgb = fFace * uBaseColor + fGlance * uFresnelColor;
  float alpha = (fFace * uAlphaBody + fGlance * uAlphaRim) * uIntensity;
  vec3 premul = rgb * alpha;

  gl_FragColor = vec4(premul, alpha);
}
`;

export type GlassLensRuntime = {
  renderer: Renderer;
  mesh: Mesh;
  program: Program;
  geometry: Triangle;
  resize: (cssW: number, cssH: number) => void;
  render: (intensity: number) => void;
  dispose: () => void;
};

/** Нейтральные тона под UI без цветового акцента */
const BASE = new Color("#8a8b90");
const FRESNEL_HI = new Color("#e6e6ea");

const DEFAULT_FRESNEL_POWER = 1.65;
const DEFAULT_LENS_AMP = 0.28;
const DEFAULT_ALPHA_BODY = 0.05;
const DEFAULT_ALPHA_RIM = 0.38;

export function createGlassLensRuntime(
  canvas: HTMLCanvasElement,
): GlassLensRuntime | null {
  const dpr = Math.min(
    typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1,
    2,
  );

  const renderer = new Renderer({
    canvas,
    width: 1,
    height: 1,
    dpr,
    alpha: true,
    depth: false,
    stencil: false,
    premultipliedAlpha: true,
    antialias: false,
    webgl: 1,
  });

  const gl = renderer.gl;
  if (!gl) return null;

  gl.clearColor(0, 0, 0, 0);

  const geometry = new Triangle(gl);

  const program = new Program(gl, {
    vertex: LENS_VERT,
    fragment: LENS_FRAG,
    uniforms: {
      uResolution: { value: [1, 1] },
      uIntensity: { value: 1 },
      uLensAmp: { value: DEFAULT_LENS_AMP },
      uFresnelPower: { value: DEFAULT_FRESNEL_POWER },
      uBaseColor: { value: BASE },
      uFresnelColor: { value: FRESNEL_HI },
      uAlphaBody: { value: DEFAULT_ALPHA_BODY },
      uAlphaRim: { value: DEFAULT_ALPHA_RIM },
    },
    transparent: true,
    cullFace: false,
    depthTest: false,
    depthWrite: false,
  });

  const mesh = new Mesh(gl, {
    geometry,
    program,
    frustumCulled: false,
  });

  function syncResolutionUniform() {
    const w = gl.drawingBufferWidth;
    const h = gl.drawingBufferHeight;
    const res = program.uniforms.uResolution.value as number[];
    res[0] = Math.max(1, w);
    res[1] = Math.max(1, h);
  }

  function resize(cssW: number, cssH: number) {
    const ww = Math.max(1, Math.floor(cssW));
    const hh = Math.max(1, Math.floor(cssH));
    renderer.setSize(ww, hh);
    syncResolutionUniform();
  }

  function render(intensity: number) {
    program.uniforms.uIntensity.value = intensity;
    renderer.render({ scene: mesh });
  }

  function dispose() {
    geometry.remove();
    program.remove();
  }

  return {
    renderer,
    mesh,
    program,
    geometry,
    resize,
    render,
    dispose,
  };
}

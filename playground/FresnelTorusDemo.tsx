/**
 * Демо: 3D-тор с эффектом Френеля, как в examples/fresnel.html из ogl.
 *
 * Поток данных:
 * 1) Renderer создаёт WebGL-контекст и canvas.
 * 2) Camera задаёт обзор (перспектива, позиция, куда смотрит).
 * 3) Сцена: задник и одна mesh — только «центральный стакан» (цилиндр + крышки).
 * 4) Program — шейдеры + uniform’ы; полупрозрачность (блендинг, depthWrite: false).
 * 5) Два прохода: фон в RenderTarget → на экран фон + тор, читающий RT со смещением (преломление у кромок).
 *
 * @see https://github.com/oframe/ogl/blob/master/examples/fresnel.html
 */
import {
  Camera,
  Color,
  Mesh,
  Orbit,
  Plane,
  Program,
  RenderTarget,
  Renderer,
  Transform,
} from "ogl";
import { useEffect, useRef } from "react";
import { createPlugGeometry } from "./solidTorusGeometry";

/**
 * Вершинный шейдер: для каждой вершины меша считает данные для фрагментного.
 * - position/normal — из геометрии Torus (ogl сам прокидывает в атрибуты).
 * - Матрицы model / modelView / projection выставляет ogl при рендере.
 * - cameraPosition — позиция камеры в мировых координатах (нужна для «взгляда»).
 */
const VERTEX = /* glsl */ `
  attribute vec3 position;
  attribute vec3 normal;

  uniform mat4 modelMatrix;
  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform mat3 normalMatrix;
  uniform vec3 cameraPosition;

  varying vec3 vWorldNormal;
  varying vec3 vViewDirection;
  varying vec3 vViewNormal;

  void main() {
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    vWorldNormal = normalize(modelMatrix * vec4(normal, 0.0)).xyz;
    vViewDirection = normalize(cameraPosition - worldPosition.xyz);
    vViewNormal = normalize(normalMatrix * normal);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

/**
 * Фрагментный шейдер: Френель + выборка фона из uSceneMap со сдвигом UV.
 * Сдвиг усиливается у кромок (inverse fresnel) — искажение сильнее сбоку.
 */
const FRAGMENT = /* glsl */ `
  precision highp float;

  uniform vec3 uBaseColor;
  uniform vec3 uFresnelColor;
  uniform float uFresnelPower;
  uniform float uAlphaBody;
  uniform float uAlphaRim;
  uniform sampler2D uSceneMap;
  uniform vec2 uResolution;
  uniform float uRefractPx;

  varying vec3 vWorldNormal;
  varying vec3 vViewDirection;
  varying vec3 vViewNormal;

  void main() {
    float fresnelFactor = abs(dot(vViewDirection, vWorldNormal));
    float inversefresnelFactor = 1.0 - fresnelFactor;

    fresnelFactor = pow(fresnelFactor, uFresnelPower);
    inversefresnelFactor = pow(inversefresnelFactor, uFresnelPower);

    // Направление сдвига: в view space у «лица» к камере vViewNormal.xy ≈ 0 — почти не смещало;
    // берём мир + запасной вектор, плюс базовая доля сдвига, чтобы искажение было заметно везде.
    float edge = inversefresnelFactor;
    vec2 dir =
      length(vWorldNormal.xy) > 0.08
        ? normalize(vWorldNormal.xy)
        : (length(vViewNormal.xy) > 0.02 ? normalize(vViewNormal.xy) : vec2(1.0, 0.35));
    dir = normalize(dir + vec2(1.0e-4));
    float strength = 0.5 + 0.92 * edge;
    vec2 offsetPx = dir * uRefractPx * strength;

    // Текстура с FBO в WebGL ориентирована как bottom-left; переворачиваем Y при чтении.
    vec2 uv = gl_FragCoord.xy / uResolution;
    uv.y = 1.0 - uv.y;
    vec2 refractUv = uv + offsetPx / uResolution;
    refractUv = clamp(refractUv, vec2(0.002), vec2(0.998));

    vec3 refracted = texture2D(uSceneMap, refractUv).rgb;

    vec3 lit =
      fresnelFactor * uBaseColor + inversefresnelFactor * uFresnelColor;
    float seeThrough = mix(0.9, 0.45, inversefresnelFactor);
    vec3 rgb = mix(lit, refracted, seeThrough);

    float alpha =
      fresnelFactor * uAlphaBody + inversefresnelFactor * uAlphaRim;
    alpha = clamp(alpha, 0.0, 1.0);

    gl_FragColor = vec4(rgb, alpha);
  }
`;

/** Задник: большая плоскость позади тора; шахматная кладка по UV — хорошо видно сквозь стекло. */
const BG_VERTEX = /* glsl */ `
  attribute vec3 position;
  attribute vec2 uv;

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;

  varying vec2 vUv;

  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const BG_FRAGMENT = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  void main() {
    vec2 g = floor(vUv * 14.0);
    float c = mod(g.x + g.y, 2.0);
    vec3 a = vec3(0.92, 0.38, 0.42);
    vec3 b = vec3(0.22, 0.36, 0.72);
    gl_FragColor = vec4(mix(a, b, c), 1.0);
  }
`;

export function FresnelTorusDemo() {
  /** Контейнер в DOM: сюда вставляем canvas и по его размеру настраиваем viewport. */
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = hostRef.current;
    if (!root) return;

    // Палитра и сила Френеля — те же параметры, что в официальном примере.
    const params = {
      backgroundColor: new Color("#e6e8eb"),
      baseColor: new Color("#000000"),
      fresnelColor: new Color("#e6e8eb"),
      fresnelFactor: 1.5,
      /** Прозрачность «в лоб» (видно фон сильнее). */
      alphaBody: 0.18,
      /** Прозрачность у кромок / скользящего блика (плотнее). */
      alphaRim: 0.72,
      /** Сила смещения при «преломлении» (пиксели буфера; ~×1.4 дополнительно даёт strength в шейдере). */
      refractPx: 220,
    };

    // webgl: 1 — те же GLSL100 / texture2D, что и в kit; WebGL2 без #version 300 часто ломает молча линковку.
    const renderer = new Renderer({
      dpr: Math.min(typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1, 2),
      alpha: true,
      webgl: 1,
    });
    const gl = renderer.gl;

    // Цвет очистки буфера кадра перед каждым render (небо за тором).
    const bg = params.backgroundColor;
    gl.clearColor(bg[0], bg[1], bg[2], 1);
    root.appendChild(gl.canvas);

    const canvas = gl.canvas;
    canvas.style.display = "block";
    // Растягиваем canvas по CSS; реальное разрешение задаёт renderer.setSize в resize.
    canvas.style.width = "100%";
    canvas.style.height = "100%";

    // Перспективная камера: fov — угол обзора; позиция и lookAt — стартовый ракурс как в демо.
    const camera = new Camera(gl, { fov: 35 });
    camera.position.set(0, 1, 7);
    camera.lookAt([0, 0, 0]);

    const scene = new Transform();

    const bgProgram = new Program(gl, {
      vertex: BG_VERTEX,
      fragment: BG_FRAGMENT,
    });
    const backPlane = new Plane(gl, {
      width: 14,
      height: 10,
      widthSegments: 1,
      heightSegments: 1,
    });
    const backdrop = new Mesh(gl, { geometry: backPlane, program: bgProgram });
    backdrop.position.set(0, 0, -6);
    backdrop.setParent(scene);

    /** Текстура кадра без тора — тор смещает UV при чтении, имитируя преломление у рёбер. */
    let refractionTarget: RenderTarget | null = null;

    function syncRefractionTarget(): RenderTarget {
      const rw = gl.drawingBufferWidth;
      const rh = gl.drawingBufferHeight;
      if (!refractionTarget) {
        refractionTarget = new RenderTarget(gl, {
          width: rw,
          height: rh,
          depth: true,
        });
      } else {
        refractionTarget.setSize(rw, rh);
      }
      return refractionTarget;
    }

    function resize() {
      const el = hostRef.current;
      if (!el) return;
      const w = Math.max(1, el.clientWidth);
      const h = Math.max(1, el.clientHeight);
      renderer.setSize(w, h);
      camera.perspective({ aspect: gl.canvas.width / Math.max(gl.canvas.height, 1) });
      syncRefractionTarget();
    }

    const ro = new ResizeObserver(resize);
    ro.observe(root);
    resize();

    const sceneTexture = syncRefractionTarget();

    const program = new Program(gl, {
      vertex: VERTEX,
      fragment: FRAGMENT,
      transparent: true,
      depthWrite: false,
      uniforms: {
        uBaseColor: { value: params.baseColor },
        uFresnelColor: { value: params.fresnelColor },
        uFresnelPower: { value: params.fresnelFactor },
        uAlphaBody: { value: params.alphaBody },
        uAlphaRim: { value: params.alphaRim },
        uSceneMap: { value: sceneTexture.texture },
        uResolution: {
          value: [gl.drawingBufferWidth, gl.drawingBufferHeight],
        },
        uRefractPx: { value: params.refractPx },
      },
    });

    const plugGeometry = createPlugGeometry(gl, {
      innerRadius: 0.64,
      squashY: 0.52,
      plugHalfZ: 0.29,
      plugRadialSegments: 32,
    });

    const solid = new Mesh(gl, { geometry: plugGeometry, program });
    solid.setParent(scene);

    const controls = new Orbit(camera, { element: canvas });

    let raf = 0;
    function update() {
      raf = requestAnimationFrame(update);
      controls.update();

      const res = program.uniforms.uResolution.value as number[];
      res[0] = gl.drawingBufferWidth;
      res[1] = gl.drawingBufferHeight;

      solid.visible = false;
      renderer.render({ scene, camera, target: sceneTexture });
      solid.visible = true;
      renderer.render({ scene, camera });
    }
    raf = requestAnimationFrame(update);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      controls.remove();
      if (refractionTarget) {
        gl.deleteFramebuffer(refractionTarget.buffer);
        refractionTarget = null;
      }
      backPlane.remove();
      bgProgram.remove();
      plugGeometry.remove();
      program.remove();
      canvas.remove();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="h-[100dvh] w-full min-h-[320px]"
      aria-label="Демо WebGL: цилиндр со стенками и крышками (Fresnel + преломление)"
    />
  );
}

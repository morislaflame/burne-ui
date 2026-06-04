import html2canvas from "html2canvas";
import { useCallback, useEffect, useRef } from "react";

import { FRAGMENT_SHADER_STANDALONE, VERTEX_SHADER } from "./liquidGlassShader";

export type LiquidGlassShape = "rounded" | "circle" | "pill";

export interface LiquidGlassControls {
  edgeIntensity?: number;
  rimIntensity?: number;
  baseIntensity?: number;
  edgeDistance?: number;
  rimDistance?: number;
  baseDistance?: number;
  cornerBoost?: number;
  rippleEffect?: number;
  blurRadius?: number;
  tintOpacity?: number;
  warp?: boolean;
}

export interface UseLiquidGlassOptions extends LiquidGlassControls {
  shape?: LiquidGlassShape;
  borderRadius?: number;
  /** CSS selector for elements to ignore during page capture */
  ignoreSelector?: string;
}

interface GlRefs {
  gl: WebGLRenderingContext;
  texture: WebGLTexture;
  scrollYLoc: WebGLUniformLocation | null;
  resolutionLoc: WebGLUniformLocation | null;
  textureSizeLoc: WebGLUniformLocation | null;
  pageHeightLoc: WebGLUniformLocation | null;
  viewportHeightLoc: WebGLUniformLocation | null;
  blurRadiusLoc: WebGLUniformLocation | null;
  borderRadiusLoc: WebGLUniformLocation | null;
  containerPositionLoc: WebGLUniformLocation | null;
  warpLoc: WebGLUniformLocation | null;
  edgeIntensityLoc: WebGLUniformLocation | null;
  rimIntensityLoc: WebGLUniformLocation | null;
  baseIntensityLoc: WebGLUniformLocation | null;
  edgeDistanceLoc: WebGLUniformLocation | null;
  rimDistanceLoc: WebGLUniformLocation | null;
  baseDistanceLoc: WebGLUniformLocation | null;
  cornerBoostLoc: WebGLUniformLocation | null;
  rippleEffectLoc: WebGLUniformLocation | null;
  tintOpacityLoc: WebGLUniformLocation | null;
  imageLoc: WebGLUniformLocation | null;
}

let sharedSnapshot: HTMLCanvasElement | null = null;
let isCapturing = false;
let waitingCallbacks: Array<(snapshot: HTMLCanvasElement) => void> = [];

function compileShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string,
): WebGLShader | null {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error("Shader compile error:", gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(
  gl: WebGLRenderingContext,
  vsSource: string,
  fsSource: string,
): WebGLProgram | null {
  const vs = compileShader(gl, gl.VERTEX_SHADER, vsSource);
  const fs = compileShader(gl, gl.FRAGMENT_SHADER, fsSource);
  if (!vs || !fs) return null;

  const program = gl.createProgram();
  if (!program) return null;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error("Program link error:", gl.getProgramInfoLog(program));
    return null;
  }
  return program;
}

function captureSnapshot(
  ignoreSelector: string | undefined,
  onReady: (snapshot: HTMLCanvasElement) => void,
) {
  if (sharedSnapshot) {
    onReady(sharedSnapshot);
    return;
  }

  waitingCallbacks.push(onReady);

  if (isCapturing) return;

  isCapturing = true;

  html2canvas(document.body, {
    scale: 1,
    useCORS: true,
    allowTaint: true,
    backgroundColor: null,
    ignoreElements: (el) => {
      if (ignoreSelector && el.matches(ignoreSelector)) return true;
      return (
        el.classList.contains("liquid-glass-root") ||
        el.classList.contains("liquid-glass-canvas")
      );
    },
  })
    .then((snapshot) => {
      sharedSnapshot = snapshot;
      isCapturing = false;
      const pending = waitingCallbacks.slice();
      waitingCallbacks = [];
      pending.forEach((cb) => cb(snapshot));
    })
    .catch((err) => {
      console.error("LiquidGlass: html2canvas error", err);
      isCapturing = false;
      waitingCallbacks = [];
    });
}

/** Reset the shared snapshot (call on significant DOM changes or window resize) */
export function resetLiquidGlassSnapshot() {
  sharedSnapshot = null;
}

export function useLiquidGlass(
  canvasRef: React.RefObject<HTMLCanvasElement | null>,
  containerRef: React.RefObject<HTMLElement | null>,
  options: UseLiquidGlassOptions = {},
) {
  const {
    shape = "rounded",
    borderRadius: borderRadiusProp,
    edgeIntensity = 0.01,
    rimIntensity = 0.05,
    baseIntensity = 0.01,
    edgeDistance = 0.15,
    rimDistance = 0.8,
    baseDistance = 0.1,
    cornerBoost = 0.02,
    rippleEffect = 0.1,
    blurRadius = 5.0,
    tintOpacity = 0.2,
    warp = false,
    ignoreSelector,
  } = options;

  const glRefsRef = useRef<GlRefs | null>(null);
  const rafRef = useRef<number | null>(null);
  const scrollHandlerRef = useRef<(() => void) | null>(null);
  const destroyedRef = useRef(false);

  const getCanvasBorderRadius = useCallback(
    (w: number, h: number): number => {
      if (borderRadiusProp !== undefined) return borderRadiusProp;
      if (shape === "circle") return Math.min(w, h) / 2;
      if (shape === "pill") return h / 2;
      return 48;
    },
    [shape, borderRadiusProp],
  );

  const getPosition = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
  }, [canvasRef]);

  const setupShader = useCallback(
    (image: HTMLImageElement) => {
      const canvas = canvasRef.current;
      if (!canvas || destroyedRef.current) return;

      const gl = canvas.getContext("webgl", {
        preserveDrawingBuffer: true,
        alpha: true,
      });
      if (!gl) {
        console.error("LiquidGlass: WebGL not supported");
        return;
      }

      const program = createProgram(gl, VERTEX_SHADER, FRAGMENT_SHADER_STANDALONE);
      if (!program) return;

      gl.useProgram(program);

      const positionBuffer = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
        gl.STATIC_DRAW,
      );

      const texcoordBuffer = gl.createBuffer()!;
      gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
      gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array([0, 1, 1, 1, 0, 0, 0, 0, 1, 1, 1, 0]),
        gl.STATIC_DRAW,
      );

      const positionLoc = gl.getAttribLocation(program, "a_position");
      const texcoordLoc = gl.getAttribLocation(program, "a_texcoord");

      const texture = gl.createTexture()!;
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);

      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
      gl.enableVertexAttribArray(positionLoc);
      gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

      gl.bindBuffer(gl.ARRAY_BUFFER, texcoordBuffer);
      gl.enableVertexAttribArray(texcoordLoc);
      gl.vertexAttribPointer(texcoordLoc, 2, gl.FLOAT, false, 0, 0);

      const w = canvas.width;
      const h = canvas.height;
      const br = getCanvasBorderRadius(w, h);

      const refs: GlRefs = {
        gl,
        texture,
        resolutionLoc: gl.getUniformLocation(program, "u_resolution"),
        textureSizeLoc: gl.getUniformLocation(program, "u_textureSize"),
        scrollYLoc: gl.getUniformLocation(program, "u_scrollY"),
        pageHeightLoc: gl.getUniformLocation(program, "u_pageHeight"),
        viewportHeightLoc: gl.getUniformLocation(program, "u_viewportHeight"),
        blurRadiusLoc: gl.getUniformLocation(program, "u_blurRadius"),
        borderRadiusLoc: gl.getUniformLocation(program, "u_borderRadius"),
        containerPositionLoc: gl.getUniformLocation(
          program,
          "u_containerPosition",
        ),
        warpLoc: gl.getUniformLocation(program, "u_warp"),
        edgeIntensityLoc: gl.getUniformLocation(program, "u_edgeIntensity"),
        rimIntensityLoc: gl.getUniformLocation(program, "u_rimIntensity"),
        baseIntensityLoc: gl.getUniformLocation(program, "u_baseIntensity"),
        edgeDistanceLoc: gl.getUniformLocation(program, "u_edgeDistance"),
        rimDistanceLoc: gl.getUniformLocation(program, "u_rimDistance"),
        baseDistanceLoc: gl.getUniformLocation(program, "u_baseDistance"),
        cornerBoostLoc: gl.getUniformLocation(program, "u_cornerBoost"),
        rippleEffectLoc: gl.getUniformLocation(program, "u_rippleEffect"),
        tintOpacityLoc: gl.getUniformLocation(program, "u_tintOpacity"),
        imageLoc: gl.getUniformLocation(program, "u_image"),
      };

      glRefsRef.current = refs;

      gl.uniform2f(refs.resolutionLoc, w, h);
      gl.uniform2f(refs.textureSizeLoc, image.width, image.height);
      gl.uniform1f(refs.blurRadiusLoc, blurRadius);
      gl.uniform1f(refs.borderRadiusLoc, br);
      gl.uniform1f(refs.warpLoc, warp ? 1.0 : 0.0);
      gl.uniform1f(refs.edgeIntensityLoc, edgeIntensity);
      gl.uniform1f(refs.rimIntensityLoc, rimIntensity);
      gl.uniform1f(refs.baseIntensityLoc, baseIntensity);
      gl.uniform1f(refs.edgeDistanceLoc, edgeDistance);
      gl.uniform1f(refs.rimDistanceLoc, rimDistance);
      gl.uniform1f(refs.baseDistanceLoc, baseDistance);
      gl.uniform1f(refs.cornerBoostLoc, cornerBoost);
      gl.uniform1f(refs.rippleEffectLoc, rippleEffect);
      gl.uniform1f(refs.tintOpacityLoc, tintOpacity);

      const pos = getPosition();
      gl.uniform2f(refs.containerPositionLoc, pos.x, pos.y);

      const pageHeight = Math.max(
        document.body.scrollHeight,
        document.documentElement.scrollHeight,
      );
      gl.uniform1f(refs.pageHeightLoc, pageHeight);
      gl.uniform1f(refs.viewportHeightLoc, window.innerHeight);

      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.uniform1i(refs.imageLoc, 0);

      const render = () => {
        if (!glRefsRef.current || destroyedRef.current) return;
        gl.clear(gl.COLOR_BUFFER_BIT);
        const scrollY =
          window.pageYOffset || document.documentElement.scrollTop;
        gl.uniform1f(refs.scrollYLoc, scrollY);
        const p = getPosition();
        gl.uniform2f(refs.containerPositionLoc, p.x, p.y);
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      };

      render();

      const handleScroll = () => render();
      scrollHandlerRef.current = handleScroll;
      window.addEventListener("scroll", handleScroll, { passive: true });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      canvasRef,
      getCanvasBorderRadius,
      getPosition,
      blurRadius,
      warp,
      edgeIntensity,
      rimIntensity,
      baseIntensity,
      edgeDistance,
      rimDistance,
      baseDistance,
      cornerBoost,
      rippleEffect,
      tintOpacity,
    ],
  );

  const initWebGL = useCallback(
    (snapshot: HTMLCanvasElement) => {
      if (destroyedRef.current) return;
      const img = new Image();
      img.src = snapshot.toDataURL();
      img.onload = () => {
        if (!destroyedRef.current) setupShader(img);
      };
    },
    [setupShader],
  );

  useEffect(() => {
    destroyedRef.current = false;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ro = new ResizeObserver(() => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const w = Math.ceil(rect.width);
      const h = Math.ceil(rect.height);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        const refs = glRefsRef.current;
        if (refs) {
          refs.gl.viewport(0, 0, w, h);
          refs.gl.uniform2f(refs.resolutionLoc, w, h);
          const br = getCanvasBorderRadius(w, h);
          refs.gl.uniform1f(refs.borderRadiusLoc, br);
        }
      }
    });

    if (containerRef.current) ro.observe(containerRef.current);

    captureSnapshot(ignoreSelector, initWebGL);

    return () => {
      destroyedRef.current = true;
      ro.disconnect();
      if (scrollHandlerRef.current) {
        window.removeEventListener("scroll", scrollHandlerRef.current);
        scrollHandlerRef.current = null;
      }
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
      glRefsRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { glRefsRef };
}

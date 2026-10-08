/**
 * Static box-shadow layers. GSAP tweens layer `opacity` only — the shadow
 * strings stay in CSS variables so theme knobs update without a paint tween.
 */

import { gsap } from "./gsapMotion";

export type ShadowFadeName = "rest" | "hover" | "press";
/** `"elevation"` is the kit host. A plugin passes its own kind and gets a separate host. */
export type ShadowFadeKind = "elevation" | (string & {});

const HOST_ATTR = "data-burne-shadow-fade";
const LAYER_ATTR = "data-shadow-fade";
const NAMES: readonly ShadowFadeName[] = ["rest", "hover", "press"];

function hostSelector(kind: string): string {
  const value = typeof CSS !== "undefined" && CSS.escape ? CSS.escape(kind) : kind;
  return `:scope > [${HOST_ATTR}="${value}"]`;
}

export function ensureShadowFadeHost(
  element: HTMLElement,
  kind: ShadowFadeKind = "elevation"): HTMLElement {
  let host = element.querySelector<HTMLElement>(hostSelector(kind));
  if (!host) {
    host = document.createElement("span");
    host.setAttribute("aria-hidden", "true");
    host.setAttribute(HOST_ATTR, kind);
    for (const name of NAMES) {
      const layer = document.createElement("span");
      layer.setAttribute(LAYER_ATTR, name);
      host.appendChild(layer);
    }
    element.appendChild(host);
  }
  return host;
}

export function removeShadowFadeHost(
  element: HTMLElement,
  kind: ShadowFadeKind = "elevation"): void {
  element.querySelector(hostSelector(kind))?.remove();
}

function fadeLayer(host: HTMLElement, name: ShadowFadeName): HTMLElement | null {
  return host.querySelector<HTMLElement>(`[${LAYER_ATTR}="${name}"]`);
}

/** Snap layer opacities. Rest starts visible; hover and press start hidden. */
export function snapShadowFade(
  element: HTMLElement,
  active: ShadowFadeName,
  kind: ShadowFadeKind = "elevation"): void {
  const host = ensureShadowFadeHost(element, kind);
  for (const name of NAMES) {
    const layer = fadeLayer(host, name);
    if (!layer) continue;
    gsap.set(layer, { opacity: name === active ? 1 : 0, overwrite: "auto", force3D: false });
  }
}

/**
 * Cross-fade to `active`. When `timeline` is set, layers start with the
 * previous tween on that timeline (the scale tween added just before).
 */
export function playShadowFade(
  element: HTMLElement,
  active: ShadowFadeName,
  options: {
    duration: number;
    ease: string;
    timeline?: gsap.core.Timeline;
    kind?: ShadowFadeKind;
  }): void {
  const host = ensureShadowFadeHost(element, options.kind ?? "elevation");
  for (const name of NAMES) {
    const layer = fadeLayer(host, name);
    if (!layer) continue;
    const vars = {
      opacity: name === active ? 1 : 0,
      duration: options.duration,
      ease: options.ease,
      overwrite: "auto" as const,
      force3D: false,
    };
    if (options.timeline) options.timeline.to(layer, vars, "<");
    else gsap.to(layer, vars);
  }
}

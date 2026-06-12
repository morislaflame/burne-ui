/**
 * GSAP setup and shared motion helpers for Burne UI.
 */

import gsap from "gsap";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

import { getMotionConfig } from "./motionConfig";

gsap.registerPlugin(CustomEase, useGSAP);

const RIPPLE_EASE_ID = "brn-ripple";

let cachedRippleCss = "";

/** Ensures CustomEase for ripple is registered from current motion config. */
export function ensureRippleEase(): string {
  const css = getMotionConfig().rippleEaseCss;
  if (cachedRippleCss !== css) {
    const m = /cubic-bezier\(\s*([\d.]+),\s*([\d.]+),\s*([\d.]+),\s*([\d.]+)\s*\)/.exec(css);
    if (m) {
      CustomEase.create(RIPPLE_EASE_ID, `${m[1]},${m[2]},${m[3]},${m[4]}`);
    } else {
      CustomEase.create(RIPPLE_EASE_ID, "0.25,0.55,0.35,0.95");
    }
    cachedRippleCss = css;
  }
  return RIPPLE_EASE_ID;
}

/** Stops active tweens on target(s) and clears inline styles GSAP may have set. */
export function killMotion(...targets: gsap.TweenTarget[]): void {
  gsap.killTweensOf(targets);
}

/** Converts configured duration (ms) to GSAP seconds. */
export function msToSec(ms: number): number {
  return ms / 1000;
}

export { gsap, useGSAP };

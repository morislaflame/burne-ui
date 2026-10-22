import { useState } from "react";
import gsap from "gsap";

import { SelectionIndicator } from "@/components/core/SelectionIndicator";
import type { MotionContext } from "@/components/core/utils/slotMotion";

import { IndicatorToggle } from "./IndicatorToggle";

function checkPath(el: HTMLElement): SVGPathElement | null {
  const path = el.querySelector("path");
  return path instanceof SVGPathElement ? path : null;
}

function drawCheck(ctx: MotionContext) {
  const path = checkPath(ctx.el);
  if (!path) return ctx.to({ autoAlpha: 1, scale: 1, duration: ctx.reduced ? 0 : 0.2 });
  const length = path.getTotalLength();
  ctx.onCleanup(() => {
    gsap.killTweensOf(path);
  });
  if (length === 0 || ctx.reduced) {
    gsap.set(path, { strokeDasharray: length, strokeDashoffset: 0 });
    return ctx.to({ autoAlpha: 1, scale: 1, duration: 0 });
  }
  gsap.set(path, { strokeDasharray: length, strokeDashoffset: length });
  const stroke = gsap.to(path, {
    strokeDashoffset: 0,
    duration: 0.45,
    ease: "power2.out",
    overwrite: "auto",
  });
  const tl = ctx.timeline();
  tl.to(ctx.el, { autoAlpha: 1, scale: 1, duration: 0.16 }, 0);
  tl.add(stroke, 0);
  return tl;
}

function hideCheck(ctx: MotionContext) {
  const path = checkPath(ctx.el);
  if (path) {
    const length = path.getTotalLength();
    ctx.onCleanup(() => {
      gsap.killTweensOf(path);
    });
    if (!ctx.reduced && length > 0) {
      gsap.to(path, {
        strokeDashoffset: length,
        duration: 0.2,
        ease: "power2.in",
        overwrite: "auto",
      });
    }
  }
  return ctx.to({ autoAlpha: 0, scale: 0.92, duration: ctx.reduced ? 0 : 0.18 });
}

export function SelectionIndicatorMotionStrokeDrawDemo() {
  const [selected, setSelected] = useState(false);

  return (
    <IndicatorToggle selected={selected} onToggle={() => setSelected((value) => !value)}>
      <SelectionIndicator
        size="large"
        selected={selected}
        check
        motion={{
          mark: { check: drawCheck, uncheck: hideCheck },
        }}
      />
    </IndicatorToggle>
  );
}

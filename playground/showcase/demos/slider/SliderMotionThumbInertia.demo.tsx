import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";

import { Slider } from "@/components/core/Slider";

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function bubbleX(wrap: HTMLElement, thumb: HTMLElement, bubble: HTMLElement): number {
  const wrapBox = wrap.getBoundingClientRect();
  const thumbBox = thumb.getBoundingClientRect();
  return thumbBox.left + thumbBox.width / 2 - wrapBox.left - bubble.offsetWidth / 2;
}

export function SliderMotionThumbInertiaDemo() {
  const [value, setValue] = useState(42);
  const wrapRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLButtonElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const xToRef = useRef<((next: number) => void) | null>(null);
  const primedRef = useRef(false);

  useLayoutEffect(() => {
    const bubble = bubbleRef.current;
    if (!bubble) return;
    xToRef.current = gsap.quickTo(bubble, "x", {
      duration: prefersReducedMotion() ? 0 : 0.45,
      ease: "power3.out",
      overwrite: "auto",
      force3D: false,
    });
    return () => {
      xToRef.current = null;
      gsap.killTweensOf(bubble);
    };
  }, []);

  useLayoutEffect(() => {
    const wrap = wrapRef.current;
    const thumb = thumbRef.current;
    const bubble = bubbleRef.current;
    const xTo = xToRef.current;
    if (!wrap || !thumb || !bubble || !xTo) return;
    const x = bubbleX(wrap, thumb, bubble);
    if (!primedRef.current) {
      primedRef.current = true;
      gsap.set(bubble, { x, force3D: false });
      return;
    }
    xTo(x);
  }, [value]);

  return (
    <Slider className="w-full max-w-sm">
      <Slider.Header>
        <Slider.Label>Inertia bubble</Slider.Label>
      </Slider.Header>
      <div ref={wrapRef} className="relative pt-2xlarge">
        <div
          ref={bubbleRef}
          aria-hidden
          className="pointer-events-none absolute top-0 left-0 z-tooltip min-w-control-small rounded-mid border-token bg-surface px-small py-xsmall text-center text-small font-w-mid text-foreground shadow-token-large tabular-nums"
        >
          {value}
        </div>
        <Slider.Track value={value} onValueChange={setValue}>
          <Slider.Rail />
          <Slider.Fill />
          <Slider.Thumb ref={thumbRef} />
        </Slider.Track>
      </div>
      <Slider.Hint>
        Bubble lags behind the thumb via GSAP quickTo on x — not slot phase change, not kit Tooltip.
      </Slider.Hint>
    </Slider>
  );
}

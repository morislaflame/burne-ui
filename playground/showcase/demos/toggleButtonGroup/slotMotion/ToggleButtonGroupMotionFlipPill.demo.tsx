import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { Flip } from "gsap/Flip";

import { ToggleButtonGroup } from "@/components/composite/ToggleButtonGroup";
import { ToggleButton } from "@/components/core/ToggleButton";

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const NO_FILL = { fill: { check: false as const, uncheck: false as const } };

export function ToggleButtonGroupMotionFlipPillDemo() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pillRef = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState("list");

  useLayoutEffect(() => {
    gsap.registerPlugin(Flip);
    const wrap = wrapRef.current;
    const pill = pillRef.current;
    if (!wrap || !pill) return;
    const selected = wrap.querySelector(
      `[data-toggle-button-value="${CSS.escape(value)}"]`,
    );
    if (!(selected instanceof HTMLElement)) return;

    const first = pill.getBoundingClientRect().width < 2;
    Flip.fit(pill, selected, {
      duration: first || prefersReducedMotion() ? 0 : 0.38,
      ease: "power2.inOut",
      scale: false,
    });

    return () => {
      Flip.killFlipsOf(pill);
    };
  }, [value]);

  return (
    <div ref={wrapRef} className="relative w-fit">
      <span
        ref={pillRef}
        aria-hidden
        className="pointer-events-none absolute left-0 top-0 z-0 rounded-mid bg-primary/20"
      />
      <ToggleButtonGroup
        type="single"
        segmented
        variant="outline"
        aria-label="View with Flip pill"
        value={value}
        onValueChange={(next) => setValue(next as string)}
        className="relative z-[1]"
      >
        <ToggleButton value="list" motion={NO_FILL}>
          List
        </ToggleButton>
        <ToggleButton value="grid" motion={NO_FILL}>
          Grid
        </ToggleButton>
        <ToggleButton value="card" motion={NO_FILL}>
          Cards
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}

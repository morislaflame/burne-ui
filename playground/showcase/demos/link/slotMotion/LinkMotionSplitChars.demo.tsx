import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

import { Link } from "@/components/core/Link";

import { preventNav } from "../../../shared/utils";

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

function findLinkTextSlot(anchor: HTMLAnchorElement): HTMLElement | null {
  for (const child of Array.from(anchor.children)) {
    if (child instanceof HTMLElement && child.getAttribute("aria-hidden") !== "true") {
      return child;
    }
  }
  return null;
}

const CHAR = {
  overwrite: "auto" as const,
  force3D: false,
};

export function LinkMotionSplitCharsDemo() {
  const linkRef = useRef<HTMLAnchorElement>(null);
  const splitRef = useRef<SplitText | null>(null);

  useLayoutEffect(() => {
    const link = linkRef.current;
    if (!link || prefersReducedMotion()) return;
    gsap.registerPlugin(SplitText);
    const textSlot = findLinkTextSlot(link);
    const textEl =
      textSlot?.firstElementChild instanceof HTMLElement ? textSlot.firstElementChild : textSlot;
    if (!textEl) return;
    const split = SplitText.create(textEl, { type: "chars" });
    splitRef.current = split;
    return () => {
      gsap.killTweensOf(split.chars);
      split.revert();
      splitRef.current = null;
    };
  }, []);

  const wave = () => {
    const chars = splitRef.current?.chars;
    if (!chars?.length) return;
    gsap.to(chars, {
      ...CHAR,
      y: -8,
      rotation: -10,
      duration: 0.32,
      stagger: { each: 0.028, from: "start" },
      ease: "back.out(1.6)",
    });
  };

  const rest = () => {
    const chars = splitRef.current?.chars;
    if (!chars?.length) return;
    gsap.to(chars, {
      ...CHAR,
      y: 0,
      rotation: 0,
      duration: 0.22,
      stagger: { each: 0.018, from: "end" },
      ease: "power2.out",
    });
  };

  return (
    <div className="flex justify-center py-large">
      <Link
        ref={linkRef}
        href="#"
        onClick={preventNav}
        onPointerEnter={wave}
        onPointerLeave={rest}
        aria-label="Changelog"
        classNames={{ text: "overflow-visible" }}
        motion={{
          root: { hoverIn: false, hoverOut: false, pressIn: false },
        }}
      >
        Changelog
      </Link>
    </div>
  );
}

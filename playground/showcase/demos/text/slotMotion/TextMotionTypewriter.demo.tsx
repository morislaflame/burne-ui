import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { TextPlugin } from "gsap/TextPlugin";

import { Text } from "@/components/core/Text";

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const FIRST = "Ship the system.";
const SECOND = "Keep the motion.";

const TYPE = {
  ease: "none" as const,
  overwrite: "auto" as const,
  force3D: false,
};

export function TextMotionTypewriterDemo() {
  const textRef = useRef<HTMLElement>(null);

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el) return;
    gsap.registerPlugin(TextPlugin);
    if (prefersReducedMotion()) {
      el.textContent = SECOND;
      return;
    }
    const tl = gsap.timeline();
    gsap.set(el, { text: "" });
    tl.to(el, { ...TYPE, duration: 1.15, text: FIRST });
    tl.to(el, { ...TYPE, duration: 0.42, text: "" }, "+=0.38");
    tl.to(el, { ...TYPE, duration: 1.2, text: SECOND });
    return () => {
      tl.kill();
      gsap.killTweensOf(el);
      el.textContent = SECOND;
    };
  }, []);

  return (
    <div className="flex justify-center py-large">
      <Text
        ref={textRef}
        variant="header-2"
        as="p"
        aria-label={SECOND}
        className="min-h-[1.4em]"
        motion={{
          root: { enter: false, hoverIn: false, hoverOut: false },
        }}
      >
        {FIRST}
      </Text>
    </div>
  );
}

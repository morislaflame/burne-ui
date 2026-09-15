import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";

import { Text } from "@/components/core/Text";

function prefersReducedMotion(): boolean {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

const WORD = {
  overwrite: "auto" as const,
  force3D: false,
};

export function TextMotionSplitWordsDemo() {
  const textRef = useRef<HTMLElement>(null);
  const splitRef = useRef<SplitText | null>(null);

  useLayoutEffect(() => {
    const el = textRef.current;
    if (!el || prefersReducedMotion()) return;
    gsap.registerPlugin(SplitText);
    const split = SplitText.create(el, { type: "words" });
    splitRef.current = split;
    gsap.set(el, { perspective: 720 });
    gsap.set(split.words, {
      display: "inline-block",
      transformOrigin: "50% 80%",
      rotateX: 0,
      y: 0,
      opacity: 1,
    });
    return () => {
      gsap.killTweensOf(split.words);
      split.revert();
      splitRef.current = null;
    };
  }, []);

  const foldIn = () => {
    const words = splitRef.current?.words;
    if (!words?.length) return;
    gsap.fromTo(
      words,
      { y: 22, rotateX: -82, opacity: 0 },
      {
        ...WORD,
        y: 0,
        rotateX: 0,
        opacity: 1,
        duration: 0.55,
        stagger: { each: 0.07, from: "center" },
        ease: "back.out(1.5)",
      },
    );
  };

  const foldOut = () => {
    const words = splitRef.current?.words;
    if (!words?.length) return;
    gsap.to(words, {
      ...WORD,
      y: 0,
      rotateX: 0,
      opacity: 1,
      duration: 0.28,
      stagger: { each: 0.04, from: "edges" },
      ease: "power2.out",
    });
  };

  return (
    <div className="flex justify-center py-large">
      <Text
        ref={textRef}
        variant="header-2"
        className="overflow-visible py-mid"
        onPointerEnter={foldIn}
        onPointerLeave={foldOut}
        motion={{
          root: { hoverIn: false, hoverOut: false, pressIn: false },
        }}
      >
        Motion that reads as type
      </Text>
    </div>
  );
}

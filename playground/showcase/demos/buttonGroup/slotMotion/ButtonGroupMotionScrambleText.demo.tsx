import { useLayoutEffect } from "react";
import gsap from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";

import { ButtonGroup } from "@/components/composite/ButtonGroup";
import { Button } from "@/components/core/Button";
import type { MotionContext } from "@/components/core/utils/slotMotion";

function scrambleCaption(ctx: MotionContext) {
  const label = ctx.el.querySelector("span");
  if (!(label instanceof HTMLElement)) return;
  gsap.registerPlugin(ScrambleTextPlugin);
  const original = label.textContent ?? "";
  if (ctx.reduced) return;
  ctx.onCleanup(() => {
    gsap.killTweensOf(label);
    label.textContent = original;
  });
  return gsap.to(label, {
    duration: 0.75,
    scrambleText: {
      text: original,
      chars: "01",
      speed: 0.55,
      revealDelay: 0.12,
      tweenLength: false,
    },
    overwrite: "auto",
  });
}

export function ButtonGroupMotionScrambleTextDemo() {
  useLayoutEffect(() => {
    gsap.registerPlugin(ScrambleTextPlugin);
  }, []);

  return (
    <ButtonGroup aria-label="View">
      <ButtonGroup.Text
        motion={{
          enter: scrambleCaption,
          hoverIn: scrambleCaption,
        }}
      >
        View
      </ButtonGroup.Text>
      <Button>List</Button>
      <Button>Grid</Button>
    </ButtonGroup>
  );
}

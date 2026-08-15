import gsap from "gsap";

import { ButtonGroup } from "@/components/composite/ButtonGroup";
import { Button } from "@/components/core/Button";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

const TL = { overwrite: "auto" as const, force3D: false };

export function ButtonGroupMotionTextTintDemo() {
  return (
    <ButtonGroup
      motion={{
        text: {
          enter: (ctx) => {
            const tl = gsap.timeline({ ...TL });
            tl.fromTo(ctx.el, { scale: 0.9 }, { scale: 1, duration: 0.22 }, 0);
            tweenCssColor(ctx.el, "var(--color-primary)");
            return tl;
          },
        },
      }}
    >
      <Button>Left</Button>
      <ButtonGroup.Text>and</ButtonGroup.Text>
      <Button>Right</Button>
    </ButtonGroup>
  );
}

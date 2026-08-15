import gsap from "gsap";

import { ButtonGroup } from "@/components/composite/ButtonGroup";
import { Button } from "@/components/core/Button";

const TL = { overwrite: "auto" as const, force3D: false };

export function ButtonGroupMotionRootWaveDemo() {
  return (
    <ButtonGroup
      motion={{
        root: {
          enter: (ctx) =>
            gsap.fromTo(ctx.el, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3, ...TL }),
        },
        text: {
          enter: (ctx) => gsap.fromTo(ctx.el, { y: 4 }, { y: 0, duration: 0.22, ...TL }),
        },
      }}
    >
      <Button>Cut</Button>
      <ButtonGroup.Text>or</ButtonGroup.Text>
      <Button>Copy</Button>
    </ButtonGroup>
  );
}

import { ButtonGroup } from "@/components/composite/ButtonGroup";
import { Button } from "@/components/core/Button";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

export function ButtonGroupMotionTextTintDemo() {
  return (
    <ButtonGroup
      motion={{
        text: {
          enter: (ctx) => {
            const tl = ctx.timeline();
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

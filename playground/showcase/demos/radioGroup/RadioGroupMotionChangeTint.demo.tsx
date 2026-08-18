import { RadioGroup } from "@/components/composite/RadioGroup";
import { Radio } from "@/components/core/Radio";
import { tweenCssColor } from "@/components/core/utils/gsapMotion";

export function RadioGroupMotionChangeTintDemo() {
  return (
    <RadioGroup
      defaultValue="pro"
      motion={{
        root: {
          change: (ctx) => {
            const tl = ctx.timeline();
            tl.to(ctx.el, { y: -2, duration: 0.1 }, 0);
            tl.to(ctx.el, { y: 0, duration: 0.14 }, 0.1);
            tweenCssColor(ctx.el, "var(--color-primary)");
            return tl;
          },
        },
      }}
    >
      <RadioGroup.Legend>
        <RadioGroup.Label>Single</RadioGroup.Label>
      </RadioGroup.Legend>
      <RadioGroup.List>
        <Radio value="pro" label="Pro" />
        <Radio value="team" label="Team" />
      </RadioGroup.List>
    </RadioGroup>
  );
}

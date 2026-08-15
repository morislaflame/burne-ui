import gsap from "gsap";

import { Radio } from "@/components/core/Radio";

export function RadioMotionSpinningMarkDemo() {
  return (
    <Radio name="radio-motion-spin" value="a" defaultChecked>
      <Radio.Control>
        <Radio.Indicator>
          <Radio.Indicator.Fill />
          <Radio.Indicator.Mark
            motion={{
              check: (ctx) =>
                gsap.fromTo(
                  ctx.el,
                  { rotate: -90, scale: 0.4, autoAlpha: 0 },
                  {
                    rotate: 0,
                    scale: 1,
                    autoAlpha: 1,
                    duration: 0.4,
                    ease: "back.out(2.2)",
                    overwrite: "auto",
                    force3D: false,
                  },
                ),
              uncheck: (ctx) =>
                gsap.to(ctx.el, {
                  rotate: 45,
                  scale: 0.5,
                  autoAlpha: 0,
                  duration: 0.18,
                  overwrite: "auto",
                  force3D: false,
                }),
            }}
          />
        </Radio.Indicator>
      </Radio.Control>
      <Radio.Content>
        <Radio.Label>Spinning mark</Radio.Label>
        <Radio.Hint>motion on Radio.Indicator.Mark</Radio.Hint>
      </Radio.Content>
    </Radio>
  );
}

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
                ctx.fromTo(
                  { rotate: -90, scale: 0.4, autoAlpha: 0 },
                  {
                    rotate: 0,
                    scale: 1,
                    autoAlpha: 1,
                    duration: 0.4,
                    ease: "back.out(2.2)",
                  },
                ),
              uncheck: (ctx) =>
                ctx.to({
                  rotate: 45,
                  scale: 0.5,
                  autoAlpha: 0,
                  duration: 0.18,
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

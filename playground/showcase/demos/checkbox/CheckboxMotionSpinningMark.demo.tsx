import { Checkbox } from "@/components/core/Checkbox";

export function CheckboxMotionSpinningMarkDemo() {
  return (
    <Checkbox defaultChecked>
      <Checkbox.Control>
        <Checkbox.Indicator>
          <Checkbox.Indicator.Fill />
          <Checkbox.Indicator.Mark
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
        </Checkbox.Indicator>
      </Checkbox.Control>
      <Checkbox.Content>
        <Checkbox.Label>Spinning mark</Checkbox.Label>
        <Checkbox.Hint>motion on Checkbox.Indicator.Mark</Checkbox.Hint>
      </Checkbox.Content>
    </Checkbox>
  );
}

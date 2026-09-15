import { Switch } from "@/components/core/Switch";

export function SwitchMotionBounceThumbDemo() {
  return (
    <Switch
      defaultChecked
      label="Bounce thumb"
      hint="thumb factory — back.out instead of switchThumb."
      motion={{
        thumb: {
          check: (ctx) => {
            const travel = ctx.params.getTravelPx?.() ?? 0;
            return ctx.to({
              x: travel,
              duration: 0.45,
              ease: "back.out(1.6)",
            });
          },
          uncheck: { x: 0, duration: 0.22, ease: "power2.in" },
        },
      }}
    />
  );
}

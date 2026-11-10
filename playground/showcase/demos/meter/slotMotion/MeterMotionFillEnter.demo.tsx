import { Meter } from "@/components/core/Meter";

export function MeterMotionFillEnterDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-large">
      <Meter
        label="Recipe enter"
        showValue
        value={64}
        motion={{ fill: { enter: "progressFill" } }}
      />
      <Meter
        label="Custom fill"
        showValue
        value={64}
        motion={{
          fill: {
            enter: (ctx) => {
              const scale = ctx.params.getProgressScale?.() ?? 0;
              const horizontal = ctx.params.isHorizontal !== false;
              return ctx.fromTo(
                horizontal ? { scaleX: 0, scaleY: 1 } : { scaleX: 1, scaleY: 0 },
                horizontal
                  ? { scaleX: scale, scaleY: 1, duration: 0.7, ease: "power3.out" }
                  : { scaleX: 1, scaleY: scale, duration: 0.7, ease: "power3.out" },
              );
            },
          },
        }}
      />
    </div>
  );
}

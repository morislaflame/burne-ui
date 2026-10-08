import { DatePicker } from "@/components/core/DatePicker";

export function DatePickerMotionWaveDemo() {
  return (
    <DatePicker
      label="Date"
      motion={{
        trigger: {
          hoverIn: (ctx) => {
            const tl = ctx.timeline();
            tl.to(ctx.el, { y: -3, duration: 0.22 }, 0);
            if (ctx.targets.icon) tl.to(ctx.targets.icon, { rotation: 16, duration: 0.22 }, 0);
            if (ctx.targets.label) tl.to(ctx.targets.label, { y: -3, duration: 0.22 }, 0.04);
            return tl;
          },
          hoverOut: (ctx) => {
            const tl = ctx.timeline();
            tl.to(ctx.el, { y: 0, duration: 0.18 }, 0);
            if (ctx.targets.icon) tl.to(ctx.targets.icon, { rotation: 0, duration: 0.18 }, 0);
            if (ctx.targets.label) tl.to(ctx.targets.label, { y: 0, duration: 0.18 }, 0);
            return tl;
          },
        },
      }}
    />
  );
}

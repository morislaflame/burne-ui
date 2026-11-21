import { Switch } from "@/components/core/Switch";

export function SwitchMotionTrackDemo() {
  return (
    <Switch
      defaultChecked
      label="Track pulse"
      hint="check/uncheck plays on Switch.Track like Meter.track."
      motion={{
        track: {
          check: (ctx) =>
            ctx.fromTo(
              { scale: 1 },
              { scale: 1.06, duration: 0.18, ease: "power2.out", yoyo: true, repeat: 1 },
            ),
          uncheck: (ctx) =>
            ctx.fromTo(
              { scale: 1 },
              { scale: 0.96, duration: 0.16, ease: "power2.in", yoyo: true, repeat: 1 },
            ),
        },
      }}
    />
  );
}

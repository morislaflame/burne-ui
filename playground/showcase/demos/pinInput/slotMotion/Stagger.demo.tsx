import { PinInput } from "@/components/core/PinInput";

export function PinInputMotionStaggerDemo() {
  return (
    <PinInput
      label="Code"
      length={4}
      motion={{
        group: {
          enter: (ctx) => {
            const tl = ctx.timeline();
            let at = 0;
            for (const el of ctx.getTargets("field")) {
              tl.fromTo(el, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.28 }, at);
              at += 0.08;
            }
            return tl;
          },
        },
      }}
    />
  );
}

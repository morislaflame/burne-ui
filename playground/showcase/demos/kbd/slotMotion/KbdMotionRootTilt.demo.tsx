import { Kbd } from "@/components/core/Kbd";

export function KbdMotionRootTiltDemo() {
  return (
    <Kbd
      variant="secondary"
      motion={{
        root: {
          hoverIn: (ctx) =>
            ctx.to({ rotation: -8, y: -2, duration: 0.22, ease: "power2.out" }),
          hoverOut: (ctx) =>
            ctx.to({ rotation: 0, y: 0, duration: 0.18, ease: "power2.out" }),
        },
      }}
    >
      ⌘
    </Kbd>
  );
}

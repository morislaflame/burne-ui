import { Kbd } from "@/components/core/Kbd";

export function KbdMotionKeyBounceDemo() {
  return (
    <Kbd
      variant="primary"
      motion={{
        root: {
          hoverIn: { scale: 1.12, y: -4, duration: 0.28, ease: "back.out(2.4)" },
          hoverOut: { scale: 1, y: 0, duration: 0.18, ease: "power2.out" },
        },
      }}
    >
      Enter
    </Kbd>
  );
}

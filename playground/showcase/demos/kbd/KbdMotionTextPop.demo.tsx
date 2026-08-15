import { Kbd } from "@/components/core/Kbd";

export function KbdMotionTextPopDemo() {
  return (
    <Kbd variant="outline" hoverLift={false}>
      <Kbd.Text
        size="base"
        motion={{
          hoverIn: { scale: 1.18, y: -1, duration: 0.2 },
          hoverOut: { scale: 1, y: 0, duration: 0.16 },
        }}
      >
        Shift
      </Kbd.Text>
    </Kbd>
  );
}

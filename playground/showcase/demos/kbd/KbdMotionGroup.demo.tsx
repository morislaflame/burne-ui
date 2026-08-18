import { Kbd } from "@/components/core/Kbd";

export function KbdMotionGroupDemo() {
  return (
    <Kbd.Group
      motion={{
        enter: (ctx) =>
          ctx.fromTo({ y: 6, opacity: 0 }, { y: 0, opacity: 1, duration: 0.24 }),
      }}
    >
      <Kbd>⌘</Kbd>
      <Kbd>K</Kbd>
    </Kbd.Group>
  );
}

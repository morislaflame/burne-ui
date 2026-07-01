import { Kbd } from "@/components/core/Kbd";

export function KbdGroupDemo() {
  return (
    <div className="flex flex-col gap-mid">
      <Kbd.Group>
        <Kbd>⌘</Kbd>
        <Kbd>K</Kbd>
      </Kbd.Group>
      <Kbd.Group>
        <Kbd variant="secondary">Ctrl</Kbd>
        <Kbd variant="secondary">Shift</Kbd>
        <Kbd variant="secondary">P</Kbd>
      </Kbd.Group>
    </div>
  );
}

import { Kbd } from "@/components/core/Kbd";

export function KbdSizesDemo() {
  return (
    <div className="flex flex-wrap items-end gap-small">
      <Kbd size="small">Esc</Kbd>
      <Kbd size="base">Esc</Kbd>
      <Kbd size="mid">Esc</Kbd>
      <Kbd size="large">Esc</Kbd>
    </div>
  );
}

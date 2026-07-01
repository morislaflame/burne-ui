import { Kbd } from "@/components/core/Kbd";

export function KbdVariantsDemo() {
  return (
    <div className="flex flex-wrap gap-small">
      <Kbd>Default</Kbd>
      <Kbd variant="primary">Primary</Kbd>
      <Kbd variant="secondary">Secondary</Kbd>
      <Kbd variant="outline">Outline</Kbd>
      <Kbd variant="gloss">Gloss</Kbd>
    </div>
  );
}

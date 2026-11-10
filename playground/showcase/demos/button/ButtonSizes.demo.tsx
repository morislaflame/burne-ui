import { Button } from "@/components/core/Button";

export function ButtonSizesDemo() {
  return (
    <div className="flex flex-wrap items-center gap-small">
      <Button size="small">Small</Button>
      <Button size="base">Base</Button>
      <Button size="mid">Mid</Button>
      <Button size="large">Large</Button>
    </div>
  );
}

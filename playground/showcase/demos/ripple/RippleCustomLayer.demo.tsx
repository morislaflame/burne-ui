import { Button } from "@/components/core/Button";
import { Ripple } from "@/components/core/Ripple";

export function RippleCustomLayerDemo() {
  return (
    <div className="relative inline-flex w-fit overflow-hidden rounded-mid">
      <Ripple color="neutral" />
      <Button variant="secondary" className="relative z-[1]">
        Кастомный Ripple
      </Button>
    </div>
  );
}

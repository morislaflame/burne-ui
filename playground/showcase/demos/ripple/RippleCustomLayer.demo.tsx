import { Button } from "@/components/core/Button";
import { Ripple } from "@/components/core/Ripple";

export function RippleCustomLayerDemo() {
  return (
    <div className="relative inline-flex w-fit overflow-hidden rounded-mid border-token bg-secondary shadow-token-base">
      <Ripple color="neutral" />
      <Button variant="ghost" className="relative z-[1] border-0 bg-transparent">
        Custom Ripple
      </Button>
    </div>
  );
}

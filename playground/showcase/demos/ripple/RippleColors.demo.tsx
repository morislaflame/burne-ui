import { Button } from "@/components/core/Button";
import { Ripple } from "@/components/core/Ripple";

export function RippleColorsDemo() {
  return (
    <div className="flex flex-wrap gap-small">
      <div className="relative inline-flex overflow-hidden rounded-mid">
        <Ripple color="neutral" />
        <Button variant="outline" className="relative z-[1]">
          neutral
        </Button>
      </div>
      <div className="relative inline-flex overflow-hidden rounded-mid">
        <Ripple color="primarySolid" />
        <Button variant="primary" className="relative z-[1]">
          primarySolid
        </Button>
      </div>
      <div className="relative inline-flex overflow-hidden rounded-mid">
        <Ripple color="danger" />
        <Button variant="primary" status="danger" className="relative z-[1]">
          danger
        </Button>
      </div>
    </div>
  );
}

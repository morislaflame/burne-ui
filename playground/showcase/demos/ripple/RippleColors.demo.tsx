import { Button } from "@/components/core/Button";
import { Ripple } from "@/components/core/Ripple";

export function RippleColorsDemo() {
  return (
    <div className="flex flex-wrap gap-small">
      <div className="relative inline-flex overflow-hidden rounded-mid border-token bg-surface shadow-token-sm">
        <Ripple color="neutral" />
        <Button variant="ghost" className="relative z-[1] border-0 bg-transparent">
          neutral
        </Button>
      </div>
      <div className="relative inline-flex overflow-hidden rounded-mid border border-transparent bg-primary shadow-token-sm">
        <Ripple color="primarySolid" />
        <Button variant="ghost" className="relative z-[1] border-0 bg-transparent text-primary-foreground">
          primarySolid
        </Button>
      </div>
      <div className="relative inline-flex overflow-hidden rounded-mid border border-transparent bg-danger shadow-token-sm">
        <Ripple color="danger" />
        <Button variant="ghost" className="relative z-[1] border-0 bg-transparent text-danger-foreground">
          danger
        </Button>
      </div>
    </div>
  );
}

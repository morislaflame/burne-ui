import { Button } from "@/components/core/Button";
import { HoverCard } from "@/components/core/HoverCard";

const SIZES = ["small", "base", "mid", "large"] as const;

export function HoverCardSizesDemo() {
  return (
    <div className="flex flex-wrap items-center justify-center gap-2xlarge py-large">
      {SIZES.map((size) => (
        <HoverCard
          key={size}
          size={size}
          side="bottom"
          openDelay={0}
          trigger={
            <Button variant="outline" type="button" size={size} className="capitalize">
              {size}
            </Button>
          }
          title={`Size ${size}`}
          description="Padding, type scale, and panel width for this size."
        />
      ))}
    </div>
  );
}

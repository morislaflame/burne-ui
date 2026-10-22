import type { ReactNode } from "react";

import { Button } from "@/components/core/Button";

export function IndicatorToggle({
  selected,
  onToggle,
  children,
}: {
  selected: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <div className="flex items-center gap-2xlarge">
      <Button size="small" variant="outline" onClick={onToggle}>
        {selected ? "Uncheck" : "Check"}
      </Button>
      {children}
    </div>
  );
}

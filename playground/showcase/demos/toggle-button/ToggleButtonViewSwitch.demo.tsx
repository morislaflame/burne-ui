import { useState } from "react";
import { IoGridOutline, IoListOutline } from "react-icons/io5";

import { ToggleButton } from "@/components/core/ToggleButton";

export function ToggleButtonViewSwitchDemo() {
  const [view, setView] = useState<"list" | "grid">("list");

  return (
    <div className="inline-flex rounded-mid border-token bg-tertiary p-xsmall gap-xsmall">
      <ToggleButton
        pressed={view === "list"}
        onPressedChange={(pressed) => pressed && setView("list")}
        variant="ghost"
        size="small"
        aria-label="List"
      >
        <IoListOutline aria-hidden />
      </ToggleButton>
      <ToggleButton
        pressed={view === "grid"}
        onPressedChange={(pressed) => pressed && setView("grid")}
        variant="ghost"
        size="small"
        aria-label="Grid"
      >
        <IoGridOutline aria-hidden />
      </ToggleButton>
    </div>
  );
}

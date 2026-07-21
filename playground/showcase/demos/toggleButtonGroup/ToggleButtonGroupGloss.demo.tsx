import { useState } from "react";
import { IoGridOutline, IoListOutline, IoSquareOutline } from "react-icons/io5";

import { ToggleButtonGroup } from "@/components/composite/ToggleButtonGroup";
import { ToggleButton } from "@/components/core/ToggleButton";

export function ToggleButtonGroupGlossDemo() {
  const [view, setView] = useState("list");

  return (
    <ToggleButtonGroup
      type="single"
      variant="gloss"
      aria-label="Gloss catalog view"
      value={view}
      onValueChange={(v) => setView(v as string)}
    >
      <ToggleButton value="list" icon={<IoListOutline aria-hidden />}>
        List
      </ToggleButton>
      <ToggleButton value="grid" icon={<IoGridOutline aria-hidden />}>
        Net
      </ToggleButton>
      <ToggleButton value="tiles" icon={<IoSquareOutline aria-hidden />}>
        Tiles
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

import { useState } from "react";
import { IoGridOutline, IoListOutline } from "react-icons/io5";

import { ToggleButtonGroup } from "@/components/composite/ToggleButtonGroup";
import { ToggleButton } from "@/components/core/ToggleButton";

export function ToggleButtonGroupSingleDemo() {
  const [viewMode, setViewMode] = useState("list");

  return (
    <ToggleButtonGroup
      type="single"
      aria-label="Вид списка"
      value={viewMode}
      onValueChange={(v) => setViewMode(v as string)}
    >
      <ToggleButton variant="default" value="list" leftIcon={<IoListOutline aria-hidden />}>
        Список
      </ToggleButton>
      <ToggleButton value="grid" leftIcon={<IoGridOutline aria-hidden />}>
        Сетка
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

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
      aria-label="Gloss вид каталога"
      value={view}
      onValueChange={(v) => setView(v as string)}
    >
      <ToggleButton value="list" leftIcon={<IoListOutline aria-hidden />}>
        Список
      </ToggleButton>
      <ToggleButton value="grid" leftIcon={<IoGridOutline aria-hidden />}>
        Сетка
      </ToggleButton>
      <ToggleButton value="tiles" leftIcon={<IoSquareOutline aria-hidden />}>
        Плитки
      </ToggleButton>
    </ToggleButtonGroup>
  );
}

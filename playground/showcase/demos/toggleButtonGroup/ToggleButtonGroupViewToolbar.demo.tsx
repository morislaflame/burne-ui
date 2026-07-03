import { useState } from "react";
import { IoGridOutline, IoListOutline, IoSquareOutline } from "react-icons/io5";

import { ToggleButtonGroup } from "@/components/composite/ToggleButtonGroup";
import { Surface } from "@/components/core/Surface";
import { ToggleButton } from "@/components/core/ToggleButton";
import { Text } from "@/components/core/Text";

export function ToggleButtonGroupViewToolbarDemo() {
  const [view, setView] = useState("list");

  return (
    <Surface variant="secondary" padding="mid" className="flex w-full max-w-md items-center justify-between gap-mid">
      <Text as="span" variant="small" className="font-medium">
        Catalog view
      </Text>
      <ToggleButtonGroup
        type="single"
        variant="outline"
        size="small"
        aria-label="Catalog view"
        value={view}
        onValueChange={(v) => setView(v as string)}
      >
        <ToggleButton value="list" leftIcon={<IoListOutline aria-hidden />} aria-label="List" />
        <ToggleButton value="grid" leftIcon={<IoGridOutline aria-hidden />} aria-label="Net" />
        <ToggleButton value="tiles" leftIcon={<IoSquareOutline aria-hidden />} aria-label="Tiles" />
      </ToggleButtonGroup>
    </Surface>
  );
}

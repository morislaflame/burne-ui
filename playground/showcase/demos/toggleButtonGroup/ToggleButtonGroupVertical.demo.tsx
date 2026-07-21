import { useState } from "react";
import { IoGridOutline, IoListOutline } from "react-icons/io5";

import { ToggleButtonGroup } from "@/components/composite/ToggleButtonGroup";
import { ToggleButton } from "@/components/core/ToggleButton";
import { Text } from "@/components/core/Text";

export function ToggleButtonGroupVerticalDemo() {
  const [view, setView] = useState("list");

  return (
    <div className="flex w-full max-w-xs flex-col gap-mid">
      <Text as="p" variant="small" className="font-medium">
        Vertical group
      </Text>
      <ToggleButtonGroup
        type="single"
        orientation="vertical"
        variant="ghost"
        aria-label="List view"
        value={view}
        onValueChange={(v) => setView(v as string)}
        className="w-full"
      >
        <ToggleButton value="list" icon={<IoListOutline aria-hidden />} className="w-full justify-start">
          List
        </ToggleButton>
        <ToggleButton value="grid" icon={<IoGridOutline aria-hidden />} className="w-full justify-start">
          Net
        </ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}

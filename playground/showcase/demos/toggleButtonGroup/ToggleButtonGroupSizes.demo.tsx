import { IoGridOutline, IoListOutline } from "react-icons/io5";

import { ToggleButtonGroup } from "@/components/composite/ToggleButtonGroup";
import { ToggleButton } from "@/components/core/ToggleButton";

const SIZES = ["small", "base", "mid", "large"] as const;

export function ToggleButtonGroupSizesDemo() {
  return (
    <div className="flex flex-col gap-large">
      {SIZES.map((size) => (
        <ToggleButtonGroup key={size} type="single" size={size} defaultValue="list" aria-label={`Size ${size}`}>
          <ToggleButton value="list" icon={<IoListOutline aria-hidden />}>
            List
          </ToggleButton>
          <ToggleButton value="grid" icon={<IoGridOutline aria-hidden />}>
            Grid
          </ToggleButton>
        </ToggleButtonGroup>
      ))}
    </div>
  );
}

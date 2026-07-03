import { IoHeartOutline } from "react-icons/io5";

import { ToggleButton } from "@/components/core/ToggleButton";

export function ToggleButtonClassNamesFullDemo() {
  return (
    <ToggleButton
      defaultPressed
      leftIcon={<IoHeartOutline aria-hidden />}
      classNames={{
        root: "rounded-mid ring-1 ring-danger/25",
        fill: "bg-danger/20",
        content: "gap-small",
        leftIcon: "text-danger",
        label: "font-semibold text-danger",
      }}
    >
      Like
    </ToggleButton>
  );
}

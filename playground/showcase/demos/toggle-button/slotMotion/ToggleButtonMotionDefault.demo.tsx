import { IoHeartOutline } from "react-icons/io5";

import { ToggleButton } from "@/components/core/ToggleButton";

export function ToggleButtonMotionDefaultDemo() {
  return (
    <ToggleButton variant="outline" icon={<IoHeartOutline aria-hidden />}>
      Like
    </ToggleButton>
  );
}

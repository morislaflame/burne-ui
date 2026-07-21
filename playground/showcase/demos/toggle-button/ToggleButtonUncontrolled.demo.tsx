import { IoBookmarkOutline } from "react-icons/io5";

import { ToggleButton } from "@/components/core/ToggleButton";

export function ToggleButtonUncontrolledDemo() {
  return (
    <ToggleButton variant="default" defaultPressed icon={<IoBookmarkOutline aria-hidden />}>
      Bookmark
    </ToggleButton>
  );
}

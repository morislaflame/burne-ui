import { IoBookmarkOutline } from "react-icons/io5";

import { ToggleButton } from "@/components/core/ToggleButton";

export function ToggleButtonUncontrolledDemo() {
  return (
    <ToggleButton variant="default" defaultPressed leftIcon={<IoBookmarkOutline aria-hidden />}>
      Закладка
    </ToggleButton>
  );
}

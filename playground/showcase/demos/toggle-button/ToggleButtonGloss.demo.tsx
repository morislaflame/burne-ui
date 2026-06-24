import { IoHeartOutline } from "react-icons/io5";

import { ToggleButton } from "@/components/core/ToggleButton";

export function ToggleButtonGlossDemo() {
  return (
    <ToggleButton variant="gloss" defaultPressed leftIcon={<IoHeartOutline aria-hidden />}>
      Gloss
    </ToggleButton>
  );
}

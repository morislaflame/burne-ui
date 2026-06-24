import { useState } from "react";
import { IoHeartOutline } from "react-icons/io5";

import { ToggleButton } from "@/components/core/ToggleButton";

export function ToggleButtonControlledDemo() {
  const [liked, setLiked] = useState(false);

  return (
    <ToggleButton
      pressed={liked}
      onPressedChange={setLiked}
      variant="outline"
      leftIcon={<IoHeartOutline aria-hidden />}
    >
      {liked ? "Нравится" : "Лайк"}
    </ToggleButton>
  );
}

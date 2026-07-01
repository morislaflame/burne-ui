import { useState } from "react";
import { IoHeart, IoHeartOutline } from "react-icons/io5";

import { ToggleButton } from "@/components/core/ToggleButton";

export function ToggleButtonControlledDemo() {
  const [liked, setLiked] = useState(false);
  const [filledIcon, setFilledIcon] = useState(false);

  return (
    <ToggleButton
      pressed={liked}
      onPressedChange={setLiked}
      onFillStart={setFilledIcon}
      variant="outline"
      leftIcon={filledIcon ? <IoHeart aria-hidden /> : <IoHeartOutline aria-hidden />}
    >
      Like
    </ToggleButton>
  );
}

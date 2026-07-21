import { IoHeart, IoHeartOutline } from "react-icons/io5";

import { ToggleButton } from "@/components/core/ToggleButton";
import { useState } from "react";

export function ToggleButtonGlossDemo() {
  const [pressed, setPressed] = useState(false);
  
  return (
    <ToggleButton 
      aria-label="Like" 
      variant="gloss" 
      onPressedChange={setPressed} 
      pressed={pressed} 
      icon={pressed ? <IoHeart aria-hidden /> : <IoHeartOutline aria-hidden />}
    >
      Like
    </ToggleButton>
  );
}

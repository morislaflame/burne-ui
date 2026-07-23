import { useState } from "react";
import { IoMoon, IoSunny } from "react-icons/io5";

import { Switch } from "@/components/core/Switch";

export function SwitchGlossDemo() {
  const [enabled, setEnabled] = useState(false);

  return (
    <div className="flex flex-wrap items-center gap-large">
      <Switch
        gloss
        checked={enabled}
        onChange={(e) => setEnabled(e.target.checked)}
        iconOff={<IoMoon aria-hidden />}
        iconOn={<IoSunny aria-hidden />}
        label="Gloss switch"
      />
    </div>
  );
}

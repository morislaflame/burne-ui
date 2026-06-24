import { useState } from "react";
import { IoCheckmark } from "react-icons/io5";

import { Checkbox } from "@/components/core/Checkbox";

export function CheckboxGlossDemo() {
  const [off, setOff] = useState(false);
  const [on, setOn] = useState(true);

  return (
    <div className="flex flex-wrap items-center gap-mid">
      <Checkbox
        label="Checkbox gloss (off)"
        variant="gloss"
        checked={off}
        onChange={(e) => setOff(e.target.checked)}
      />
      <Checkbox
        label="Checkbox gloss (on)"
        variant="gloss"
        checked={on}
        onChange={(e) => setOn(e.target.checked)}
        checkIcon={<IoCheckmark aria-hidden />}
      />
    </div>
  );
}

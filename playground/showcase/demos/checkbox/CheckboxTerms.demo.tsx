import { useState } from "react";

import { Checkbox } from "@/components/core/Checkbox";

export function CheckboxTermsDemo() {
  const [checked, setChecked] = useState(true);

  return (
    <Checkbox
      checked={checked}
      onChange={(e) => setChecked(e.target.checked)}
      label="I agree with the terms"
    />
  );
}

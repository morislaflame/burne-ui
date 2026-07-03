import { useState } from "react";

import { RadioGroup } from "@/components/composite/RadioGroup";
import { Radio } from "@/components/core/Radio";

export function RadioGroupGlossDemo() {
  const [value, setValue] = useState("email");

  return (
    <RadioGroup value={value} onValueChange={(v) => v != null && setValue(v)}>
      <RadioGroup.Legend>
        <RadioGroup.Label>Communication method (gloss)</RadioGroup.Label>
      </RadioGroup.Legend>
      <RadioGroup.List>
        <Radio value="email" label="Email" variant="gloss" />
        <Radio value="phone" label="Telephone" variant="gloss" />
        <Radio value="chat" label="Chat" variant="gloss" />
      </RadioGroup.List>
    </RadioGroup>
  );
}

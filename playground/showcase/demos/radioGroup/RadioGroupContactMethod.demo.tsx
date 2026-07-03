import { useState } from "react";

import { RadioGroup } from "@/components/composite/RadioGroup";
import { Radio } from "@/components/core/Radio";

export function RadioGroupContactMethodDemo() {
  const [value, setValue] = useState("email");

  return (
    <RadioGroup value={value} onValueChange={(v) => v != null && setValue(v)}>
      <RadioGroup.Legend>
        <RadioGroup.Label>Communication method</RadioGroup.Label>
      </RadioGroup.Legend>
      <RadioGroup.List>
        <Radio value="email" label="Email" />
        <Radio value="phone" label="Telephone" />
        <Radio value="chat" label="Chat" />
      </RadioGroup.List>
    </RadioGroup>
  );
}

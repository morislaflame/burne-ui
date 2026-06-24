import { useState } from "react";

import { RadioGroup } from "@/components/composite/RadioGroup";
import { Radio } from "@/components/core/Radio";

export function RadioGroupGlossDemo() {
  const [value, setValue] = useState("email");

  return (
    <RadioGroup value={value} onValueChange={(v) => v != null && setValue(v)}>
      <RadioGroup.Legend>
        <RadioGroup.Label>Способ связи (gloss)</RadioGroup.Label>
      </RadioGroup.Legend>
      <RadioGroup.List>
        <Radio value="email" label="Email" variant="gloss" />
        <Radio value="phone" label="Телефон" variant="gloss" />
        <Radio value="chat" label="Чат" variant="gloss" />
      </RadioGroup.List>
    </RadioGroup>
  );
}

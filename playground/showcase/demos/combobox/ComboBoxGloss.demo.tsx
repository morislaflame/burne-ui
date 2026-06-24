import { useState } from "react";

import { ComboBox } from "@/components/core/ComboBox";

const options = [
  { value: "react", label: "React" },
  { value: "svelte", label: "Svelte" },
  { value: "vue", label: "Vue" },
];

export function ComboBoxGlossDemo() {
  const [value, setValue] = useState("react");

  return (
    <ComboBox
      label="Gloss ComboBox"
      variant="gloss"
      options={options}
      value={value}
      onValueChange={setValue}
      hint="Стеклянная оболочка"
      className="w-64"
    />
  );
}

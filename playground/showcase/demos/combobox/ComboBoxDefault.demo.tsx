import { useState } from "react";

import { ComboBox } from "@/components/core/ComboBox";

const items = [
  { value: "react", label: "React" },
  { value: "svelte", label: "Svelte" },
  { value: "vue", label: "Vue" },
];

export function ComboBoxDefaultDemo() {
  const [value, setValue] = useState<string | null>("react");

  return (
    <ComboBox
      label="Framework"
      items={items}
      value={value}
      onValueChange={setValue}
      hint={`Selected: ${value}`}
      className="w-64"
    />
  );
}

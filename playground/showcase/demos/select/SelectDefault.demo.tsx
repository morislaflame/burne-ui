import { useState } from "react";

import { Select } from "@/components/core/Select";

const items = [
  { value: "react", label: "React" },
  { value: "svelte", label: "Svelte" },
  { value: "vue", label: "Vue" },
];

export function SelectDefaultDemo() {
  const [value, setValue] = useState<string | null>("react");

  return (
    <Select
      label="Framework"
      items={items}
      value={value}
      onValueChange={setValue}
      hint={`Selected: ${value}`}
      className="w-64"
    />
  );
}

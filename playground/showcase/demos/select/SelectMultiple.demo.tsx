import { useState } from "react";

import { Select } from "@/components/core/Select";

const items = [
  { value: "react", label: "React" },
  { value: "svelte", label: "Svelte" },
  { value: "vue", label: "Vue" },
];

export function SelectMultipleDemo() {
  const [values, setValues] = useState<string[]>(["react"]);

  return (
    <Select
      selectionMode="multiple"
      label="Frameworks"
      items={items}
      values={values}
      onValuesChange={setValues}
      hint={values.length > 0 ? `Selected: ${values.join(", ")}` : "None selected"}
      className="w-64"
    />
  );
}

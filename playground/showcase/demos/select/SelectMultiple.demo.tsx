import { useState } from "react";

import { Select } from "@/components/core/Select";

const options = [
  { value: "react", label: "React" },
  { value: "svelte", label: "Svelte" },
  { value: "vue", label: "Vue" },
];

export function SelectMultipleDemo() {
  const [values, setValues] = useState<string[]>(["react"]);

  return (
    <Select
      multiple
      label="Frameworks"
      options={options}
      values={values}
      onValuesChange={setValues}
      hint={values.length > 0 ? `Selected: ${values.join(", ")}` : "None selected"}
      className="w-64"
    />
  );
}

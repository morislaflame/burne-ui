import { useState } from "react";

import { Select } from "@/components/core/Select";

const options = [
  { value: "react", label: "React" },
  { value: "svelte", label: "Svelte" },
  { value: "vue", label: "Vue" },
];

export function SelectDefaultDemo() {
  const [value, setValue] = useState("react");

  return (
    <Select
      label="Фреймворк"
      options={options}
      value={value}
      onValueChange={setValue}
      hint={`Выбрано: ${value}`}
      className="w-64"
    />
  );
}

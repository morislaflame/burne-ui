import { useState } from "react";

import { ComboBox } from "@/components/core/ComboBox";

const options = [
  { value: "react", label: "React" },
  { value: "svelte", label: "Svelte" },
  { value: "vue", label: "Vue" },
];

export function ComboBoxDefaultDemo() {
  const [value, setValue] = useState("react");

  return (
    <ComboBox
      label="Фреймворк"
      options={options}
      value={value}
      onValueChange={setValue}
      hint={`Выбрано: ${value}`}
      className="w-64"
    />
  );
}

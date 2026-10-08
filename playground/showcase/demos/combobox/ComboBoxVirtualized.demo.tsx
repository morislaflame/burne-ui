import { useState } from "react";

import { ComboBox } from "@/components/core/ComboBox";

const options = Array.from({ length: 200 }, (_, index) => ({
  value: String(index + 1),
  label: `Item ${index + 1}`,
}));

export function ComboBoxVirtualizedDemo() {
  const [value, setValue] = useState("1");

  return (
    <ComboBox
      virtualized
      label="Item"
      options={options}
      value={value}
      onValueChange={setValue}
      hint={`Selected: ${value}`}
      className="w-64"
    />
  );
}

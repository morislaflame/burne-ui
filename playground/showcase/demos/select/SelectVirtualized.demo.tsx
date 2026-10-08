import { useState } from "react";

import { Select } from "@/components/core/Select";

const options = Array.from({ length: 200 }, (_, index) => ({
  value: String(index + 1),
  label: `Item ${index + 1}`,
}));

export function SelectVirtualizedDemo() {
  const [value, setValue] = useState("1");

  return (
    <Select
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

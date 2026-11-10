import { useState } from "react";

import { ComboBox } from "@/components/core/ComboBox";

const items = Array.from({ length: 200 }, (_, index) => ({
  value: String(index + 1),
  label: `Item ${index + 1}`,
}));

export function ComboBoxVirtualizedDemo() {
  const [value, setValue] = useState<string | null>("1");

  return (
    <ComboBox
      virtualized
      label="Item"
      items={items}
      value={value}
      onValueChange={setValue}
      hint={`Selected: ${value}`}
      className="w-64"
    />
  );
}

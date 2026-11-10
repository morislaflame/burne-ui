import { useState } from "react";

import { Select } from "@/components/core/Select";

const items = Array.from({ length: 200 }, (_, index) => ({
  value: String(index + 1),
  label: `Item ${index + 1}`,
}));

export function SelectVirtualizedDemo() {
  const [value, setValue] = useState<string | null>("1");

  return (
    <Select
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

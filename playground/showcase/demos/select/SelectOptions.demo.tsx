import { useState } from "react";

import { Select } from "@/components/core/Select";

const items = [
  {
    label: "Fruit",
    items: [
      { value: "apple", label: "Apple" },
      { value: "pear", label: "Pear" },
    ],
  },
  { value: "water", label: "Water" },
];

export function SelectOptionsDemo() {
  const [value, setValue] = useState<string | null>("apple");

  return (
    <Select
      clearable
      label="Snack"
      items={items}
      value={value}
      onValueChange={setValue}
      hint="Groups sit in the menu. Clear removes the value."
      className="w-64"
    />
  );
}

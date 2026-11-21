import { useState } from "react";

import { ComboBox } from "@/components/core/ComboBox";

const items = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
];

const SIZES = ["small", "base", "mid", "large"] as const;

export function ComboBoxSizesDemo() {
  const [small, setSmall] = useState<string | null>("react");
  const [base, setBase] = useState<string | null>("react");
  const [mid, setMid] = useState<string | null>("react");
  const [large, setLarge] = useState<string | null>("react");

  const values = { small, base, mid, large } as const;
  const setters = {
    small: setSmall,
    base: setBase,
    mid: setMid,
    large: setLarge,
  } as const;

  return (
    <div className="flex w-full max-w-xs flex-col gap-small">
      {SIZES.map((size) => (
        <ComboBox
          key={size}
          size={size}
          label={size}
          items={items}
          value={values[size]}
          onValueChange={setters[size]}
        />
      ))}
    </div>
  );
}

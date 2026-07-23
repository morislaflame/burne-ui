import { useState } from "react";

import { ComboBox } from "@/components/core/ComboBox";

const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
];

const SIZES = ["small", "base", "mid", "large"] as const;

export function ComboBoxSizesDemo() {
  const [small, setSmall] = useState("react");
  const [base, setBase] = useState("react");
  const [mid, setMid] = useState("react");
  const [large, setLarge] = useState("react");

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
          options={options}
          value={values[size]}
          onValueChange={setters[size]}
        />
      ))}
    </div>
  );
}

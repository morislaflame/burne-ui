import { useState } from "react";

import { ComboBox } from "@/components/core/ComboBox";

const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue" },
  { value: "svelte", label: "Svelte" },
];

export function ComboBoxSizesDemo() {
  const [small, setSmall] = useState("react");
  const [base, setBase] = useState("react");
  const [mid, setMid] = useState("react");
  const [large, setLarge] = useState("react");

  return (
    <div className="flex w-full max-w-xs flex-col gap-small">
      <ComboBox size="small" label="Small" options={options} value={small} onValueChange={setSmall} />
      <ComboBox size="base" label="Base" options={options} value={base} onValueChange={setBase} />
      <ComboBox size="mid" label="Mid" options={options} value={mid} onValueChange={setMid} />
      <ComboBox size="large" label="Large" options={options} value={large} onValueChange={setLarge} />
    </div>
  );
}

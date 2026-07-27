import { useState } from "react";

import { ComboBox } from "@/components/core/ComboBox";

const options = [
  { value: "react", label: "React" },
  { value: "svelte", label: "Svelte" },
  { value: "vue", label: "Vue" },
];

const VARIANTS = ["default", "outline", "secondary", "gloss"] as const;

export function ComboBoxVariantsDemo() {
  const [value, setValue] = useState("react");

  return (
    <div className="grid w-full max-w-2xl gap-xlarge sm:grid-cols-2">
      {VARIANTS.map((variant) => (
        <ComboBox
          key={variant}
          label={variant}
          variant={variant}
          options={options}
          value={value}
          onValueChange={setValue}
          hint={`variant="${variant}"`}
          className="w-full"
        />
      ))}
    </div>
  );
}

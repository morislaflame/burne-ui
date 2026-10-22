import { useState } from "react";

import { Select } from "@/components/core/Select";

const items = [
  { value: "react", label: "React" },
  { value: "svelte", label: "Svelte" },
  { value: "vue", label: "Vue" },
];

const VARIANTS = ["default", "outline", "secondary"] as const;

export function SelectVariantsDemo() {
  const [value, setValue] = useState<string | null>("react");

  return (
    <div className="grid w-full max-w-2xl gap-xlarge sm:grid-cols-2">
      {VARIANTS.map((variant) => (
        <Select
          key={variant}
          label={variant}
          variant={variant}
          items={items}
          value={value}
          onValueChange={setValue}
          hint={`variant="${variant}"`}
          className="w-full"
        />
      ))}
    </div>
  );
}

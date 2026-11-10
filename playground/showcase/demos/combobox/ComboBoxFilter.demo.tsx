import { useState } from "react";

import { Button } from "@/components/core/Button";
import { ComboBox } from "@/components/core/ComboBox";

const cities = [
  { value: "bergen", label: "Bergen" },
  { value: "berlin", label: "Berlin" },
  { value: "oslo", label: "Oslo" },
];

export function ComboBoxFilterDemo() {
  const [value, setValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex w-64 flex-col items-start gap-mid">
      <ComboBox
        label="City"
        items={cities}
        value={value}
        onValueChange={setValue}
        allowsCustomValue
        loading={loading}
        filter={(option, query) => {
          const text =
            option.filterText ?? (typeof option.label === "string" ? option.label : "");
          return text.toLowerCase().startsWith(query.trim().toLowerCase());
        }}
        hint={value ? `Value: ${value}` : "Enter commits text that is not in the list."}
        className="w-full"
      />
      <Button variant="outline" onClick={() => setLoading((current) => !current)}>
        {loading ? "Show items" : "Loading"}
      </Button>
    </div>
  );
}

import { useState } from "react";
import { IoGlobeOutline } from "react-icons/io5";

import { Select } from "@/components/core/Select";

const options = [
  {
    value: "ru",
    label: "Russian",
    hint: "Interface in Russian",
    icon: <IoGlobeOutline aria-hidden />,
  },
  {
    value: "en",
    label: "English",
    hint: "UI in English",
    icon: <IoGlobeOutline aria-hidden />,
  },
];

export function SelectGlossDemo() {
  const [value, setValue] = useState("ru");

  return (
    <div className="flex w-64 flex-col gap-large">
      <Select
        label="Gloss Select"
        variant="gloss"
        options={options}
        value={value}
        onValueChange={setValue}
        hint="Glass shell and gloss-popover"
      />
      <Select options={options} defaultValue="en" variant="gloss">
        <Select.Label>Compound</Select.Label>
        <Select.TriggerGroup>
          <Select.Value placeholder="Select language" />
          <Select.Trigger />
        </Select.TriggerGroup>
        <Select.Popover />
      </Select>
    </div>
  );
}

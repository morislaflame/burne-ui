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

export function SelectClassNamesFullDemo() {
  const [value, setValue] = useState("ru");

  return (
    <Select
      label="Language"
      hint="Customization via classNames"
      options={options}
      value={value}
      onValueChange={setValue}
      variant="outline"
      classNames={{
        triggerGroup: "border-info/40 bg-info/5 shadow-token-base",
        value: "text-info",
        trigger: "text-info hover:text-info",
        popoverBody: "bg-info/5",
        listBox: "p-xsmall",
      }}
    />
  );
}

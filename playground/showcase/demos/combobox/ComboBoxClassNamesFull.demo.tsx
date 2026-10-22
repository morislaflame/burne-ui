import { useState } from "react";

import { ComboBox } from "@/components/core/ComboBox";
import { IoGlobeOutline } from "react-icons/io5";

const items = [
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

export function ComboBoxClassNamesFullDemo() {
  const [value, setValue] = useState<string | null>("ru");

  return (
    <ComboBox
      label="Language"
      hint="Customization via classNames"
      items={items}
      value={value}
      onValueChange={setValue}
      variant="outline"
      classNames={{
        shell: "border-info/40 bg-info/5 shadow-token-base",
        input: "text-info placeholder:text-info/50",
        trigger: "text-info hover:text-info",
        triggerIconWrap: "icon-slot-large",
        triggerIcon: "text-info",
        popoverBody: "bg-info/5",
        listBox: "p-xsmall",
        listBoxItem: "rounded-lg",
        listBoxLabel: "font-semibold",
        listBoxHint: "text-muted/80",
      }}
    />
  );
}

import { useState } from "react";

import { ComboBox } from "@/components/core/ComboBox";
import { IoGlobeOutline } from "react-icons/io5";

const options = [
  {
    value: "ru",
    label: "Русский",
    hint: "Интерфейс на русском",
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
  const [value, setValue] = useState("ru");

  return (
    <ComboBox
      label="Язык"
      hint="Кастомизация через classNames"
      options={options}
      value={value}
      onValueChange={setValue}
      variant="outline"
      classNames={{
        inputGroup: "border-info/40 bg-info/5 shadow-token-base",
        input: "text-info placeholder:text-info/50",
        trigger: "text-info hover:text-info",
        popoverBody: "bg-info/5",
        listBox: "p-xsmall",
      }}
    />
  );
}

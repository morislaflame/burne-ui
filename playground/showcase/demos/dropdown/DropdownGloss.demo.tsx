import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Dropdown } from "@/components/core/Dropdown";

export function DropdownGlossDemo() {
  const [glossLang, setGlossLang] = useState("ru");

  return (
    <Dropdown popoverVariant="gloss" value={glossLang} onValueChange={(v) => setGlossLang(v as string)}>
      <Dropdown.Trigger asChild>
        <Button variant="gloss">Gloss Dropdown</Button>
      </Dropdown.Trigger>
      <Dropdown.Popover>
        <Dropdown.Item value="ru" selection={false}>
          <Dropdown.ItemLabel>Russian</Dropdown.ItemLabel>
        </Dropdown.Item>
        <Dropdown.Item value="en" selection={false}>
          <Dropdown.ItemLabel>English</Dropdown.ItemLabel>
        </Dropdown.Item>
      </Dropdown.Popover>
    </Dropdown>
  );
}

import { useState } from "react";

import { ListBox } from "@/components/core/ListBox";
import { Surface } from "@/components/core/Surface";

export function ListBoxSimpleApiDemo() {
  const [listBoxMulti, setListBoxMulti] = useState<string[]>(["ru"]);

  return (
    <Surface variant="default" padding="plus" className="max-w-sm">
      <ListBox multiple value={listBoxMulti} onValueChange={(v) => setListBoxMulti(v as string[])}>
        <ListBox.Item value="ru" label="Русский" />
        <ListBox.Item value="en" label="English" />
        <ListBox.Item value="de" label="Deutsch" disabled hint="Скоро" />
      </ListBox>
    </Surface>
  );
}

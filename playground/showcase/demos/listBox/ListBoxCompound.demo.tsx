import { useState } from "react";
import { IoGlobeOutline } from "react-icons/io5";

import { ListBox } from "@/components/core/ListBox";
import { Surface } from "@/components/core/Surface";

export function ListBoxCompoundDemo() {
  const [listBoxValue, setListBoxValue] = useState("ru");

  return (
    <Surface variant="default" padding="mid" className="max-w-sm">
      <ListBox value={listBoxValue} onValueChange={(v) => setListBoxValue(v as string)}>
        <ListBox.Section>
          <ListBox.Header>Languages</ListBox.Header>
          <ListBox.Item value="ru">
            <ListBox.ItemIndicator />
            <ListBox.Label>Russian</ListBox.Label>
            <ListBox.Hint>Default locale</ListBox.Hint>
          </ListBox.Item>
          <ListBox.Item value="en">
            <ListBox.ItemIndicator />
            <ListBox.Label>English</ListBox.Label>
            <ListBox.Hint>Latin script</ListBox.Hint>
            <ListBox.Icon>
              <IoGlobeOutline aria-hidden />
            </ListBox.Icon>
          </ListBox.Item>
        </ListBox.Section>
      </ListBox>
    </Surface>
  );
}

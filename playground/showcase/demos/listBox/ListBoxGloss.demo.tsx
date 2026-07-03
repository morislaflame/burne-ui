import { useState } from "react";
import { IoGlobeOutline } from "react-icons/io5";

import { ListBox } from "@/components/core/ListBox";

export function ListBoxGlossDemo() {
  const [glossListBox, setGlossListBox] = useState("ru");

  return (
    <ListBox
      variant="gloss"
      className="min-w-[14rem]"
      value={glossListBox}
      onValueChange={(v) => setGlossListBox(v as string)}
    >
      <ListBox.Section>
        <ListBox.Header>Languages</ListBox.Header>
        <ListBox.Item value="ru">
          <ListBox.ItemIndicator />
          <ListBox.Label>Russian</ListBox.Label>
        </ListBox.Item>
        <ListBox.Item value="en">
          <ListBox.ItemIndicator />
          <ListBox.Label>English</ListBox.Label>
          <ListBox.Icon>
            <IoGlobeOutline aria-hidden />
          </ListBox.Icon>
        </ListBox.Item>
      </ListBox.Section>
    </ListBox>
  );
}

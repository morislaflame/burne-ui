import { useState } from "react";
import { IoFolderOutline, IoGlobeOutline, IoLockClosedOutline } from "react-icons/io5";

import { ListBox } from "@/components/core/ListBox";
import { Surface } from "@/components/core/Surface";

const WORKSPACES = [
  { value: "personal", label: "Личное", hint: "Только вы", icon: IoLockClosedOutline },
  { value: "acme", label: "Acme Inc", hint: "12 участников", icon: IoFolderOutline },
  { value: "global", label: "Global Team", hint: "Публичные проекты", icon: IoGlobeOutline },
] as const;

export function ListBoxWorkspacePickerDemo() {
  const [value, setValue] = useState("acme");

  return (
    <Surface variant="secondary" padding="plus" className="w-full max-w-sm">
      <ListBox value={value} onValueChange={(v) => setValue(v as string)}>
        <ListBox.Section>
          <ListBox.Header>Рабочие пространства</ListBox.Header>
          {WORKSPACES.map((ws) => (
            <ListBox.Item key={ws.value} value={ws.value}>
              <ListBox.ItemIndicator />
              <ListBox.Label>{ws.label}</ListBox.Label>
              <ListBox.Hint>{ws.hint}</ListBox.Hint>
              <ListBox.Icon>
                <ws.icon aria-hidden />
              </ListBox.Icon>
            </ListBox.Item>
          ))}
        </ListBox.Section>
      </ListBox>
    </Surface>
  );
}

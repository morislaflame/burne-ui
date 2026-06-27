import { useState } from "react";
import { IoChevronForward } from "react-icons/io5";

import { Badge } from "@/components/core/Badge";
import { ListBox } from "@/components/core/ListBox";

const COMMANDS = [
  { value: "search", label: "Поиск", hint: "Найти компонент", shortcut: "⌘ K" },
  { value: "new", label: "Создать", hint: "Новый файл", shortcut: "⌘ N" },
  { value: "settings", label: "Настройки", hint: "Параметры проекта", shortcut: "⌘ ," },
] as const;

export function ListBoxCommandPaletteDemo() {
  const [value, setValue] = useState("search");

  return (
    <ListBox className="w-full max-w-sm" value={value} onValueChange={(v) => setValue(v as string)}>
      <ListBox.Section>
        <ListBox.Header>Команды</ListBox.Header>
        {COMMANDS.map((cmd) => (
          <ListBox.Item key={cmd.value} value={cmd.value}>
            <ListBox.Label>{cmd.label}</ListBox.Label>
            <ListBox.Hint>{cmd.hint}</ListBox.Hint>
            <ListBox.Icon className="flex items-center gap-xsmall">
              <Badge variant="secondary" size="small">
                {cmd.shortcut}
              </Badge>
              <IoChevronForward aria-hidden className="text-muted" />
            </ListBox.Icon>
          </ListBox.Item>
        ))}
      </ListBox.Section>
    </ListBox>
  );
}

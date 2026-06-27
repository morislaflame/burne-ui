import { useState } from "react";

import { ListBox } from "@/components/core/ListBox";
import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";

const PERMISSIONS = [
  { value: "read", label: "Чтение" },
  { value: "write", label: "Запись" },
  { value: "admin", label: "Администрирование" },
  { value: "billing", label: "Биллинг" },
] as const;

export function ListBoxPermissionsDemo() {
  const [selected, setSelected] = useState<string[]>(["read", "write"]);

  return (
    <Surface variant="secondary" padding="plus" className="w-full max-w-sm flex flex-col gap-mid p-mid">
      <Text as="p" variant="small" className="mb-mid font-medium">
        Права доступа
      </Text>
      <ListBox multiple value={selected} onValueChange={(v) => setSelected(v as string[])}>
        {PERMISSIONS.map((perm) => (
          <ListBox.Item key={perm.value} value={perm.value} label={perm.label} />
        ))}
      </ListBox>
      <Text as="p" variant="tools" className="mt-mid text-muted">
        Выбрано: {selected.length > 0 ? selected.join(", ") : "—"}
      </Text>
    </Surface>
  );
}

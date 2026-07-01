import { useState } from "react";

import { Checkbox } from "@/components/core/Checkbox";
import { Text } from "@/components/core/Text";

const PERMISSIONS = [
  { id: "read", label: "Чтение", variant: "secondary" as const },
  { id: "write", label: "Запись", variant: "default" as const },
  { id: "admin", label: "Админ", variant: "outline" as const },
] as const;

export function CheckboxTaskListDemo() {
  const [granted, setGranted] = useState<Record<string, boolean>>({
    read: true,
    write: true,
    admin: false,
  });

  return (
    <div className="flex w-full max-w-xs flex-col gap-plus">
      <Text as="p" variant="small" className="font-medium">
        Права доступа
      </Text>
      <ul className="flex flex-col gap-base">
        {PERMISSIONS.map((perm) => (
          <li key={perm.id}>
            <Checkbox
              variant={perm.variant}
              checked={granted[perm.id]}
              onChange={(e) => setGranted((prev) => ({ ...prev, [perm.id]: e.target.checked }))}
              label={perm.label}
            />
          </li>
        ))}
      </ul>
      <Text as="p" variant="tools" className="text-muted">
        variant secondary / default / outline на одном экране.
      </Text>
    </div>
  );
}

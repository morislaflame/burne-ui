import { useState } from "react";

import { Checkbox } from "@/components/core/Checkbox";
import { Text } from "@/components/core/Text";

const PERMISSIONS = [
  { id: "read", label: "Reading", variant: "secondary" as const },
  { id: "write", label: "Record", variant: "default" as const },
  { id: "admin", label: "Admin", variant: "outline" as const },
] as const;

export function CheckboxTaskListDemo() {
  const [granted, setGranted] = useState<Record<string, boolean>>({
    read: true,
    write: true,
    admin: false,
  });
  const values = PERMISSIONS.map((perm) => granted[perm.id]);
  const allGranted = values.every(Boolean);
  const someGranted = values.some(Boolean);

  return (
    <div className="flex w-full max-w-xs flex-col gap-mid">
      <Text as="p" variant="small" className="font-medium">
        Access rights
      </Text>
      <Checkbox
        label="All rights"
        checked={allGranted}
        indeterminate={!allGranted && someGranted}
        onChange={(e) => {
          const next = e.target.checked;
          setGranted(Object.fromEntries(PERMISSIONS.map((perm) => [perm.id, next])));
        }}
      />
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
      <Text as="p" variant="xsmall" className="text-muted">
        variant secondary / default / outline on one screen.
      </Text>
    </div>
  );
}

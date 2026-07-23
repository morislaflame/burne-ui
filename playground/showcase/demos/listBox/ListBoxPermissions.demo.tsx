import { useState } from "react";

import { ListBox } from "@/components/core/ListBox";
import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";

const PERMISSIONS = [
  { value: "read", label: "Reading" },
  { value: "write", label: "Record" },
  { value: "admin", label: "Administration" },
  { value: "billing", label: "Billing" },
] as const;

export function ListBoxPermissionsDemo() {
  const [selected, setSelected] = useState<string[]>(["read", "write"]);

  return (
    <Surface variant="secondary" padding="plus" className="w-full max-w-sm flex flex-col gap-mid p-mid">
      <Text as="p" variant="small" className="mb-mid font-medium">
        Access rights
      </Text>
      <ListBox multiple value={selected} onValueChange={(v) => setSelected(v as string[])}>
        {PERMISSIONS.map((perm) => (
          <ListBox.Item key={perm.value} value={perm.value} label={perm.label} />
        ))}
      </ListBox>
      <Text as="p" variant="xsmall" className="mt-mid text-muted">
        Selected: {selected.length > 0 ? selected.join(", ") : "—"}
      </Text>
    </Surface>
  );
}

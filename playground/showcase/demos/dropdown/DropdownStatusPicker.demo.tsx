import { useState } from "react";
import { IoCheckmarkCircle, IoEllipseOutline, IoPauseCircle } from "react-icons/io5";

import { Button } from "@/components/core/Button";
import { Dropdown } from "@/components/core/Dropdown";

const STATUSES = [
  { value: "active", label: "Active", icon: IoCheckmarkCircle },
  { value: "away", label: "Moved away", icon: IoPauseCircle },
  { value: "offline", label: "Offline", icon: IoEllipseOutline },
] as const;

export function DropdownStatusPickerDemo() {
  const [status, setStatus] = useState("active");
  const current = STATUSES.find((s) => s.value === status) ?? STATUSES[0];

  return (
    <Dropdown selectionIndicator value={status} onValueChange={(v) => setStatus(v as string)}>
      <Dropdown.Trigger asChild>
        <Button variant="outline" leftIcon={<current.icon aria-hidden className="size-4" />}>
          {current.label}
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Popover>
        <Dropdown.Group>
          <Dropdown.Label>Status</Dropdown.Label>
          {STATUSES.map((item) => (
            <Dropdown.Item key={item.value} value={item.value}>
              <Dropdown.ItemIndicator />
              <Dropdown.ItemLabel>{item.label}</Dropdown.ItemLabel>
              <Dropdown.ItemIcon>
                <item.icon aria-hidden />
              </Dropdown.ItemIcon>
            </Dropdown.Item>
          ))}
        </Dropdown.Group>
      </Dropdown.Popover>
    </Dropdown>
  );
}

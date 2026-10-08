import { useState } from "react";
import { IoCheckmarkCircle, IoEllipseOutline, IoPauseCircle } from "react-icons/io5";

import { ContextMenu } from "@/components/core/ContextMenu";

const STATUSES = [
  { value: "active", label: "Active", icon: IoCheckmarkCircle },
  { value: "away", label: "Away", icon: IoPauseCircle },
  { value: "offline", label: "Offline", icon: IoEllipseOutline },
] as const;

const surface =
  "min-h-control-large min-w-component-small items-center justify-center rounded-mid border-token bg-surface px-large text-foreground";

export function ContextMenuSelectionDemo() {
  const [status, setStatus] = useState("active");
  const current = STATUSES.find((item) => item.value === status) ?? STATUSES[0];

  return (
    <ContextMenu value={status} onValueChange={(next) => setStatus(String(next))}>
      <ContextMenu.Trigger className={surface}>{current.label}</ContextMenu.Trigger>
      <ContextMenu.Content className="min-w-52">
        <ContextMenu.Group>
          <ContextMenu.Label>Status</ContextMenu.Label>
          {STATUSES.map((item) => (
            <ContextMenu.Item key={item.value} value={item.value} selection>
              <ContextMenu.ItemIndicator />
              <ContextMenu.ItemLabel>{item.label}</ContextMenu.ItemLabel>
              <ContextMenu.ItemIcon>
                <item.icon aria-hidden />
              </ContextMenu.ItemIcon>
            </ContextMenu.Item>
          ))}
        </ContextMenu.Group>
      </ContextMenu.Content>
    </ContextMenu>
  );
}

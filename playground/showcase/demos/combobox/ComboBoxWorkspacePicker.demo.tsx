import { useMemo, useState } from "react";

import { Avatar } from "@/components/core/Avatar";
import { Badge } from "@/components/core/Badge";
import { ComboBox } from "@/components/core/ComboBox";
import { useComboBoxContext } from "@/components/core/ComboBox/comboBoxContext";
import { ListBox } from "@/components/core/ListBox";
import { PIN_IMAGE1, PIN_IMAGE3 } from "@/utils/mockImages";

const MEMBERS = [
  {
    value: "anya",
    label: "Anya Ivanova",
    role: "Product Design",
    handle: "@anya",
    badge: "Lead",
    src: PIN_IMAGE1,
    filterText: "Anya Ivanova Product Design @anya",
  },
  {
    value: "max",
    label: "Max Petrov",
    role: "Frontend",
    handle: "@max",
    badge: "Dev",
    src: PIN_IMAGE3,
    filterText: "Max Petrov Frontend @max",
  },
  {
    value: "kate",
    label: "Keith Moore",
    role: "Design Systems",
    handle: "@kate",
    badge: "Pro",
    src: PIN_IMAGE1,
    filterText: "Keith Moore Design Systems @kate",
  },
] as const;

const COMBO_OPTIONS = MEMBERS.map((m) => ({
  value: m.value,
  label: m.label,
  filterText: m.filterText,
}));

function MemberListItems() {
  const { filteredValues } = useComboBoxContext();
  const byValue = useMemo(() => new Map(MEMBERS.map((m) => [m.value, m])), []);

  if (filteredValues.length === 0) {
    return <ListBox.Empty>No one was found</ListBox.Empty>;
  }

  return (
    <ListBox.Section>
      <ListBox.Header>Assign an executor</ListBox.Header>
      {filteredValues.map((value) => {
        const member = byValue.get(value as (typeof MEMBERS)[number]["value"]);
        if (!member) return null;

        return (
          <ListBox.Item key={value} value={value} className="gap-y-base">
            <ListBox.Label>
              <span className="flex min-w-0 items-center gap-small">
                <Avatar size="small" label={member.label} src={member.src} alt="" loading="lazy" />
                <span className="flex min-w-0 flex-col gap-px">
                  <span className="truncate font-medium">{member.label}</span>
                  <span className="truncate text-tools text-muted">{member.role}</span>
                </span>
              </span>
            </ListBox.Label>
            <ListBox.Icon>
              <Badge status="info" size="small">
                {member.badge}
              </Badge>
            </ListBox.Icon>
          </ListBox.Item>
        );
      })}
    </ListBox.Section>
  );
}

export function ComboBoxWorkspacePickerDemo() {
  const [value, setValue] = useState("anya");

  return (
    <ComboBox
      options={COMBO_OPTIONS}
      value={value}
      onValueChange={setValue}
      className="w-full max-w-sm"
    >
      <ComboBox.Label>Task executor</ComboBox.Label>
      <ComboBox.InputGroup>
        <ComboBox.Input placeholder="Search by command…" />
        <ComboBox.Trigger />
      </ComboBox.InputGroup>
      <ComboBox.Popover>
        <MemberListItems />
      </ComboBox.Popover>
      <ComboBox.Hint>Compound ListBox.Item — avatar, role and badge in slots.</ComboBox.Hint>
    </ComboBox>
  );
}

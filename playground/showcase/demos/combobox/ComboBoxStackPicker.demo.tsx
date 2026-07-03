import { useMemo, useState } from "react";
import { IoChevronForward } from "react-icons/io5";

import { Badge } from "@/components/core/Badge";
import { ComboBox } from "@/components/core/ComboBox";
import { useComboBoxContext } from "@/components/core/ComboBox/comboBoxContext";
import { ListBox } from "@/components/core/ListBox";

const ACTIONS = [
  { value: "duplicate", label: "Duplicate", hint: "Create a copy of a component", shortcut: "⌘K" },
  { value: "export", label: "Export to Figma", hint: "Code Connect", shortcut: "⌘E" },
  { value: "archive", label: "To the archive", hint: "Hide from catalog", shortcut: "⌘A" },
] as const;

const COMBO_OPTIONS = ACTIONS.map((a) => ({
  value: a.value,
  label: a.label,
  hint: a.hint,
  filterText: `${a.label} ${a.hint}`,
}));

function ActionListItems() {
  const { filteredValues } = useComboBoxContext();
  const byValue = useMemo(() => new Map(ACTIONS.map((a) => [a.value, a])), []);

  if (filteredValues.length === 0) {
    return <ListBox.Empty>Action not found</ListBox.Empty>;
  }

  return (
    <ListBox.Section>
      <ListBox.Header>Actions with a component</ListBox.Header>
      {filteredValues.map((value) => {
        const action = byValue.get(value as (typeof ACTIONS)[number]["value"]);
        if (!action) return null;

        return (
          <ListBox.Item key={value} value={value}>
            <ListBox.Label>{action.label}</ListBox.Label>
            <ListBox.Hint>{action.hint}</ListBox.Hint>
            <ListBox.Icon className="flex items-center gap-xsmall">
              <Badge variant="secondary" size="small">
                {action.shortcut}
              </Badge>
              <IoChevronForward aria-hidden className="text-muted" />
            </ListBox.Icon>
          </ListBox.Item>
        );
      })}
    </ListBox.Section>
  );
}

export function ComboBoxStackPickerDemo() {
  const [value, setValue] = useState("duplicate");

  return (
    <ComboBox
      options={COMBO_OPTIONS}
      value={value}
      onValueChange={setValue}
      className="w-full max-w-sm"
    >
      <ComboBox.Label>Fast action</ComboBox.Label>
      <ComboBox.InputGroup>
        <ComboBox.Input placeholder="Select or search…" />
        <ComboBox.Trigger />
      </ComboBox.InputGroup>
      <ComboBox.Popover>
        <ActionListItems />
      </ComboBox.Popover>
      <ComboBox.Hint>
        Label, Hint and Icon — direct child slots Item; badge and chevron inside Icon.
      </ComboBox.Hint>
    </ComboBox>
  );
}

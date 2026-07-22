import { IoCaretDown } from "react-icons/io5";

import { Select } from "@/components/core/Select";

const options = [
  { value: "draft", label: "Draft" },
  { value: "review", label: "For review" },
  { value: "published", label: "Published" },
];

export function SelectCustomTriggerIconDemo() {
  return (
    <Select options={options} defaultValue="draft" className="w-64">
      <Select.Label>Status</Select.Label>
      <Select.TriggerGroup>
        <Select.Value placeholder="Select status" />
        <Select.Trigger>
          <IoCaretDown aria-hidden className="icon-small text-primary" />
        </Select.Trigger>
      </Select.TriggerGroup>
      <Select.Popover />
    </Select>
  );
}

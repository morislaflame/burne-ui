import { IoCaretDown } from "react-icons/io5";

import { ComboBox } from "@/components/core/ComboBox";

const options = [
  { value: "draft", label: "Draft" },
  { value: "review", label: "For review" },
  { value: "published", label: "Published" },
];

export function ComboBoxCustomTriggerIconDemo() {
  return (
    <ComboBox options={options} defaultValue="draft" className="w-64">
      <ComboBox.Label>Status</ComboBox.Label>
      <ComboBox.InputGroup>
        <ComboBox.Input placeholder="Select status" />
        <ComboBox.Trigger>
          <IoCaretDown aria-hidden className="icon-small text-primary" />
        </ComboBox.Trigger>
      </ComboBox.InputGroup>
      <ComboBox.Popover />
    </ComboBox>
  );
}

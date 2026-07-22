import { ComboBox } from "@/components/core/ComboBox";

const options = [
  { value: "draft", label: "Draft" },
  { value: "review", label: "For review" },
  { value: "published", label: "Published" },
];

export function ComboBoxPopoverSideDemo() {
  return (
    <ComboBox options={options} defaultValue="draft" className="w-64">
      <ComboBox.Label>Status</ComboBox.Label>
      <ComboBox.InputGroup>
        <ComboBox.Input placeholder="Select status" />
        <ComboBox.Trigger />
      </ComboBox.InputGroup>
      <ComboBox.Popover side="top" />
    </ComboBox>
  );
}

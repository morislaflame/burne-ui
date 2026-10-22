import { ComboBox } from "@/components/core/ComboBox";

const items = [
  { value: "draft", label: "Draft" },
  { value: "review", label: "For review" },
  { value: "published", label: "Published" },
];

export function ComboBoxPopoverSideDemo() {
  return (
    <ComboBox items={items} defaultValue="draft" className="w-64">
      <ComboBox.Label>Status</ComboBox.Label>
      <ComboBox.Shell>
        <ComboBox.Input placeholder="Select status" />
        <ComboBox.Trigger />
      </ComboBox.Shell>
      <ComboBox.Popover side="top" />
    </ComboBox>
  );
}

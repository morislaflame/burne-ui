import { Select } from "@/components/core/Select";

const options = [
  { value: "draft", label: "Draft" },
  { value: "review", label: "For review" },
  { value: "published", label: "Published" },
];

export function SelectPopoverSideDemo() {
  return (
    <Select options={options} defaultValue="draft" className="w-64">
      <Select.Label>Status</Select.Label>
      <Select.TriggerGroup>
        <Select.Value placeholder="Select status" />
        <Select.Trigger />
      </Select.TriggerGroup>
      <Select.Popover side="top" />
    </Select>
  );
}

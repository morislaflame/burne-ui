import { Select } from "@/components/core/Select";

const items = [
  { value: "draft", label: "Draft" },
  { value: "review", label: "For review" },
  { value: "published", label: "Published" },
];

export function SelectCompoundDemo() {
  return (
    <Select items={items} defaultValue="draft" className="w-64">
      <Select.Label>Status</Select.Label>
      <Select.Shell>
        <Select.Value placeholder="Select status" />
        <Select.Trigger />
      </Select.Shell>
      <Select.Popover />
      <Select.Hint>Status changes are saved automatically.</Select.Hint>
    </Select>
  );
}

import { Select } from "@/components/core/Select";

const options = [
  { value: "draft", label: "Черновик" },
  { value: "review", label: "На ревью" },
  { value: "published", label: "Опубликовано" },
];

export function SelectCompoundDemo() {
  return (
    <Select options={options} defaultValue="draft" className="w-64">
      <Select.Label>Статус</Select.Label>
      <Select.TriggerGroup>
        <Select.Value placeholder="Выберите статус" />
        <Select.Trigger />
      </Select.TriggerGroup>
      <Select.Popover />
      <Select.Hint>Смена статуса сохраняется автоматически.</Select.Hint>
    </Select>
  );
}

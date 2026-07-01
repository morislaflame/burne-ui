import { Select } from "@/components/core/Select";

const options = [
  { value: "ru", label: "Русский" },
  { value: "en", label: "English" },
  { value: "de", label: "Deutsch" },
];

export function SelectSizesDemo() {
  return (
    <div className="flex w-64 flex-col gap-mid">
      <Select size="small" label="small" options={options} defaultValue="ru" />
      <Select size="base" label="base" options={options} defaultValue="ru" />
      <Select size="mid" label="mid" options={options} defaultValue="ru" />
      <Select size="large" label="large" options={options} defaultValue="ru" />
    </div>
  );
}

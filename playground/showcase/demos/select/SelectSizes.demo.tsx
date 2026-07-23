import { Select } from "@/components/core/Select";

const options = [
  { value: "ru", label: "Russian" },
  { value: "en", label: "English" },
  { value: "de", label: "Deutsch" },
];

const SIZES = ["small", "base", "mid", "large"] as const;

export function SelectSizesDemo() {
  return (
    <div className="flex w-64 flex-col gap-large">
      {SIZES.map((size) => (
        <Select
          key={size}
          size={size}
          label={size}
          options={options}
          defaultValue="ru"
        />
      ))}
    </div>
  );
}

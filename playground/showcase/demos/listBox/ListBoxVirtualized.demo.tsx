import { ListBox } from "@/components/core/ListBox";

const options = Array.from({ length: 200 }, (_, index) => ({
  value: String(index + 1),
  label: `Item ${index + 1}`,
}));

export function ListBoxVirtualizedDemo() {
  return (
    <ListBox
      virtualized
      aria-label="Items"
      defaultValue="1"
      className="w-64"
      style={{ maxHeight: "min(16rem, 50dvh)" }}
    >
      {options.map((option) => (
        <ListBox.Item key={option.value} value={option.value} label={option.label} />
      ))}
    </ListBox>
  );
}

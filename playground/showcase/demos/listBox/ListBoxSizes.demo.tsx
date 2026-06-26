import { ListBox } from "@/components/core/ListBox";
import { Surface } from "@/components/core/Surface";

const SIZES = ["small", "base", "mid", "large"] as const;

export function ListBoxSizesDemo() {
  return (
    <div className="flex flex-wrap gap-mid">
      {SIZES.map((size) => (
        <Surface key={size} variant="default" padding="plus" className="w-40">
          <ListBox size={size} defaultValue="ru">
            <ListBox.Item value="ru" label="Русский" />
            <ListBox.Item value="en" label="English" />
          </ListBox>
        </Surface>
      ))}
    </div>
  );
}

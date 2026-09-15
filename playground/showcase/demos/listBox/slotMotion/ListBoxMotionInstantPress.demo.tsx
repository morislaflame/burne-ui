import { ListBox } from "@/components/core/ListBox";
import { Surface } from "@/components/core/Surface";

export function ListBoxMotionInstantPressDemo() {
  return (
    <Surface variant="default" padding="mid" className="max-w-sm">
      <ListBox
        defaultValue="react"
        aria-label="Instant press"
        motion={{
          item: { pressIn: false },
        }}
      >
        <ListBox.Item value="react" label="React" />
        <ListBox.Item value="svelte" label="Svelte" />
        <ListBox.Item value="vue" label="Vue" />
      </ListBox>
    </Surface>
  );
}

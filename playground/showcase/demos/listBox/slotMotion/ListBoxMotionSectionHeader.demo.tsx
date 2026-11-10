import { ListBox } from "@/components/core/ListBox";
import { Surface } from "@/components/core/Surface";

export function ListBoxMotionSectionHeaderDemo() {
  return (
    <div className="flex w-full flex-col gap-large">
      <Surface variant="default" padding="mid" className="max-w-sm">
        <ListBox
          defaultValue="ru"
          aria-label="Languages"
          motion={{
            header: {
              enter: (ctx) =>
                ctx.fromTo({ y: 6, opacity: 0 }, { y: 0, opacity: 1, duration: 0.26 }),
            },
          }}
        >
          <ListBox.Section>
            <ListBox.Header>Available</ListBox.Header>
            <ListBox.Item value="ru" label="Russian" />
            <ListBox.Item value="en" label="English" />
          </ListBox.Section>
        </ListBox>
      </Surface>
      <Surface variant="default" padding="mid" className="max-w-sm">
        <ListBox
          aria-label="Empty languages"
          motion={{
            empty: {
              enter: (ctx) =>
                ctx.fromTo(
                  { y: 8, opacity: 0 },
                  { y: 0, opacity: 1, duration: 0.28, delay: 0.06 },
                ),
            },
          }}
        >
          <ListBox.Empty>No languages yet.</ListBox.Empty>
        </ListBox>
      </Surface>
    </div>
  );
}

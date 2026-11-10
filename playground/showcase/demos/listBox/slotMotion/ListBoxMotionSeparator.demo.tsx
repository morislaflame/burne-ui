import { ListBox } from "@/components/core/ListBox";
import { Surface } from "@/components/core/Surface";

export function ListBoxMotionSeparatorDemo() {
  return (
    <Surface variant="default" padding="mid" className="max-w-sm">
      <ListBox
        defaultValue="inbox"
        aria-label="Mailboxes"
        motion={{
          separator: {
            enter: (ctx) =>
              ctx.fromTo(
                { scaleX: 0.4, opacity: 0 },
                { scaleX: 1, opacity: 1, duration: 0.24, delay: 0.06 },
              ),
          },
        }}
      >
        <ListBox.Item value="inbox" label="Inbox" />
        <ListBox.Item value="starred" label="Starred" />
        <ListBox.Separator />
        <ListBox.Item value="trash" label="Trash" />
      </ListBox>
    </Surface>
  );
}

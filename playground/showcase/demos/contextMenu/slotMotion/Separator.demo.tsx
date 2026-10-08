import { ContextMenu } from "@/components/core/ContextMenu";

const surface =
  "min-h-control-large min-w-component-small items-center justify-center rounded-mid border-token bg-surface px-large text-foreground";

export function ContextMenuMotionSeparatorDemo() {
  return (
    <ContextMenu
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
      <ContextMenu.Trigger className={surface}>Separator</ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Item>Rename</ContextMenu.Item>
        <ContextMenu.Separator />
        <ContextMenu.Item status="danger">Delete</ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu>
  );
}

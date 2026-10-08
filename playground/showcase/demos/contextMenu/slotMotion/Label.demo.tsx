import { ContextMenu } from "@/components/core/ContextMenu";

const surface =
  "min-h-control-large min-w-component-small items-center justify-center rounded-mid border-token bg-surface px-large text-foreground";

export function ContextMenuMotionLabelDemo() {
  return (
    <ContextMenu
      motion={{
        label: {
          enter: (ctx) =>
            ctx.fromTo({ y: 6, opacity: 0 }, { y: 0, opacity: 1, duration: 0.22, delay: 0.04 }),
        },
        subTrigger: {
          enter: (ctx) =>
            ctx.fromTo({ x: -8, opacity: 0 }, { x: 0, opacity: 1, duration: 0.24, delay: 0.08 }),
        },
      }}
    >
      <ContextMenu.Trigger className={surface}>Label</ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Label>Share</ContextMenu.Label>
        <ContextMenu.Item>Copy link</ContextMenu.Item>
        <ContextMenu.Sub>
          <ContextMenu.SubTrigger>Invite</ContextMenu.SubTrigger>
          <ContextMenu.SubContent>
            <ContextMenu.Item>Email</ContextMenu.Item>
          </ContextMenu.SubContent>
        </ContextMenu.Sub>
      </ContextMenu.Content>
    </ContextMenu>
  );
}

import { IoArchiveOutline, IoCopyOutline, IoCreateOutline, IoTrashOutline } from "react-icons/io5";

import { ContextMenu } from "@/components/core/ContextMenu";

const surface =
  "min-h-control-large min-w-component-small items-center justify-center rounded-mid border-token bg-surface px-large text-foreground";

export function ContextMenuMotionBodyStaggerDemo() {
  return (
    <ContextMenu
      motion={{
        body: {
          enter: (ctx) => {
            const items = ctx.getTargets("item");
            const icons = ctx.getTargets("itemIcon");
            const hints = ctx.getTargets("itemHint");
            if (items.length === 0) return undefined;
            const tl = ctx.timeline();
            items.forEach((item, index) => {
              tl.fromTo(
                item,
                { x: -10, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.22, ease: "power2.out" },
                index * 0.045,
              );
            });
            icons.forEach((icon, index) => {
              tl.fromTo(
                icon,
                { scale: 0.5, opacity: 0 },
                { scale: 1, opacity: 1, duration: 0.2, ease: "back.out(1.6)" },
                index * 0.045 + 0.05,
              );
            });
            hints.forEach((hint, index) => {
              tl.fromTo(
                hint,
                { y: 4, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.18, ease: "power2.out" },
                index * 0.045 + 0.08,
              );
            });
            return tl;
          },
        },
      }}
    >
      <ContextMenu.Trigger className={surface}>Stagger</ContextMenu.Trigger>
      <ContextMenu.Content className="min-w-52">
        <ContextMenu.Item>
          <ContextMenu.ItemLabel>Rename</ContextMenu.ItemLabel>
          <ContextMenu.ItemHint>Change the title</ContextMenu.ItemHint>
          <ContextMenu.ItemIcon>
            <IoCreateOutline aria-hidden />
          </ContextMenu.ItemIcon>
        </ContextMenu.Item>
        <ContextMenu.Item>
          <ContextMenu.ItemLabel>Duplicate</ContextMenu.ItemLabel>
          <ContextMenu.ItemHint>Make a copy</ContextMenu.ItemHint>
          <ContextMenu.ItemIcon>
            <IoCopyOutline aria-hidden />
          </ContextMenu.ItemIcon>
        </ContextMenu.Item>
        <ContextMenu.Item>
          <ContextMenu.ItemLabel>Archive</ContextMenu.ItemLabel>
          <ContextMenu.ItemHint>Hide from the list</ContextMenu.ItemHint>
          <ContextMenu.ItemIcon>
            <IoArchiveOutline aria-hidden />
          </ContextMenu.ItemIcon>
        </ContextMenu.Item>
        <ContextMenu.Item status="danger">
          <ContextMenu.ItemLabel>Delete</ContextMenu.ItemLabel>
          <ContextMenu.ItemHint>No undo</ContextMenu.ItemHint>
          <ContextMenu.ItemIcon>
            <IoTrashOutline aria-hidden />
          </ContextMenu.ItemIcon>
        </ContextMenu.Item>
      </ContextMenu.Content>
    </ContextMenu>
  );
}

import { IoLinkOutline, IoMailOutline } from "react-icons/io5";

import { ContextMenu } from "@/components/core/ContextMenu";

const surface =
  "min-h-control-large min-w-component-small items-center justify-center rounded-mid border-token bg-surface px-large text-foreground";

export function ContextMenuMotionSubSlideDemo() {
  return (
    <ContextMenu>
      <ContextMenu.Trigger className={surface}>Submenu</ContextMenu.Trigger>
      <ContextMenu.Content>
        <ContextMenu.Sub>
          <ContextMenu.SubTrigger>Invite</ContextMenu.SubTrigger>
          <ContextMenu.SubContent
            motion={{
              enter: (ctx) =>
                ctx.fromTo(
                  { x: 18, opacity: 0 },
                  { x: 0, opacity: 1, duration: 0.24, ease: "power3.out" },
                ),
              leave: { x: 14, autoAlpha: 0, duration: 0.16, ease: "power2.in" },
            }}
          >
            <ContextMenu.Item>
              <ContextMenu.ItemLabel>Email</ContextMenu.ItemLabel>
              <ContextMenu.ItemIcon>
                <IoMailOutline aria-hidden />
              </ContextMenu.ItemIcon>
            </ContextMenu.Item>
            <ContextMenu.Item>
              <ContextMenu.ItemLabel>Copy link</ContextMenu.ItemLabel>
              <ContextMenu.ItemIcon>
                <IoLinkOutline aria-hidden />
              </ContextMenu.ItemIcon>
            </ContextMenu.Item>
          </ContextMenu.SubContent>
        </ContextMenu.Sub>
      </ContextMenu.Content>
    </ContextMenu>
  );
}

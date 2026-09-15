import { IoArchiveOutline, IoCopyOutline, IoCreateOutline, IoTrashOutline } from "react-icons/io5";

import { Button } from "@/components/core/Button";
import { Dropdown } from "@/components/core/Dropdown";

export function DropdownMotionBodyStaggerDemo() {
  return (
    <Dropdown
      motion={{
        body: {
          enter: (ctx) => {
            const items = ctx.getTargets("item");
            const icons = ctx.getTargets("itemIcon");
            const hints = ctx.getTargets("itemHint");
            if (items.length === 0) return undefined;
            const tl = ctx.timeline();
            items.forEach((item, i) => {
              tl.fromTo(
                item,
                { x: -10, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.22, ease: "power2.out" },
                i * 0.045,
              );
            });
            icons.forEach((icon, i) => {
              tl.fromTo(
                icon,
                { scale: 0.5, autoAlpha: 0 },
                { scale: 1, autoAlpha: 1, duration: 0.2, ease: "back.out(1.6)" },
                i * 0.045 + 0.05,
              );
            });
            hints.forEach((hint, i) => {
              tl.fromTo(
                hint,
                { y: 4, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.18, ease: "power2.out" },
                i * 0.045 + 0.08,
              );
            });
            return tl;
          },
          leave: (ctx) => {
            const items = ctx.getTargets("item");
            if (items.length === 0) return undefined;
            const tl = ctx.timeline();
            items.forEach((item, i) => {
              tl.to(item, { x: -8, autoAlpha: 0, duration: 0.12, ease: "power2.in" }, i * 0.03);
            });
            return tl;
          },
        },
      }}
    >
      <Dropdown.Trigger asChild>
        <Button variant="outline" type="button">
          Body stagger
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Popover>
        <Dropdown.Group>
          <Dropdown.Label>Actions</Dropdown.Label>
          <Dropdown.Item value="edit" selection={false}>
            <Dropdown.ItemLabel>Edit</Dropdown.ItemLabel>
            <Dropdown.ItemHint>Rename this item</Dropdown.ItemHint>
            <Dropdown.ItemIcon>
              <IoCreateOutline />
            </Dropdown.ItemIcon>
          </Dropdown.Item>
          <Dropdown.Item value="copy" selection={false}>
            <Dropdown.ItemLabel>Duplicate</Dropdown.ItemLabel>
            <Dropdown.ItemHint>Make a copy</Dropdown.ItemHint>
            <Dropdown.ItemIcon>
              <IoCopyOutline />
            </Dropdown.ItemIcon>
          </Dropdown.Item>
          <Dropdown.Item value="archive" selection={false}>
            <Dropdown.ItemLabel>Archive</Dropdown.ItemLabel>
            <Dropdown.ItemHint>Hide from the list</Dropdown.ItemHint>
            <Dropdown.ItemIcon>
              <IoArchiveOutline />
            </Dropdown.ItemIcon>
          </Dropdown.Item>
          <Dropdown.Item value="delete" selection={false}>
            <Dropdown.ItemLabel>Delete</Dropdown.ItemLabel>
            <Dropdown.ItemHint>No undo</Dropdown.ItemHint>
            <Dropdown.ItemIcon>
              <IoTrashOutline />
            </Dropdown.ItemIcon>
          </Dropdown.Item>
        </Dropdown.Group>
      </Dropdown.Popover>
    </Dropdown>
  );
}

import gsap from "gsap";

import { Button } from "@/components/core/Button";
import { Dropdown } from "@/components/core/Dropdown";

const TL = { overwrite: "auto" as const, force3D: false };

function menuItems(el: HTMLElement) {
  return el.querySelectorAll<HTMLElement>('[role="menuitem"]');
}

export function DropdownMotionBodyStaggerDemo() {
  return (
    <Dropdown
      motion={{
        body: {
          enter: (ctx) => {
            const items = menuItems(ctx.el);
            if (items.length === 0) return undefined;
            return gsap.fromTo(
              items,
              { x: -10, opacity: 0 },
              { x: 0, opacity: 1, duration: 0.22, stagger: 0.045, ease: "power2.out", ...TL },
            );
          },
          leave: (ctx) => {
            const items = menuItems(ctx.el);
            if (items.length === 0) return undefined;
            return gsap.to(items, {
              x: -8,
              autoAlpha: 0,
              duration: 0.12,
              stagger: 0.03,
              ease: "power2.in",
              ...TL,
            });
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
          </Dropdown.Item>
          <Dropdown.Item value="copy" selection={false}>
            <Dropdown.ItemLabel>Duplicate</Dropdown.ItemLabel>
          </Dropdown.Item>
          <Dropdown.Item value="archive" selection={false}>
            <Dropdown.ItemLabel>Archive</Dropdown.ItemLabel>
          </Dropdown.Item>
          <Dropdown.Item value="delete" selection={false}>
            <Dropdown.ItemLabel>Delete</Dropdown.ItemLabel>
          </Dropdown.Item>
        </Dropdown.Group>
      </Dropdown.Popover>
    </Dropdown>
  );
}

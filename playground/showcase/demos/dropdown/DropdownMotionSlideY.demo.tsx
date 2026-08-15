import gsap from "gsap";

import { Button } from "@/components/core/Button";
import { Dropdown } from "@/components/core/Dropdown";

export function DropdownMotionSlideYDemo() {
  return (
    <Dropdown
      motion={{
        content: {
          enter: (ctx) =>
            gsap.fromTo(
              ctx.el,
              { y: 10, opacity: 0 },
              {
                y: 0,
                opacity: 1,
                duration: 0.24,
                ease: "power2.out",
                overwrite: "auto",
                force3D: false,
              },
            ),
          leave: (ctx) =>
            gsap.to(ctx.el, {
              y: 8,
              autoAlpha: 0,
              duration: 0.16,
              overwrite: "auto",
              force3D: false,
            }),
        },
      }}
    >
      <Dropdown.Trigger asChild>
        <Button variant="primary" type="button">
          Slide y
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Popover>
        <Dropdown.Group>
          <Dropdown.Item value="share" selection={false}>
            <Dropdown.ItemLabel>Share</Dropdown.ItemLabel>
          </Dropdown.Item>
          <Dropdown.Item value="export" selection={false}>
            <Dropdown.ItemLabel>Export</Dropdown.ItemLabel>
          </Dropdown.Item>
        </Dropdown.Group>
      </Dropdown.Popover>
    </Dropdown>
  );
}

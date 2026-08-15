import gsap from "gsap";

import { Button } from "@/components/core/Button";
import { Dropdown } from "@/components/core/Dropdown";

const TL = { overwrite: "auto" as const, force3D: false };

export function DropdownMotionSubSlideXDemo() {
  return (
    <Dropdown>
      <Dropdown.Trigger asChild>
        <Button variant="outline" type="button">
          Submenu slide
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Popover>
        <Dropdown.Group>
          <Dropdown.Sub>
            <Dropdown.SubTrigger>Invite</Dropdown.SubTrigger>
            <Dropdown.SubContent
              motion={{
                enter: (ctx) =>
                  gsap.fromTo(
                    ctx.el,
                    { x: 18, opacity: 0 },
                    { x: 0, opacity: 1, duration: 0.24, ease: "power3.out", ...TL },
                  ),
                leave: (ctx) =>
                  gsap.to(ctx.el, {
                    x: 14,
                    autoAlpha: 0,
                    duration: 0.16,
                    ease: "power2.in",
                    ...TL,
                  }),
              }}
            >
              <Dropdown.Item value="email" selection={false}>
                <Dropdown.ItemLabel>Email</Dropdown.ItemLabel>
              </Dropdown.Item>
              <Dropdown.Item value="link" selection={false}>
                <Dropdown.ItemLabel>Copy link</Dropdown.ItemLabel>
              </Dropdown.Item>
            </Dropdown.SubContent>
          </Dropdown.Sub>
        </Dropdown.Group>
      </Dropdown.Popover>
    </Dropdown>
  );
}

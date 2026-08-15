import gsap from "gsap";

import { Button } from "@/components/core/Button";
import { Dropdown } from "@/components/core/Dropdown";

const TL = { overwrite: "auto" as const, force3D: false };

export function DropdownMotionOriginScaleDemo() {
  return (
    <Dropdown
      motion={{
        content: {
          enter: (ctx) =>
            gsap.fromTo(
              ctx.el,
              { scale: 0.86, opacity: 0 },
              {
                scale: 1,
                opacity: 1,
                duration: 0.28,
                ease: "power3.out",
                transformOrigin: "50% 0%",
                ...TL,
              },
            ),
          leave: (ctx) =>
            gsap.to(ctx.el, {
              scale: 0.9,
              autoAlpha: 0,
              duration: 0.16,
              ease: "power2.in",
              transformOrigin: "50% 0%",
              ...TL,
            }),
        },
      }}
    >
      <Dropdown.Trigger asChild>
        <Button variant="outline" type="button">
          Origin scale
        </Button>
      </Dropdown.Trigger>
      <Dropdown.Popover>
        <Dropdown.Group>
          <Dropdown.Item value="open" selection={false}>
            <Dropdown.ItemLabel>Open</Dropdown.ItemLabel>
          </Dropdown.Item>
          <Dropdown.Item value="rename" selection={false}>
            <Dropdown.ItemLabel>Rename</Dropdown.ItemLabel>
          </Dropdown.Item>
        </Dropdown.Group>
      </Dropdown.Popover>
    </Dropdown>
  );
}

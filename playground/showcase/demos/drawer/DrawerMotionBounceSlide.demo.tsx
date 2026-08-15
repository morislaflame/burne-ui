import { useState } from "react";
import gsap from "gsap";

import { Button } from "@/components/core/Button";
import { Drawer } from "@/components/core/Drawer";
import { Text } from "@/components/core/Text";

export function DrawerMotionBounceSlideDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="primary" type="button" onClick={() => setOpen(true)}>
        Bounce slide
      </Button>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        placement="right"
        motion={{
          panel: {
            enter: (ctx) =>
              gsap.fromTo(
                ctx.el,
                { x: 80 },
                {
                  x: 0,
                  duration: 0.5,
                  ease: "back.out(1.4)",
                  overwrite: "auto",
                  force3D: false,
                },
              ),
            leave: (ctx) =>
              gsap.to(ctx.el, {
                x: ctx.el.offsetWidth,
                duration: 0.28,
                ease: "power2.in",
                overwrite: "auto",
                force3D: false,
              }),
          },
        }}
      >
        <Drawer.Panel extent="mid">
          <Drawer.Header>
            <Drawer.HeadingBlock>
              <Drawer.Title>Bounce</Drawer.Title>
              <Drawer.Description>panel factory — back.out instead of drawerSlide.</Drawer.Description>
            </Drawer.HeadingBlock>
            <Drawer.Close />
          </Drawer.Header>
          <Drawer.Body>
            <Text as="p" variant="base">
              Leave slides the full panel width so unmount is not a snap.
            </Text>
          </Drawer.Body>
        </Drawer.Panel>
      </Drawer>
    </>
  );
}

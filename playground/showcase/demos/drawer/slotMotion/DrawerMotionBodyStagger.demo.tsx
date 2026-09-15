import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Drawer } from "@/components/core/Drawer";
import { Text } from "@/components/core/Text";

export function DrawerMotionBodyStaggerDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" type="button" onClick={() => setOpen(true)}>
        Stagger body
      </Button>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        placement="right"
        motion={{
          title: {
            enter: (ctx) =>
              ctx.fromTo(
                { y: 10, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.28, delay: 0.04 },
              ),
            leave: { y: -6, autoAlpha: 0, duration: 0.16 },
          },
          body: {
            enter: (ctx) =>
              ctx.fromTo(
                { y: 16, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.34, delay: 0.1 },
              ),
            leave: { y: 8, autoAlpha: 0, duration: 0.16 },
          },
        }}
      >
        <Drawer.Panel>
          <Drawer.Header>
            <Drawer.HeadingBlock>
              <Drawer.Title>Staggered body</Drawer.Title>
              <Drawer.Description>Body enters after the title.</Drawer.Description>
            </Drawer.HeadingBlock>
            <Drawer.Close />
          </Drawer.Header>
          <Drawer.Body>
            <Text as="p" variant="base">
              Animate `motion.body` on the scroll area, not the panel host.
            </Text>
          </Drawer.Body>
        </Drawer.Panel>
      </Drawer>
    </>
  );
}

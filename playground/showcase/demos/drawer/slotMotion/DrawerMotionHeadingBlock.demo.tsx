import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Drawer } from "@/components/core/Drawer";
import { Text } from "@/components/core/Text";

export function DrawerMotionHeadingBlockDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" type="button" onClick={() => setOpen(true)}>
        Heading block
      </Button>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        placement="right"
        motion={{
          headingBlock: {
            enter: (ctx) =>
              ctx.fromTo(
                { y: 10, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.3, delay: 0.08 },
              ),
            leave: { y: -6, autoAlpha: 0, duration: 0.16 },
          },
        }}
      >
        <Drawer.Panel extent="mid">
          <Drawer.Header>
            <Drawer.HeadingBlock>
              <Drawer.Title>Heading block</Drawer.Title>
              <Drawer.Description>Title group enters after the slide.</Drawer.Description>
            </Drawer.HeadingBlock>
            <Drawer.Close />
          </Drawer.Header>
          <Drawer.Body>
            <Text as="p" variant="base">
              Animate `motion.headingBlock` independently from `title`.
            </Text>
          </Drawer.Body>
        </Drawer.Panel>
      </Drawer>
    </>
  );
}

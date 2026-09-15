import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Drawer } from "@/components/core/Drawer";
import { Text } from "@/components/core/Text";

export function DrawerMotionTitleStaggerDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" type="button" onClick={() => setOpen(true)}>
        Stagger title
      </Button>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        placement="right"
        motion={{
          title: {
            enter: (ctx) =>
              ctx.fromTo(
                { y: 12, autoAlpha: 0 },
                { y: 0, autoAlpha: 1, duration: 0.35, delay: 0.08 },
              ),
            leave: { y: -8, autoAlpha: 0, duration: 0.2 },
          },
        }}
      >
        <Drawer.Panel extent="mid">
          <Drawer.Header>
            <Drawer.HeadingBlock>
              <Drawer.Title>Staggered title</Drawer.Title>
              <Drawer.Description>Title enters after the slide. Leave returns a tween.</Drawer.Description>
            </Drawer.HeadingBlock>
            <Drawer.Close />
          </Drawer.Header>
          <Drawer.Body>
            <Text as="p" variant="base">
              Overlay and panel keep the kit recipes.
            </Text>
          </Drawer.Body>
        </Drawer.Panel>
      </Drawer>
    </>
  );
}

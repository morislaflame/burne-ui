import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Drawer } from "@/components/core/Drawer";
import { Text } from "@/components/core/Text";

export function DrawerMotionDefaultDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" type="button" onClick={() => setOpen(true)}>
        Default slide
      </Button>
      <Drawer open={open} onOpenChange={setOpen} placement="right">
        <Drawer.Panel extent="mid">
          <Drawer.Header>
            <Drawer.HeadingBlock>
              <Drawer.Title>Default</Drawer.Title>
              <Drawer.Description>Kit overlay fade + drawerSlide recipes.</Drawer.Description>
            </Drawer.HeadingBlock>
            <Drawer.Close />
          </Drawer.Header>
          <Drawer.Body>
            <Text as="p" variant="base">
              Panel slides in from the right.
            </Text>
          </Drawer.Body>
        </Drawer.Panel>
      </Drawer>
    </>
  );
}

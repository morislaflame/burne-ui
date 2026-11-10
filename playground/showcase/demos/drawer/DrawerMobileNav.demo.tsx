import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Drawer } from "@/components/core/Drawer";

const NAV = ["Home", "Projects", "Team", "Settings"] as const;

export function DrawerMobileNavDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>

      <Drawer open={open} onOpenChange={setOpen} placement="left">
        <Drawer.Trigger asChild>
          <Button variant="outline">Menu</Button>
        </Drawer.Trigger>
        <Drawer.Panel>
          <Drawer.Header>
          <Drawer.HeadingBlock>
            <Drawer.Title>Navigation</Drawer.Title>
          </Drawer.HeadingBlock>
          <Drawer.Close />
        </Drawer.Header>
        <Drawer.Body>
          <nav aria-label="Mobile menu" className="flex flex-col gap-xsmall">
            {NAV.map((item) => (
              <Button key={item} variant="ghost" size="small" type="button" className="justify-start">
                {item}
              </Button>
            ))}
          </nav>
        </Drawer.Body>
        </Drawer.Panel>
      </Drawer>
    </>
  );
}

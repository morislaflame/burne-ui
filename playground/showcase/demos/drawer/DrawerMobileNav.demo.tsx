import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Drawer } from "@/components/core/Drawer";

const NAV = ["Главная", "Проекты", "Команда", "Настройки"] as const;

export function DrawerMobileNavDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="outline" type="button" onClick={() => setOpen(true)}>
        Меню
      </Button>

      <Drawer open={open} onOpenChange={setOpen} placement="left">
        <Drawer.Header>
          <Drawer.HeadingBlock>
            <Drawer.Title>Навигация</Drawer.Title>
          </Drawer.HeadingBlock>
          <Drawer.Close />
        </Drawer.Header>
        <Drawer.Body>
          <nav aria-label="Мобильное меню" className="flex flex-col gap-xsmall">
            {NAV.map((item) => (
              <Button key={item} variant="ghost" size="small" type="button" className="justify-start">
                {item}
              </Button>
            ))}
          </nav>
        </Drawer.Body>
      </Drawer>
    </>
  );
}

import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Drawer } from "@/components/core/Drawer";
import { Text } from "@/components/core/Text";

export function DrawerPlacementDemo() {
  const [rightOpen, setRightOpen] = useState(false);
  const [leftOpen, setLeftOpen] = useState(false);

  return (
    <>
      <div className="flex flex-wrap gap-small">
        <Button variant="outline" onClick={() => setRightOpen(true)}>
          Drawer (right)
        </Button>
        <Button variant="outline" onClick={() => setLeftOpen(true)}>
          Drawer (left)
        </Button>
      </div>

      <Drawer open={rightOpen} onOpenChange={setRightOpen} placement="right">
        <Drawer.Header>
          <Drawer.HeadingBlock>
            <Drawer.Title>Настройки</Drawer.Title>
            <Drawer.Description>Выдвижная панель справа.</Drawer.Description>
          </Drawer.HeadingBlock>
          <Drawer.Close />
        </Drawer.Header>
        <Drawer.Body>
          <Text as="p" variant="small" className="text-muted">
            Произвольный контент внутри drawer.
          </Text>
        </Drawer.Body>
        <Drawer.Footer>
          <Button variant="ghost" onClick={() => setRightOpen(false)}>
            Отмена
          </Button>
          <Button onClick={() => setRightOpen(false)}>Сохранить</Button>
        </Drawer.Footer>
      </Drawer>

      <Drawer open={leftOpen} onOpenChange={setLeftOpen} placement="left" size="mid">
        <Drawer.Header>
          <Drawer.HeadingBlock>
            <Drawer.Title>Навигация</Drawer.Title>
            <Drawer.Description>Drawer слева, size mid.</Drawer.Description>
          </Drawer.HeadingBlock>
          <Drawer.Close />
        </Drawer.Header>
        <Drawer.Body>
          <div className="flex flex-col gap-small">
            <Button variant="ghost" size="small">
              Профиль
            </Button>
            <Button variant="ghost" size="small">
              Настройки
            </Button>
          </div>
        </Drawer.Body>
      </Drawer>
    </>
  );
}

import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Drawer } from "@/components/core/Drawer";

export function DrawerClassNamesFullDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Drawer
        open={open}
        onOpenChange={setOpen}
        classNames={{
          panel: "border-primary/40 shadow-token-large",
          header: "border-b border-primary/20 pb-small",
          title: "text-primary font-w-strong",
          description: "text-foreground/75",
          footer: "border-t border-primary/20 pt-small",
        }}
      >
        <Drawer.Trigger asChild>
          <Button variant="outline">Открыть с classNames</Button>
        </Drawer.Trigger>
        <Drawer.Panel>
          <Drawer.Header>
          <Drawer.HeadingBlock>
            <Drawer.Title>Настройки</Drawer.Title>
            <Drawer.Description>Слоты настроены через classNames.</Drawer.Description>
          </Drawer.HeadingBlock>
          <Drawer.Close />
        </Drawer.Header>
        <Drawer.Body>
          <p className="text-small text-muted">Пример body-слота с кастомными стилями панели.</p>
        </Drawer.Body>
        <Drawer.Footer>
          <Button size="small" variant="outline" onClick={() => setOpen(false)}>
            Закрыть
          </Button>
        </Drawer.Footer>
        </Drawer.Panel>
      </Drawer>
    </>
  );
}

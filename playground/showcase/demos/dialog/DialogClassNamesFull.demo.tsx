import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Dialog } from "@/components/core/Dialog";

export function DialogClassNamesFullDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button type="button" onClick={() => setOpen(true)}>
        Открыть с classNames
      </Button>
      <Dialog
        open={open}
        onOpenChange={setOpen}
        classNames={{
          panel: "border-primary/40 shadow-token-lg",
          header: "border-b border-primary/20 pb-small",
          title: "text-primary font-semibold",
          description: "text-foreground/75",
          footer: "border-t border-primary/20 pt-small",
        }}
      >
        <Dialog.Header>
          <Dialog.HeadingBlock>
            <Dialog.Title>Настройки</Dialog.Title>
            <Dialog.Description>Слоты настроены через classNames.</Dialog.Description>
          </Dialog.HeadingBlock>
          <Dialog.Close />
        </Dialog.Header>
        <Dialog.Body>
          <p className="text-small text-muted">Пример body-слота с кастомными стилями панели.</p>
        </Dialog.Body>
        <Dialog.Footer>
          <Button size="small" variant="outline" onClick={() => setOpen(false)}>
            Закрыть
          </Button>
        </Dialog.Footer>
      </Dialog>
    </>
  );
}

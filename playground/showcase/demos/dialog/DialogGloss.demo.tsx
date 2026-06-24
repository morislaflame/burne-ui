import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Dialog } from "@/components/core/Dialog";
import { Input } from "@/components/core/Input";

export function DialogGlossDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button variant="gloss" onClick={() => setOpen(true)}>
        Gloss Dialog
      </Button>

      <Dialog open={open} onOpenChange={setOpen} variant="gloss">
        <Dialog.Header>
          <Dialog.HeadingBlock>
            <Dialog.Title>Gloss Dialog</Dialog.Title>
            <Dialog.Description>Стеклянная модальная панель.</Dialog.Description>
          </Dialog.HeadingBlock>
          <Dialog.Close />
        </Dialog.Header>
        <Dialog.Body className="flex flex-col gap-plus">
          <Input>
            <Input.Label>Имя</Input.Label>
            <Input.Control variant="gloss" name="gloss-name" placeholder="Иван" autoComplete="name" />
          </Input>
          <Input>
            <Input.Label>Email</Input.Label>
            <Input.Control
              variant="gloss"
              name="gloss-email"
              placeholder="you@example.com"
              autoComplete="email"
            />
          </Input>
        </Dialog.Body>
        <Dialog.Footer>
          <Button variant="gloss" onClick={() => setOpen(false)}>
            Отмена
          </Button>
          <Button variant="primary" onClick={() => setOpen(false)}>
            Сохранить
          </Button>
        </Dialog.Footer>
      </Dialog>
    </>
  );
}

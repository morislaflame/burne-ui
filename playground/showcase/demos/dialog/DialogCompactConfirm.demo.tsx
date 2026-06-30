import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Dialog } from "@/components/core/Dialog";
import { Text } from "@/components/core/Text";

export function DialogCompactConfirmDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <Button variant="ghost">
            Архивировать проект
          </Button>
        </Dialog.Trigger>
        <Dialog.Panel>
          <Dialog.Header>
          <Dialog.HeadingBlock>
            <Dialog.Title>Архивировать?</Dialog.Title>
            <Dialog.Description>Проект скроется из списка, но его можно восстановить.</Dialog.Description>
          </Dialog.HeadingBlock>
          <Dialog.Close />
        </Dialog.Header>
        <Dialog.Body>
          <Text as="p" variant="small" className="text-muted">
            Компактный диалог без лишних полей — только подтверждение.
          </Text>
        </Dialog.Body>
        <Dialog.Footer>
          <Button variant="outline" type="button" onClick={() => setOpen(false)}>
            Отмена
          </Button>
          <Button type="button" onClick={() => setOpen(false)}>
            Архивировать
          </Button>
        </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}

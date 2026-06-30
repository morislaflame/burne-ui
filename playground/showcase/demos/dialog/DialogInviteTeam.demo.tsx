import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Dialog } from "@/components/core/Dialog";
import { Input } from "@/components/core/Input";

export function DialogInviteTeamDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>

      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Trigger asChild>
          <Button variant="outline">Пригласить в команду</Button>
        </Dialog.Trigger>
        <Dialog.Panel>
          <Dialog.Header>
          <Dialog.HeadingBlock>
            <Dialog.Title>Приглашение</Dialog.Title>
            <Dialog.Description>Отправьте ссылку коллеге по email.</Dialog.Description>
          </Dialog.HeadingBlock>
          <Dialog.Close />
        </Dialog.Header>
        <Dialog.Body className="flex flex-col gap-plus">
          <Input>
            <Input.Label>Email</Input.Label>
            <Input.Control name="invite-email" placeholder="colleague@company.com" autoComplete="email" />
          </Input>
        </Dialog.Body>
        <Dialog.Footer>
          <Button variant="outline" type="button" onClick={() => setOpen(false)}>
            Отмена
          </Button>
          <Button type="button" onClick={() => setOpen(false)}>
            Отправить
          </Button>
        </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}

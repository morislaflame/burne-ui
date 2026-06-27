import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Card } from "@/components/core/Card";
import { Dialog } from "@/components/core/Dialog";
import { Ripple } from "@/components/core/Ripple";
import { PIN_IMAGE4 } from "@/utils/mockImages";

export function RipplePressableCardDemo() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Card pressable onPress={() => setDialogOpen(true)} className="max-w-xs">
        <Ripple color="neutral" />
        <div className="relative z-[1]">
          <Card.Body className="px-0 pb-0 pt-0">
            <div
              className="h-24 w-full overflow-hidden bg-cover bg-center"
              style={{ backgroundImage: `url(${PIN_IMAGE4})` }}
            />
          </Card.Body>
          <Card.Header className="pt-base gap-xsmall">
            <Card.Title>Pressable</Card.Title>
            <Card.Description>Нажми — откроется Dialog.</Card.Description>
          </Card.Header>
        </div>
      </Card>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Header>
          <Dialog.HeadingBlock>
            <Dialog.Title>Ripple на Card</Dialog.Title>
            <Dialog.Description>
              Слой Ripple слушает нажатия на pressable-корне карточки.
            </Dialog.Description>
          </Dialog.HeadingBlock>
          <Dialog.Close />
        </Dialog.Header>
        <Dialog.Footer>
          <Button variant="outline" onClick={() => setDialogOpen(false)}>
            Закрыть
          </Button>
        </Dialog.Footer>
      </Dialog>
    </>
  );
}

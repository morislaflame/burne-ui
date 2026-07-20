import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Card } from "@/components/core/Card";
import { Dialog } from "@/components/core/Dialog";
import { Ripple } from "@/components/core/Ripple";
import { Text } from "@/components/core/Text";
import { PIN_IMAGE4 } from "@/stories-utils/mockImages";

export function CardPressableDemo() {
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <Dialog.Trigger asChild>
          <Card pressable className="max-w-sm">
          <Ripple color="neutral" />
          <div className="relative z-[1]">
            <Card.Body className="px-large pb-0 pt-plus">
              <div
                className="h-24 w-full overflow-hidden rounded-small bg-cover bg-center"
                style={{ backgroundImage: `url(${PIN_IMAGE4})` }}
              />
            </Card.Body>
            <Card.Header className="pt-plus gap-xsmall">
              <Card.Title>Pressable</Card.Title>
              <Card.Description>Click - it will open Dialog.</Card.Description>
            </Card.Header>
          </div>
        </Card>
        </Dialog.Trigger>
        <Dialog.Panel>
          <Dialog.Header>
          <Dialog.HeadingBlock>
            <Dialog.Title>Pressable Card</Dialog.Title>
            <Dialog.Description>The dialogue is opened by clicking on the card.</Dialog.Description>
          </Dialog.HeadingBlock>
          <Dialog.Close />
        </Dialog.Header>
        <Dialog.Body>
          <Text as="p" variant="base">
            Modal window content.
          </Text>
        </Dialog.Body>
        <Dialog.Footer>
          <Button onClick={() => setDialogOpen(false)}>Close</Button>
        </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}

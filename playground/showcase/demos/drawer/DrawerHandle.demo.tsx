import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Drawer, type DrawerPlacement } from "@/components/core/Drawer";
import { Text } from "@/components/core/Text";

const PLACEMENTS: DrawerPlacement[] = ["bottom", "top", "left", "right"];

const HANDLE_HINT: Record<DrawerPlacement, string> = {
  bottom: "Drag the handle down to close.",
  top: "Drag the handle up to close.",
  left: "Drag the handle left to close.",
  right: "Drag the handle right to close.",
};

function DrawerHandlePanel({ placement }: { placement: DrawerPlacement }) {
  const isHorizontal = placement === "left" || placement === "right";

  const main = (
    <>
      <Drawer.Header>
        <Drawer.HeadingBlock>
          <Drawer.Title>Handle · {placement}</Drawer.Title>
          <Drawer.Description>{HANDLE_HINT[placement]}</Drawer.Description>
        </Drawer.HeadingBlock>
        <Drawer.Close />
      </Drawer.Header>
      <Drawer.Body>
        <Text as="p" variant="small" className="text-muted">
          {HANDLE_HINT[placement]} Swipe via <code>Drawer.Handle</code>.
        </Text>
      </Drawer.Body>
    </>
  );

  if (isHorizontal) {
    return (
      <div className="flex min-h-0 min-w-0 flex-1 self-stretch">
        {placement === "right" ? <Drawer.Handle /> : null}
        <div className="flex min-h-0 min-w-0 flex-1 flex-col">{main}</div>
        {placement === "left" ? <Drawer.Handle /> : null}
      </div>
    );
  }

  if (placement === "top") {
    return (
      <>
        {main}
        <Drawer.Handle />
      </>
    );
  }

  return (
    <>
      <Drawer.Handle />
      {main}
    </>
  );
}

export function DrawerHandleDemo() {
  const [open, setOpen] = useState<DrawerPlacement | null>(null);

  return (
    <>
      <div className="flex flex-wrap gap-small">
        {PLACEMENTS.map((placement) => (
          <Button key={placement} variant="outline" onClick={() => setOpen(placement)}>
            {placement}
          </Button>
        ))}
      </div>

      {PLACEMENTS.map((placement) => {
        const isHorizontal = placement === "left" || placement === "right";

        return (
          <Drawer
            key={placement}
            open={open === placement}
            onOpenChange={(next) => !next && setOpen(null)}
            placement={placement}
          >
            <Drawer.Panel extent={isHorizontal ? "mid" : "default"}>
              <DrawerHandlePanel placement={placement} />
            </Drawer.Panel>
          </Drawer>
        );
      })}
    </>
  );
}

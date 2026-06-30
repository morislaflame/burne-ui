import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Drawer, type DrawerPlacement } from "@/components/core/Drawer";
import { Text } from "@/components/core/Text";

const PLACEMENTS: DrawerPlacement[] = ["right", "left", "top", "bottom"];

export function DrawerPlacementDemo() {
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
            <Drawer.Panel size={isHorizontal ? "mid" : "default"}>
              <Drawer.Header>
              <Drawer.HeadingBlock>
                <Drawer.Title>placement={placement}</Drawer.Title>
                <Drawer.Description>
                  {isHorizontal ? "Горизонтальная панель, size mid." : "Вертикальная панель, size default."}
                </Drawer.Description>
              </Drawer.HeadingBlock>
              <Drawer.Close />
            </Drawer.Header>
            <Drawer.Body>
              <Text as="p" variant="small" className="text-muted">
                Контент drawer с placement &quot;{placement}&quot;.
              </Text>
            </Drawer.Body>
            <Drawer.Footer>
              <Button variant="ghost" onClick={() => setOpen(null)}>
                Закрыть
              </Button>
            </Drawer.Footer>
            </Drawer.Panel>
          </Drawer>
        );
      })}
    </>
  );
}

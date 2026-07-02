import { useState } from "react";

import { AlertDialog } from "@/components/composite/AlertDialog";
import { Button } from "@/components/core/Button";

const SIZES = ["small", "base", "mid", "large"] as const;

export function AlertDialogSizesDemo() {
  const [openSize, setOpenSize] = useState<(typeof SIZES)[number] | null>(null);

  return (
    <>
      <div className="flex flex-wrap gap-small">
        {SIZES.map((size) => (
          <Button key={size} type="button" variant="outline" onClick={() => setOpenSize(size)}>
            {size}
          </Button>
        ))}
      </div>

      {SIZES.map((size) => (
        <AlertDialog
          key={size}
          open={openSize === size}
          onOpenChange={(open) => setOpenSize(open ? size : null)}
          size={size}
          status="info"
        >
          <AlertDialog.Panel>
            <AlertDialog.Header>
            <AlertDialog.HeadingBlock>
              <AlertDialog.Title>AlertDialog size={size}</AlertDialog.Title>
              <AlertDialog.Description>
                Ширина панели, типографика и кнопки футера масштабируются с size.
              </AlertDialog.Description>
            </AlertDialog.HeadingBlock>
          </AlertDialog.Header>
          <AlertDialog.Footer>
            <Button type="button" variant="outline" onClick={() => setOpenSize(null)}>
              Закрыть
            </Button>
            <Button type="button" variant="primary" onClick={() => setOpenSize(null)}>
              OK
            </Button>
          </AlertDialog.Footer>
          </AlertDialog.Panel>
        </AlertDialog>
      ))}
    </>
  );
}

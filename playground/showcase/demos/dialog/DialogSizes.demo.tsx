import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Dialog } from "@/components/core/Dialog";

const SIZES = ["small", "base", "mid", "large"] as const;

export function DialogSizesDemo() {
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
        <Dialog
          key={size}
          open={openSize === size}
          onOpenChange={(open) => setOpenSize(open ? size : null)}
          size={size}
        >
          <Dialog.Panel>
            <Dialog.Header>
              <Dialog.HeadingBlock>
                <Dialog.Title>Dialog size={size}</Dialog.Title>
                <Dialog.Description>
                  Panel width, typography and footer buttons scale with size.
                </Dialog.Description>
              </Dialog.HeadingBlock>
              <Dialog.Close />
            </Dialog.Header>
            <Dialog.Body>
              <p className="text-sm text-muted">
                Custom content in Body — forms, text, lists.
              </p>
            </Dialog.Body>
            <Dialog.Footer>
              <Button type="button" variant="ghost" onClick={() => setOpenSize(null)}>
                Cancel
              </Button>
              <Button type="button" variant="primary" onClick={() => setOpenSize(null)}>
                OK
              </Button>
            </Dialog.Footer>
          </Dialog.Panel>
        </Dialog>
      ))}
    </>
  );
}

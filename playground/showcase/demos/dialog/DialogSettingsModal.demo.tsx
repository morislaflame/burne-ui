import { useState } from "react";

import { Button } from "@/components/core/Button";
import { Dialog } from "@/components/core/Dialog";
import { Switch } from "@/components/core/Switch";
import { Text } from "@/components/core/Text";

export function DialogSettingsModalDemo() {
  const [open, setOpen] = useState(false);
  const [analytics, setAnalytics] = useState(true);

  return (
    <>
      <Button variant="outline" type="button" onClick={() => setOpen(true)}>
        Privacy Settings
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <Dialog.Panel>
          <Dialog.Header>
          <Dialog.HeadingBlock>
            <Dialog.Title>Privacy</Dialog.Title>
            <Dialog.Description>Data Collection Management.</Dialog.Description>
          </Dialog.HeadingBlock>
          <Dialog.Close />
        </Dialog.Header>
        <Dialog.Body className="flex flex-col gap-large">
          <Switch
            checked={analytics}
            onChange={(e) => setAnalytics(e.target.checked)}
            label="Usage analytics"
            hint="Anonymous statistics to improve the product"
          />
          <Text as="p" variant="xsmall" className="text-muted">
            Dialog with settings form inside Body.
          </Text>
        </Dialog.Body>
        <Dialog.Footer>
          <Button type="button" onClick={() => setOpen(false)}>
            Ready
          </Button>
        </Dialog.Footer>
        </Dialog.Panel>
      </Dialog>
    </>
  );
}

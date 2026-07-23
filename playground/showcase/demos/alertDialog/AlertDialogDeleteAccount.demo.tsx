import { useState } from "react";

import { AlertDialog, primaryButtonVariantForAlertTone } from "@/components/composite/AlertDialog";
import { Button } from "@/components/core/Button";
import { Input } from "@/components/core/Input";

export function AlertDialogDeleteAccountDemo() {
  const [open, setOpen] = useState(false);

  return (
    <>

      <AlertDialog open={open} onOpenChange={setOpen} status="danger">
        <AlertDialog.Trigger asChild>
          <Button variant="primary" status="danger">
            Delete account
          </Button>
        </AlertDialog.Trigger>
        <AlertDialog.Panel>
          <AlertDialog.Header>
          <AlertDialog.HeadingBlock>
            <AlertDialog.Title>Delete account?</AlertDialog.Title>
            <AlertDialog.Description>
              All projects and data will be deleted permanently.
            </AlertDialog.Description>
          </AlertDialog.HeadingBlock>
        </AlertDialog.Header>
        <AlertDialog.Body className="flex flex-col gap-mid">
          <Input>
            <Input.Label>Confirm email</Input.Label>
            <Input.Control name="confirm-email" placeholder="you@example.com" autoComplete="email" />
          </Input>
        </AlertDialog.Body>
        <AlertDialog.Footer>
          <Button type="button" variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            variant={primaryButtonVariantForAlertTone("danger")}
            onClick={() => setOpen(false)}
          >
            Delete
          </Button>
        </AlertDialog.Footer>
        </AlertDialog.Panel>
      </AlertDialog>
    </>
  );
}

import { IoTrashOutline } from "react-icons/io5";

import { Button } from "@/components/core/Button";
import { Text } from "@/components/core/Text";

export function ButtonDangerBannerDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-large rounded-mid border border-danger/30 bg-danger/5 p-large sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex flex-col gap-xsmall">
        <Text as="p" variant="base" className="font-medium text-danger">
          Delete all drafts?
        </Text>
        <Text as="p" variant="small" className="text-muted">
          The action is irreversible.
        </Text>
      </div>
      <div className="flex shrink-0 gap-xsmall">
        <Button variant="ghost" size="small" className="text-muted">
          Cancel
        </Button>
        <Button
          variant="primary"
          status="danger"
          size="small"
          icon={<IoTrashOutline aria-hidden />}
          className="shadow-none"
        >
          Delete
        </Button>
      </div>
    </div>
  );
}

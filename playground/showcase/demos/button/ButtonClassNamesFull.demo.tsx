import { IoSave } from "react-icons/io5";

import { Button } from "@/components/core/Button";

export function ButtonClassNamesFullDemo() {
  return (
    <Button
      variant="outline"
      status="info"
      icon={<IoSave aria-hidden />}
      classNames={{
        root: "rounded-large border-token-info",
        content: "gap-small",
        label: "gap-small",
        icon: "icon-slot-large text-info",
        text: "font-w-strong text-info",
      }}
    >
      Save draft
    </Button>
  );
}

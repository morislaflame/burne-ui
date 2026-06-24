import { IoTimeOutline } from "react-icons/io5";

import { TimeField } from "@/components/core/TimeField";

export function TimeFieldGlossDemo() {
  return (
    <TimeField
      label="Gloss"
      variant="gloss"
      defaultValue="12:00"
      hint="Стеклянная оболочка"
      prefix={<IoTimeOutline className="icon-base shrink-0" aria-hidden />}
      className="w-64"
    />
  );
}

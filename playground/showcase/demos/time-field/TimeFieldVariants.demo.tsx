import { useState } from "react";
import { IoTimeOutline } from "react-icons/io5";

import { TimeField } from "@/components/core/TimeField";

const prefix = <IoTimeOutline className="icon-base shrink-0" aria-hidden />;

const VARIANTS = ["default", "outline", "secondary", "segmented", "gloss"] as const;

export function TimeFieldVariantsDemo() {
  const [timeValue, setTimeValue] = useState("09:30");

  return (
    <div className="grid w-full max-w-2xl gap-xlarge sm:grid-cols-2">
      {VARIANTS.map((variant) => (
        <TimeField
          key={variant}
          label={variant}
          variant={variant}
          hint={`variant="${variant}"`}
          value={timeValue}
          onValueChange={setTimeValue}
          prefix={prefix}
          className="w-full"
        />
      ))}
    </div>
  );
}

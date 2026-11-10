import { IoLockClosedOutline } from "react-icons/io5";

import { PinInput } from "@/components/core/PinInput";

export function PinInputCodeDemo() {
  return (
    <PinInput
      label={
        <span className="inline-flex items-center gap-small">
          <span className="icon-slot icon-slot-base" aria-hidden>
            <IoLockClosedOutline />
          </span>
          Verification code
        </span>
      }
      hint="Sent to your phone"
      name="otp"
      length={6}
    />
  );
}

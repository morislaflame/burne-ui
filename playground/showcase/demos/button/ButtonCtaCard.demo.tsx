import { IoArrowForward, IoRocketOutline } from "react-icons/io5";

import { Button } from "@/components/core/Button";
import { Text } from "@/components/core/Text";

export function ButtonCtaCardDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-mid rounded-mid border-token bg-secondary p-mid">
      <div className="flex flex-col gap-xsmall">
        <Text as="p" variant="header-2">
          Launch the project
        </Text>
        <Text as="p" variant="small" className="text-muted">
          Deploy in a minute - no credit card required.
        </Text>
      </div>
      <div className="flex flex-col gap-small">
        <Button variant="primary" className="w-full" leftIcon={<IoRocketOutline aria-hidden />}>
          Create workspace
        </Button>
        <Button variant="ghost" className="w-full text-muted hover:text-primary">
          <span className="inline-flex w-full items-center justify-center gap-xsmall">
            View documentation
            <IoArrowForward aria-hidden />
          </span>
        </Button>
      </div>
    </div>
  );
}

import { IoArrowForward } from "react-icons/io5";

import { Button } from "@/components/core/Button";

export function ButtonAsChildDemo() {
  return (
    <div className="flex flex-wrap items-center gap-mid">
      <Button asChild variant="primary">
        <a href="#docs">Open docs</a>
      </Button>
      <Button asChild variant="outline" icon={<IoArrowForward aria-hidden />} iconPosition="end">
        <a href="#next">Continue</a>
      </Button>
    </div>
  );
}

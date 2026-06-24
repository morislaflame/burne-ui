import { IoAdd } from "react-icons/io5";

import { Button } from "@/components/core/Button";

export function ButtonGlossDemo() {
  return (
    <div className="flex flex-wrap items-center gap-small">
      <Button variant="gloss">Gloss</Button>
      <Button variant="gloss">Click</Button>
      <Button variant="gloss" leftIcon={<IoAdd aria-hidden />}>
        Icon
      </Button>
    </div>
  );
}

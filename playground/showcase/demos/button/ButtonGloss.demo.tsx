import { IoAdd } from "react-icons/io5";

import { Button } from "@/components/core/Button";

export function ButtonGlossDemo() {
  return (
    <div className="flex flex-col gap-large">
      <div className="flex flex-wrap items-center gap-small">
        <Button variant="gloss">Gloss</Button>
        <Button variant="gloss">Click</Button>
        <Button variant="gloss" icon={<IoAdd aria-hidden />}>
          Icon
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-small">
        <Button variant="gloss" ripple>
          Gloss ripple
        </Button>
        <Button variant="gloss" ripple>
          Click
        </Button>
        <Button variant="gloss" ripple icon={<IoAdd aria-hidden />}>
          Icon
        </Button>
        <Button variant="gloss" ripple iconOnly aria-label="Add">
          <IoAdd aria-hidden />
        </Button>
      </div>
    </div>
  );
}

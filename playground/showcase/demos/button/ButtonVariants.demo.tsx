import { IoAdd } from "react-icons/io5";

import { Button } from "@/components/core/Button";

export function ButtonVariantsDemo() {
  return (
    <div className="flex flex-wrap items-center gap-small">
      <Button>Default</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button disabled>Disabled</Button>
      <Button leftIcon={<IoAdd aria-hidden />}>С иконкой</Button>
      <Button iconOnly aria-label="Добавить">
        <IoAdd aria-hidden />
      </Button>
      <Button ripple variant="outline">
        С ripple
      </Button>
    </div>
  );
}

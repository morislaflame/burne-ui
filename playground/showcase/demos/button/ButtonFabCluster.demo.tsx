import { IoAdd } from "react-icons/io5";

import { Button } from "@/components/core/Button";

export function ButtonFabClusterDemo() {
  return (
    <div className="flex items-center gap-small">
      <Button
        variant="primary"
        iconOnly
        aria-label="Создать"
        size="small"
        className="rounded-full shadow-token-lg"
      >
        <IoAdd aria-hidden className="size-4" />
      </Button>
      <Button variant="outline" size="small" className="rounded-full border-dashed px-mid">
        Пригласить
      </Button>
    </div>
  );
}

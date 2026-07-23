import { IoCheckmark } from "react-icons/io5";

import { SelectionThumb } from "@/components/core/SelectionThumb";

export function SelectionThumbClassNamesFullDemo() {
  return (
    <div className="flex items-center gap-2xlarge">
      <SelectionThumb
        active
        size="mid"
        classNames={{
          root: "ring-2 ring-primary/30",
          fill: "bg-info",
        }}
        className="size-8"
      >
        <SelectionThumb.Icon
          size="mid"
          highlighted
          classNames={{
            root: "text-info",
            icon: "opacity-90",
          }}
        >
          <IoCheckmark aria-hidden />
        </SelectionThumb.Icon>
      </SelectionThumb>
    </div>
  );
}

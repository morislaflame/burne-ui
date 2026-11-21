import { Kbd } from "@/components/core/Kbd";

export function KbdClassNamesFullDemo() {
  return (
    <Kbd
      variant="outline"
      classNames={{
        root: "border-info/40 bg-info/5 text-info",
      }}
    >
      /
    </Kbd>
  );
}

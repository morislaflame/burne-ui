import { Link } from "@/components/core/Link";

export function LinkClassNamesFullDemo() {
  return (
    <Link
      href="#"
      showDefaultIcon
      underline
      classNames={{
        root: "gap-small rounded-large border border-primary/25 p-xsmall text-primary",
        text: "font-semibold tracking-wide",
        iconEnd: "icon-slot-large text-warning",
      }}
    >
      Documentation
    </Link>
  );
}

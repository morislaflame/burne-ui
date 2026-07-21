import { Link } from "@/components/core/Link";

export function LinkClassNamesFullDemo() {
  return (
    <Link
      href="#"
      showDefaultIcon
      underline
      classNames={{
        root: "gap-small rounded-mid border border-primary/25 p-xsmall text-primary",
        text: "font-semibold tracking-wide",
        iconEnd: "text-warning",
      }}
    >
      Documentation
    </Link>
  );
}

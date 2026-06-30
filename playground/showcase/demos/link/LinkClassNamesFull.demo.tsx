import { Link } from "@/components/core/Link";

export function LinkClassNamesFullDemo() {
  return (
    <Link
      href="#"
      showDefaultIcon
      underline
      classNames={{
        motion: "rounded-mid border border-primary/25 p-xsmall",
        anchor: "gap-small text-primary",
        text: "font-semibold tracking-wide",
        iconEnd: "text-warning",
      }}
    >
      Документация
    </Link>
  );
}

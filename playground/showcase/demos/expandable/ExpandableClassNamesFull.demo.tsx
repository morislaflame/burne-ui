import { Expandable } from "@/components/core/Expandable";

const infoIcon = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
);

export function ExpandableClassNamesFullDemo() {
  return (
    <Expandable
      defaultOpen
      title="Delivery"
      description="Slots are configured via classNames"
      icon={infoIcon}
      classNames={{
        root: "border border-primary/30",
        trigger: "bg-primary/5",
        title: "text-primary font-semibold",
        description: "text-foreground/75",
        panel: "border-t border-primary/20",
      }}
    >
      <p className="text-small text-muted">
        The address and delivery method can be changed before the order is shipped..
      </p>
    </Expandable>
  );
}

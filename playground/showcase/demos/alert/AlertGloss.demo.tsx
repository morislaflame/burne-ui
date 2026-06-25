import { Alert } from "@/components/core/Alert";

export function AlertGlossDemo() {
  return (
    <div className="flex flex-col gap-mid">
      <Alert
        variant="gloss"
        status="info"
        title="Gloss alert"
        description="Gloss panel with hover-lift."
      />
      <Alert
        variant="gloss"
        status="danger"
        title="Gloss danger"
        description="Status — color of text and icon."
      />
    </div>
  );
}

import { Alert } from "@/components/core/Alert";
import { Button } from "@/components/core/Button";

export function AlertClassNamesFullDemo() {
  return (
    <Alert
      status="info"
      title="Full customization Alert"
      description="All slots are redefined via classNames."
      action={
        <Button size="small" variant="primary" status="info">
          Open
        </Button>
      }
      classNames={{
        root: "rounded-large border-info/50 bg-info/10",
        indicator: "text-info",
        message: "items-start",
        content: "gap-xsmall",
        title: "font-semibold text-info",
        description: "text-foreground/80",
        action: "self-start",
      }}
      className="max-w-lg"
    />
  );
}

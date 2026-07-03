import { Button } from "@/components/core/Button";
import { Toast, useToast } from "@/components/core/Toast";

export function ToastClassNamesFullDemo() {
  const { toast } = useToast();

  return (
    <Button
      onClick={() =>
        toast.show({
          status: "info",
          title: "Full customization Toast",
          description: "Slots root, title, description through classNames.",
          classNames: {
            root: "rounded-large border-info/50 bg-info/10 ring-1 ring-info/20",
            indicator: "text-info",
            title: "font-semibold text-info",
            description: "text-foreground/80",
          },
        })
      }
    >
      Show toast with classNames
    </Button>
  );
}

export function ToastClassNamesCompoundDemo() {
  return (
    <Toast
      status="success"
      classNames={{
        root: "rounded-large border-success/40 bg-success/10",
        title: "font-semibold text-success",
        description: "text-foreground/80",
        close: "text-success",
      }}
      onClose={() => {}}
      title="Compound toast"
      description="classNames on Toast root for declarative API."
    />
  );
}

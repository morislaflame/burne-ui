import { Button } from "@/components/core/Button";
import { useToast } from "@/components/core/Toast";

export function ToastStatusesDemo() {
  const { toast } = useToast();

  return (
    <div className="flex flex-wrap gap-small">
      <Button variant="outline" onClick={() => toast.show({ title: "Saved", status: "success" })}>
        Success
      </Button>
      <Button variant="outline" onClick={() => toast.show({ title: "Network error", status: "danger" })}>
        Danger
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.show({
            title: "Update",
            description: "New version of library available.",
            status: "info",
          })
        }
      >
        Info
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.show({
            title: "Limit coming soon",
            description: "10% of quota left.",
            status: "warning",
          })
        }
      >
        Warning
      </Button>
    </div>
  );
}

import { Button } from "@/components/core/Button";
import { useToast } from "@/components/core/Toast";

export function ToastModificationsDemo() {
  const { toast } = useToast();

  return (
    <div className="flex flex-col gap-mid">
      <div className="flex flex-wrap gap-small">
        <Button
          variant="outline"
          onClick={() =>
            toast.show({
              title: "default",
              description: "Neutral notification without status icon.",
            })
          }
        >
          default
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.show({ title: "Saved", status: "success" })}
        >
          success
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.show({
              title: "Network error",
              description: "Check your connection and try again.",
              status: "danger",
            })
          }
        >
          danger
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
          info
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
          warning
        </Button>
      </div>

      <div className="flex flex-wrap gap-small">
        <Button
          variant="outline"
          onClick={() =>
            toast.show({
              title: "Gloss toast",
              description: "variant gloss — glass surface.",
              status: "info",
              variant: "gloss",
            })
          }
        >
          gloss
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.show({
              title: "Update available",
              description: "Version 2.4.0 is ready for installation.",
              status: "info",
              action: (
                <Button size="small" variant="primary" status="info">
                  Update
                </Button>
              ),
            })
          }
        >
          action
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.show({
              title: "Saving…",
              description: "Wait for the operation to complete.",
              loading: true,
            })
          }
        >
          loading
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.show({
              title: "Constant toast",
              description: "timeout: 0 — without auto-closing.",
              status: "info",
              timeout: 0,
            })
          }
        >
          persistent
        </Button>
      </div>
    </div>
  );
}

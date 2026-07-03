import { Button } from "@/components/core/Button";
import { useToast } from "@/components/core/Toast";

export function ToastPromiseFlowDemo() {
  const { toast } = useToast();

  const simulateSave = () => {
    const promise = new Promise<void>((resolve) => {
      window.setTimeout(resolve, 1400);
    });

    toast.promise(promise, {
      loading: "Saving…",
      success: "Changes saved",
      timeout: 3000,
    });
  };

  return (
    <div className="flex flex-wrap gap-small">
      <Button variant="outline" onClick={simulateSave}>
        Save with progress
      </Button>
      <Button
        variant="ghost"
        onClick={() =>
          toast.show({
            title: "No connection",
            description: "Check your network and try again.",
            status: "danger",
            variant: "gloss",
          })
        }
      >
        Gloss error
      </Button>
    </div>
  );
}

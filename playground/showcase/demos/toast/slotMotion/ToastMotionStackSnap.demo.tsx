import { Button } from "@/components/core/Button";
import { useToast } from "@/components/core/Toast";

export function ToastMotionStackSnapDemo() {
  const { toast } = useToast();

  return (
    <Button
      variant="outline"
      type="button"
      onClick={() => {
        toast.show({
          title: "Stack snap",
          description: "stackItem change is off — the peek jumps.",
          timeout: 5000,
          motion: { stackItem: { enter: false, change: false } },
        });
        toast.show({
          title: "Front card",
          timeout: 5000,
          motion: { stackItem: { enter: false, change: false } },
        });
      }}
    >
      Stack snap
    </Button>
  );
}

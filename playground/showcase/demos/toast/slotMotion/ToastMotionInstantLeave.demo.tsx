import { Button } from "@/components/core/Button";
import { useToast } from "@/components/core/Toast";

export function ToastMotionInstantLeaveDemo() {
  const { toast } = useToast();

  return (
    <Button
      variant="outline"
      type="button"
      onClick={() =>
        toast.show({
          title: "Instant leave",
          description: "root.enter/leave: false — host snaps closed.",
          timeout: 4000,
          motion: { root: { enter: false, leave: false } },
        })
      }
    >
      Instant leave
    </Button>
  );
}

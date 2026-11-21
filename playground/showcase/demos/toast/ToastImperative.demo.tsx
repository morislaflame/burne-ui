import { Button } from "@/components/core/Button";
import { toast } from "@/components/core/Toast";

export function ToastImperativeDemo() {
  return (
    <Button
      variant="outline"
      onClick={() =>
        toast.show({
          title: "Saved",
          description: "Called without useToast. The mounted provider receives it.",
        })
      }
    >
      toast.show
    </Button>
  );
}

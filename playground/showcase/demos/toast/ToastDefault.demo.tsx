import { Button } from "@/components/core/Button";
import { useToast } from "@/components/core/Toast";

export function ToastDefaultDemo() {
  const { toast } = useToast();

  return (
    <Button
      variant="outline"
      onClick={() =>
        toast.show({
          title: "Changes saved",
          description: "Profile settings have been updated.",
        })
      }
    >
      Show toast
    </Button>
  );
}

import { Button } from "@/components/core/Button";
import { useToast } from "@/components/core/Toast";

export function ToastGlossDemo() {
  const { toast } = useToast();

  return (
    <Button
      variant="gloss"
      onClick={() =>
        toast.show({
          title: "Gloss toast",
          description: "Glass notice with hover-lift.",
          status: "info",
          variant: "gloss",
        })
      }
    >
      Gloss Toast
    </Button>
  );
}

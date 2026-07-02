import { Button } from "@/components/core/Button";
import { useToast, type ToastSize } from "@/components/core/Toast";

const SIZES: ToastSize[] = ["small", "base", "mid", "large"];

export function ToastSizesDemo() {
  const { toast } = useToast();

  return (
    <div className="flex flex-wrap items-center gap-mid">
      {SIZES.map((size) => (
        <Button
          key={size}
          variant="outline"
          type="button"
          onClick={() =>
            toast.show({
              status: "info",
              size,
              title: `size=${size}`,
              description: "Padding, иконка, типографика и ширина viewport.",
            })
          }
        >
          {size}
        </Button>
      ))}
    </div>
  );
}

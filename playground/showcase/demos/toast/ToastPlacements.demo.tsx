import { Button } from "@/components/core/Button";
import { useToast, type ToastPlacement } from "@/components/core/Toast";

const PLACEMENTS: ToastPlacement[] = [
  "top-left",
  "top-center",
  "top-right",
  "bottom-left",
  "bottom-center",
  "bottom-right",
];

export function ToastPlacementsDemo() {
  const { toast } = useToast();

  return (
    <div className="grid grid-cols-2 gap-small sm:grid-cols-3">
      {PLACEMENTS.map((placement) => (
        <Button
          key={placement}
          variant="outline"
          type="button"
          onClick={() =>
            toast.show({
              status: "info",
              title: placement,
              description: "Notification in selected corner of the screen",
              placement,
            })
          }
        >
          {placement}
        </Button>
      ))}
    </div>
  );
}

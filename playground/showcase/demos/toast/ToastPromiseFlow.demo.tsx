import { Button } from "@/components/core/Button";
import { useToast } from "@/components/core/Toast";

export function ToastPromiseFlowDemo() {
  const { toast } = useToast();

  const simulateSave = () => {
    const promise = new Promise<void>((resolve) => {
      window.setTimeout(resolve, 1400);
    });

    toast.promise(promise, {
      loading: "Сохранение…",
      success: "Изменения сохранены",
      timeout: 3000,
    });
  };

  return (
    <div className="flex flex-wrap gap-small">
      <Button variant="outline" onClick={simulateSave}>
        Сохранить с прогрессом
      </Button>
      <Button
        variant="ghost"
        onClick={() =>
          toast.show({
            title: "Нет соединения",
            description: "Проверьте сеть и повторите.",
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

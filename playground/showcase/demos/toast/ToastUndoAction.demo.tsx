import { Button } from "@/components/core/Button";
import { useToast } from "@/components/core/Toast";

export function ToastUndoActionDemo() {
  const { toast } = useToast();

  return (
    <Button
      variant="outline"
      onClick={() =>
        toast.show({
          title: "Элемент удалён",
          description: "Файл «draft-v3.sketch» перемещён в корзину.",
          status: "default",
          action: (
            <Button
              variant="ghost"
              size="small"
              className="h-7 px-small text-primary"
              onClick={() => toast.show({ title: "Отменено", status: "info" })}
            >
              Отменить
            </Button>
          ),
        })
      }
    >
      Удалить с undo
    </Button>
  );
}

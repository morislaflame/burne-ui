import { Button } from "@/components/core/Button";
import { useToast, useToastContext } from "@/components/core/Toast";

export function ToastUndoActionDemo() {
  const { toast } = useToast();
  const { update } = useToastContext();

  return (
    <Button
      variant="outline"
      onClick={() => {
        const undoToastId = toast.show({
          title: "Элемент удалён",
          description: "Файл «draft-v3.sketch» перемещён в корзину.",
          status: "default",
          action: (
            <Button
              variant="ghost"
              size="small"
              className="h-7 px-small text-primary"
              onClick={() => {
                update(undoToastId, {
                  status: "info",
                  title: "Отменено",
                  description: "Файл «draft-v3.sketch» восстановлен.",
                  action: undefined,
                });
              }}
            >
              Отменить
            </Button>
          ),
        });
      }}
    >
      Удалить с undo
    </Button>
  );
}

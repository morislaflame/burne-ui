import { Button } from "@/components/core/Button";
import { useToast } from "@/components/core/Toast";

export function ToastStatusesDemo() {
  const { toast } = useToast();

  return (
    <div className="flex flex-wrap gap-small">
      <Button variant="outline" onClick={() => toast.show({ title: "Сохранено", status: "success" })}>
        Success
      </Button>
      <Button variant="outline" onClick={() => toast.show({ title: "Ошибка сети", status: "danger" })}>
        Danger
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.show({
            title: "Обновление",
            description: "Доступна новая версия библиотеки.",
            status: "info",
          })
        }
      >
        Info
      </Button>
      <Button
        variant="outline"
        onClick={() =>
          toast.show({
            title: "Лимит скоро",
            description: "Осталось 10% квоты.",
            status: "warning",
          })
        }
      >
        Warning
      </Button>
    </div>
  );
}

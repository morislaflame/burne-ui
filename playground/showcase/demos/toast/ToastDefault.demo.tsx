import { Button } from "@/components/core/Button";
import { useToast } from "@/components/core/Toast";

export function ToastDefaultDemo() {
  const { toast } = useToast();

  return (
    <Button
      variant="outline"
      onClick={() =>
        toast.show({
          title: "Изменения сохранены",
          description: "Настройки профиля обновлены.",
        })
      }
    >
      Показать toast
    </Button>
  );
}

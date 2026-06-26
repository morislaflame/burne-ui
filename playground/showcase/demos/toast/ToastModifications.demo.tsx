import { Button } from "@/components/core/Button";
import { useToast } from "@/components/core/Toast";

export function ToastModificationsDemo() {
  const { toast } = useToast();

  return (
    <div className="flex flex-col gap-mid">
      <div className="flex flex-wrap gap-small">
        <Button
          variant="outline"
          onClick={() =>
            toast.show({
              title: "default",
              description: "Нейтральное уведомление без иконки статуса.",
            })
          }
        >
          default
        </Button>
        <Button
          variant="outline"
          onClick={() => toast.show({ title: "Сохранено", status: "success" })}
        >
          success
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.show({
              title: "Ошибка сети",
              description: "Проверьте подключение и повторите попытку.",
              status: "danger",
            })
          }
        >
          danger
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
          info
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
          warning
        </Button>
      </div>

      <div className="flex flex-wrap gap-small">
        <Button
          variant="outline"
          onClick={() =>
            toast.show({
              title: "Gloss toast",
              description: "variant gloss — стеклянная поверхность.",
              status: "info",
              variant: "gloss",
            })
          }
        >
          gloss
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.show({
              title: "Доступно обновление",
              description: "Версия 2.4.0 готова к установке.",
              status: "info",
              action: (
                <Button size="small" variant="primary" status="info">
                  Обновить
                </Button>
              ),
            })
          }
        >
          action
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.show({
              title: "Сохранение…",
              description: "Дождитесь завершения операции.",
              isLoading: true,
            })
          }
        >
          loading
        </Button>
        <Button
          variant="outline"
          onClick={() =>
            toast.show({
              title: "Постоянный тост",
              description: "timeout: 0 — без автозакрытия.",
              status: "info",
              timeout: 0,
            })
          }
        >
          persistent
        </Button>
      </div>
    </div>
  );
}

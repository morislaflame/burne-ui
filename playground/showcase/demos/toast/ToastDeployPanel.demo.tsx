import { Button } from "@/components/core/Button";
import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";
import { useToast } from "@/components/core/Toast";

export function ToastDeployPanelDemo() {
  const { toast } = useToast();

  return (
    <Surface variant="secondary" padding="mid" className="flex w-full max-w-sm flex-col gap-mid">
      <div>
        <Text as="p" variant="base" className="font-medium">
          Production deploy
        </Text>
        <Text as="p" variant="small" className="text-muted">
          burne-ui@1.2.0 → edge
        </Text>
      </div>
      <Button
        variant="primary"
        className="w-full"
        onClick={() =>
          toast.show({
            title: "Деплой запущен",
            description: "Сборка займёт около 2 минут.",
            status: "info",
          })
        }
      >
        Задеплоить
      </Button>
    </Surface>
  );
}

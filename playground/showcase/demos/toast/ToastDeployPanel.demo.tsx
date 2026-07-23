import { Button } from "@/components/core/Button";
import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";
import { useToast } from "@/components/core/Toast";

export function ToastDeployPanelDemo() {
  const { toast } = useToast();

  return (
    <Surface variant="secondary" padding="large" className="flex w-full max-w-sm flex-col gap-large">
      <div className="flex flex-col gap-small">
        <Text as="p" variant="base" className="font-medium">
          Production deploy
        </Text>
        <Text as="p" variant="small" className="text-muted">
          Deploy your app to the cloud in 2 minutes
        </Text>
      </div>
      <Button
        variant="primary"
        className="w-full"
        onClick={() =>
          toast.show({
            title: "Production deploy started",
            description: "Your app will be available in 2 minutes",
          })
        }
      >
        Deploy
      </Button>
    </Surface>
  );
}

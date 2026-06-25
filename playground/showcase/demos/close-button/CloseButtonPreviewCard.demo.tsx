import { CloseButton } from "@/components/core/CloseButton";
import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";
import { PIN_IMAGE2 } from "@/utils/mockImages";

export function CloseButtonPreviewCardDemo() {
  return (
    <div className="relative w-full max-w-xs overflow-hidden rounded-mid">
      <div
        className="h-36 w-full bg-cover bg-center"
        style={{ backgroundImage: `url(${PIN_IMAGE2})` }}
      />
      <CloseButton
        aria-label="Закрыть превью"
        size="small"
        className="absolute right-small top-small shadow-token-md"
      />
      <Surface variant="default" padding="base" className="rounded-none rounded-b-mid">
        <Text as="p" variant="base">
          Preview Card
        </Text>
      </Surface>
    </div>
  );
}

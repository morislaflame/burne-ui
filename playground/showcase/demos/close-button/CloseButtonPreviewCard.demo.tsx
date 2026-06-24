import { CloseButton } from "@/components/core/CloseButton";
import { Surface } from "@/components/core/Surface";
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
        variant="gloss"
        size="small"
        className="absolute right-small top-small shadow-token-md"
      />
      <Surface variant="secondary" padding="small" className="rounded-none rounded-b-mid">
        Превью макета
      </Surface>
    </div>
  );
}

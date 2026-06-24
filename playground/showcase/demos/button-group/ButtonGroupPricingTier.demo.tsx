import { ButtonGroup } from "@/components/composite/ButtonGroup";
import { Button } from "@/components/core/Button";
import { Text } from "@/components/core/Text";

export function ButtonGroupPricingTierDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-small">
      <Text as="p" variant="small" className="text-muted">
        Тариф
      </Text>
      <ButtonGroup aria-label="Выбор тарифа" className="rounded-mid bg-tertiary p-xsmall">
        <Button
          variant="ghost"
          className="flex-1"
          groupSegment={{ orientation: "horizontal", position: "first" }}
        >
          Free
        </Button>
        <Button
          variant="primary"
          className="flex-1"
          groupSegment={{ orientation: "horizontal", position: "middle" }}
        >
          Pro
        </Button>
        <Button
          variant="ghost"
          className="flex-1"
          groupSegment={{ orientation: "horizontal", position: "last" }}
        >
          Team
        </Button>
      </ButtonGroup>
    </div>
  );
}

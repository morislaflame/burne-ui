import { ButtonGroup } from "@/components/composite/ButtonGroup";
import { Button } from "@/components/core/Button";
import { Label } from "@/components/core/Label/Label";

export function ButtonGroupPricingTierDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-small">
      <Label>Pricing Tier</Label>
      <ButtonGroup aria-label="Выбор тарифа" segmented buttonSize="small" className="rounded-mid bg-tertiary p-small">
        <Button variant="outline" className="flex-1">
          Free
        </Button>
        <Button variant="outline" className="flex-1">
          Pro
        </Button>
        <Button variant="outline" className="flex-1">
          Team
        </Button>
      </ButtonGroup>
    </div>
  );
}

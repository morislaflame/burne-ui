import { ButtonGroup } from "@/components/composite/ButtonGroup";
import { Button } from "@/components/core/Button";
import { Label } from "@/components/core/Label/Label";
import { useState } from "react";

export function ButtonGroupPricingTierDemo() {
  const [selectedTier, setSelectedTier] = useState<"free" | "pro" | "team">("free");

  const isSelected = (tier: "free" | "pro" | "team") => selectedTier === tier;

  return (
    <div className="flex w-full max-w-md flex-col gap-small">
      <Label>Pricing Tier</Label>
      <ButtonGroup aria-label="Выбор тарифа" segmented buttonSize="small" className="rounded-mid bg-surface p-small">
        <Button 
          variant={isSelected("free") ? "primary" : "outline"} 
          className="flex-1" 
          onClick={() => setSelectedTier("free")}
        >
          Free
        </Button>
        <Button 
          variant={isSelected("pro") ? "primary" : "outline"} 
          className="flex-1" 
          onClick={() => setSelectedTier("pro")}
        >
          Pro
        </Button>
        <Button 
          variant={isSelected("team") ? "primary" : "outline"} 
          className="flex-1" 
          onClick={() => setSelectedTier("team")}
        >
          Team
        </Button>
      </ButtonGroup>
    </div>
  );
}

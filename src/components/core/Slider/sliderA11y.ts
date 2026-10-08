import { joinFieldDescribedBy } from "@/components/core/Field/fieldA11y";
import { DEFAULT_BURNE_LABELS, type BurneLabels } from "@/theme/burneLabels";
 
export function sliderLabelId(sliderId: string): string {
  return `${sliderId}-label`;
}
 
export function resolveSliderThumbA11y({
  kind,
  explicitLabel,
  labelConnected,
  labelId,
  hintConnected,
  hintId,
  errorConnected,
  errorId,
  labels,
}: {
  kind: "single" | "start" | "end";
  explicitLabel?: string;
  labelConnected: boolean;
  labelId?: string;
  hintConnected: boolean;
  hintId: string;
  errorConnected: boolean;
  errorId: string;
  labels?: Pick<BurneLabels, "sliderMinimum" | "sliderMaximum" | "sliderValue">;
}): {
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
} {
  const names = labels ?? DEFAULT_BURNE_LABELS;
  const ariaDescribedBy = joinFieldDescribedBy(
    hintConnected ? hintId : undefined,
    errorConnected ? errorId : undefined,
  );
 
  if (explicitLabel) {
    if (kind === "start") {
      return {
        ariaLabel: `${explicitLabel}, minimum`,
        ariaLabelledBy: undefined,
        ariaDescribedBy,
      };
    }
    if (kind === "end") {
      return {
        ariaLabel: `${explicitLabel}, maximum`,
        ariaLabelledBy: undefined,
        ariaDescribedBy,
      };
    }
    return {
      ariaLabel: explicitLabel,
      ariaLabelledBy: undefined,
      ariaDescribedBy,
    };
  }
 
  if (kind === "start") {
    return {
      ariaLabel: names.sliderMinimum,
      ariaLabelledBy: undefined,
      ariaDescribedBy,
    };
  }
 
  if (kind === "end") {
    return {
      ariaLabel: names.sliderMaximum,
      ariaLabelledBy: undefined,
      ariaDescribedBy,
    };
  }
 
  if (labelConnected && labelId) {
    return {
      ariaLabel: undefined,
      ariaLabelledBy: labelId,
      ariaDescribedBy,
    };
  }
 
  return {
    ariaLabel: explicitLabel ?? names.sliderValue,
    ariaLabelledBy: undefined,
    ariaDescribedBy,
  };
}
 
import { joinFieldDescribedBy } from "@/components/core/Field/fieldA11y";

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
}: {
  kind: "single" | "start" | "end";
  explicitLabel?: string;
  labelConnected: boolean;
  labelId?: string;
  hintConnected: boolean;
  hintId: string;
  errorConnected: boolean;
  errorId: string;
}): {
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
} {
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
      ariaLabel: "Minimum range",
      ariaLabelledBy: undefined,
      ariaDescribedBy,
    };
  }

  if (kind === "end") {
    return {
      ariaLabel: "Maximum range",
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
    ariaLabel: explicitLabel ?? "Value",
    ariaLabelledBy: undefined,
    ariaDescribedBy,
  };
}

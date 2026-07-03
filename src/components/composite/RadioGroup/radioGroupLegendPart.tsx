import {
  OptionGroupHeader,
  OptionGroupLegend,
} from "@/components/composite/utils/optionGroupFieldset";

import type { RadioGroupLegendProps } from "./radioGroupTypes";

export function RadioGroupLegend({ children, ...rest }: RadioGroupLegendProps) {
  return (
    <OptionGroupLegend {...rest}>
      <OptionGroupHeader>{children}</OptionGroupHeader>
    </OptionGroupLegend>
  );
}

RadioGroupLegend.displayName = "RadioGroup.Legend";

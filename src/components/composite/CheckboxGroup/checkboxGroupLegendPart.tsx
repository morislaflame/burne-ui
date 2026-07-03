import {
  OptionGroupHeader,
  OptionGroupLegend,
} from "@/components/composite/utils/optionGroupFieldset";

import type { CheckboxGroupLegendProps } from "./checkboxGroupTypes";

export function CheckboxGroupLegend({ children, ...rest }: CheckboxGroupLegendProps) {
  return (
    <OptionGroupLegend {...rest}>
      <OptionGroupHeader>{children}</OptionGroupHeader>
    </OptionGroupLegend>
  );
}

CheckboxGroupLegend.displayName = "CheckboxGroup.Legend";

import { OptionGroupHint } from "@/components/composite/utils/optionGroupFieldset";

import { useCheckboxGroupContext } from "./checkboxGroupContext";
import type { CheckboxGroupHintProps } from "./checkboxGroupTypes";

export function CheckboxGroupHint({ id, ...rest }: CheckboxGroupHintProps) {
  const { hintId } = useCheckboxGroupContext();
  return <OptionGroupHint id={id ?? hintId} {...rest} />;
}

CheckboxGroupHint.displayName = "CheckboxGroup.Hint";

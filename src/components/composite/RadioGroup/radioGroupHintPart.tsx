import { OptionGroupHint } from "@/components/composite/utils/optionGroupFieldset";

import { useRadioGroupContext } from "./radioGroupContext";
import type { RadioGroupHintProps } from "./radioGroupTypes";

export function RadioGroupHint({ id, ...rest }: RadioGroupHintProps) {
  const { hintId } = useRadioGroupContext();
  return <OptionGroupHint id={id ?? hintId} {...rest} />;
}

RadioGroupHint.displayName = "RadioGroup.Hint";

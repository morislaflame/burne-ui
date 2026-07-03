import { forwardRef } from "react";

import { OptionGroupList } from "@/components/composite/utils/optionGroupFieldset";

import type { RadioGroupListProps } from "./radioGroupTypes";

export const RadioGroupList = forwardRef<HTMLDivElement, RadioGroupListProps>(
  function RadioGroupList(props, ref) {
    return <OptionGroupList ref={ref} {...props} />;
  },
);

RadioGroupList.displayName = "RadioGroup.List";

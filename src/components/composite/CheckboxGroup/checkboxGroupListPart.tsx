import { forwardRef } from "react";

import { OptionGroupList } from "@/components/composite/utils/optionGroupFieldset";

import type { CheckboxGroupListProps } from "./checkboxGroupTypes";

export const CheckboxGroupList = forwardRef<HTMLDivElement, CheckboxGroupListProps>(
  function CheckboxGroupList(props, ref) {
    return <OptionGroupList ref={ref} {...props} />;
  },
);

CheckboxGroupList.displayName = "CheckboxGroup.List";

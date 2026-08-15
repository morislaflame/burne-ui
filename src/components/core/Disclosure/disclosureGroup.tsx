import { forwardRef } from "react";

import { DisclosureClassNamesProvider, DisclosureGroupProvider } from "./disclosureContext";
import { disclosureGroupClass } from "./disclosureStyles";
import type { DisclosureGroupProps } from "./disclosureTypes";
import { useDisclosureGroupRootState } from "./useDisclosureGroupRootState";

export const DisclosureGroup = forwardRef<HTMLDivElement, DisclosureGroupProps>(
  function DisclosureGroup(
    {
      children,
      accordion,
      separated,
      variant,
      size,
      value,
      defaultValue,
      onValueChange,
      className,
      classNames,
      motion,
      ...rest
    },
    ref,
  ) {
    const state = useDisclosureGroupRootState({
      accordion,
      separated,
      variant,
      size,
      value,
      defaultValue,
      onValueChange,
      motion,
    });

    return (
      <DisclosureGroupProvider value={state.contextValue}>
        <DisclosureClassNamesProvider classNames={classNames}>
          <div
            ref={ref}
            className={disclosureGroupClass({
              separated: state.separated,
              variant: state.variant,
              className,
              slotClass: classNames?.group,
            })}
            {...rest}
          >
            {children}
          </div>
        </DisclosureClassNamesProvider>
      </DisclosureGroupProvider>
    );
  },
);

DisclosureGroup.displayName = "DisclosureGroup";

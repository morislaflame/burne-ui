import { forwardRef } from "react";

import {
  DisclosureClassNamesProvider,
  DisclosureProvider,
} from "./disclosureContext";
import { disclosureRootClass } from "./disclosureStyles";
import {
  DisclosureContent,
  DisclosureHandleInner,
  DisclosureTrigger,
} from "./disclosureParts";
import type { DisclosureProps } from "./disclosureTypes";
import { useDisclosureRootState } from "./useDisclosureRootState";

export type {
  DisclosureProps,
  DisclosureGroupProps,
  DisclosureTriggerProps,
  DisclosureHandleProps,
  DisclosureContentProps,
  DisclosureVariant,
  DisclosureSize,
  DisclosureIconPos,
  DisclosureClassNames,
} from "./disclosureTypes";

export const DisclosureRoot = forwardRef<HTMLDivElement, DisclosureProps>(
  function DisclosureRoot(
    {
      children,
      className,
      classNames,
      open,
      defaultOpen,
      onOpenChange,
      value,
      variant,
      size,
      disabled,
      iconPosition,
      dragHandle,
      ...rest
    },
    ref,
  ) {
    const state = useDisclosureRootState({
      children,
      open,
      defaultOpen,
      onOpenChange,
      value,
      variant,
      size,
      disabled,
      iconPosition,
      dragHandle,
    });

    return (
      <DisclosureProvider value={state.contextValue}>
        <DisclosureClassNamesProvider classNames={classNames}>
          <div
            ref={ref}
            className={disclosureRootClass({
              variant: state.variant,
              groupedCardShell: state.groupedCardShell,
              className,
              slotClass: classNames?.root,
            })}
            {...rest}
          >
            {state.orderedChildren}
          </div>
        </DisclosureClassNamesProvider>
      </DisclosureProvider>
    );
  },
);

DisclosureRoot.displayName = "Disclosure";

export {
  DisclosureTrigger,
  DisclosureHandleInner,
  DisclosureContent,
};

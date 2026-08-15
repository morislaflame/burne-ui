import { forwardRef, useMemo } from "react";

import { mergeMotionSlotMaps } from "@/components/core/utils/slotMotion";

import { resolveDisclosureMotionDefaults } from "./disclosureAnimations";
import {
  DisclosureClassNamesProvider,
  DisclosureMotionProvider,
  DisclosureProvider,
  useDisclosureGroupContext,
} from "./disclosureContext";
import { disclosureRootClass } from "./disclosureStyles";
import {
  DisclosureContent,
  DisclosureHandleInner,
  DisclosureTrigger,
  DisclosureIcon,
  DisclosureChevron,
} from "./disclosureParts";
import type { DisclosureProps } from "./disclosureTypes";
import { useDisclosureRootState } from "./useDisclosureRootState";

export type {
  DisclosureProps,
  DisclosureGroupProps,
  DisclosureTriggerProps,
  DisclosureHandleProps,
  DisclosureContentProps,
  DisclosureIconProps,
  DisclosureChevronProps,
  DisclosureVariant,
  DisclosureSize,
  DisclosureChevronPos,
  DisclosureClassNames,
  DisclosureMotion,
  DisclosureLifecycleMotion,
  DisclosureTitleLiftMotion,
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
      chevronPosition,
      dragHandle,
      motion,
      ...rest
    },
    ref,
  ) {
    const groupCtx = useDisclosureGroupContext();
    const state = useDisclosureRootState({
      children,
      open,
      defaultOpen,
      onOpenChange,
      value,
      variant,
      size,
      disabled,
      chevronPosition,
      dragHandle,
    });

    const mergedMotion = useMemo(
      () => mergeMotionSlotMaps(groupCtx?.motion, motion),
      [groupCtx?.motion, motion],
    );
    const defaults = useMemo(
      () => resolveDisclosureMotionDefaults(state.variant),
      [state.variant],
    );

    return (
      <DisclosureProvider value={state.contextValue}>
        <DisclosureClassNamesProvider classNames={classNames}>
          <DisclosureMotionProvider motion={mergedMotion} defaults={defaults}>
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
          </DisclosureMotionProvider>
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
  DisclosureIcon,
  DisclosureChevron,
};

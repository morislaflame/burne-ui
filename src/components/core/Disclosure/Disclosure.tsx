import { forwardRef, useMemo, useRef } from "react";
 
import { dataVariantProps } from "@/components/core/utils/dataContract";
import { mergeRefs } from "@/components/core/utils/mergeRefs";
import { mergeMotionSlotMaps } from "@/components/core/utils/slotMotion";
import { useFirstLevelHoverShadow } from "@/components/core/utils/useShadowMotion";
import { cn } from "@/utils/cn";
import { useSkinRegistryRevision } from "@/skins/skinContext";
 
import { resolveDisclosureMotionDefaults } from "./disclosureAnimations";
import {
  DisclosureClassNamesProvider,
  DisclosureMotionProvider,
  DisclosureProvider,
  useDisclosureGroupContext,
} from "./disclosureContext";
import { DISCLOSURE_CARD_CLIP_CLASS, disclosureRootClass } from "./disclosureStyles";
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
      motionController,
      motionState,
      motionPayload,
      playInitialState,
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
    const skinRevision = useSkinRegistryRevision();
    const defaults = useMemo(() => {
      void skinRevision;
      return resolveDisclosureMotionDefaults(state.variant);
    }, [skinRevision, state.variant]);
    const rootRef = useRef<HTMLDivElement>(null);
    const elevationCard = state.variant === "card" && !state.groupedCardShell;
    const shadow = useFirstLevelHoverShadow(rootRef, elevationCard);
    const { onPointerOver, onPointerOut, ...domRest } = rest;
 
    return (
      <DisclosureProvider value={state.contextValue}>
        <DisclosureClassNamesProvider classNames={classNames}>
          <DisclosureMotionProvider motion={mergedMotion} defaults={defaults} controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}>
          <div
            ref={mergeRefs(rootRef, ref)}
            className={cn(
              disclosureRootClass({
                variant: state.variant,
                groupedCardShell: state.groupedCardShell,
                className,
                slotClass: classNames?.root,
              }),
              shadow.motionClass,
            )}
            {...domRest}
            onPointerOver={(event) => {
              onPointerOver?.(event);
              shadow.onPointerOver(event);
            }}
            onPointerOut={(event) => {
              onPointerOut?.(event);
              shadow.onPointerOut(event);
            }}
            {...dataVariantProps({
              size: state.contextValue.size,
              variant: state.variant,
            })}
          >
            {elevationCard ? (
              <div className={DISCLOSURE_CARD_CLIP_CLASS}>{state.orderedChildren}</div>
            ) : (
              state.orderedChildren
            )}
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
 
 
import { forwardRef, useMemo, type HTMLAttributes } from "react";

import { useSkinRegistryRevision, useSkinVariant } from "@/skins/skinContext";
 
import { dataVariantProps } from "@/components/core/utils/dataContract";
import { useMotionPart } from "@/components/core/utils/slotMotion";
import { mergeRefs } from "@/components/core/utils/mergeRefs";
 
import { selectionIndicatorDecorativeProps } from "./selectionIndicatorA11y";
import {
  SelectionIndicatorMotionProvider,
  SelectionIndicatorProvider,
  useOptionalSelectionIndicatorMotionScope,
} from "./selectionIndicatorContext";
import {
  resolveSelectionIndicatorMotionDefaults,
  SelectionIndicatorMotionSync,
} from "./selectionIndicatorAnimations";
import { SelectionIndicatorFill, SelectionIndicatorMark } from "./selectionIndicatorParts";
import type { SelectionIndicatorCheckMotion, SelectionIndicatorProps } from "./selectionIndicatorTypes";
import { useSelectionIndicatorRootState } from "./useSelectionIndicatorRootState";
 
const SelectionIndicatorRootSlot = forwardRef<
  HTMLSpanElement,
  HTMLAttributes<HTMLSpanElement> & { motion?: SelectionIndicatorCheckMotion }
>(function SelectionIndicatorRootSlot({ className, motion, children, ...rest }, ref) {
  const { setRef } = useMotionPart<HTMLSpanElement>({
    scope: useOptionalSelectionIndicatorMotionScope(),
    slot: "root",
    motion,
  });
  return (
    <span
      ref={mergeRefs(setRef, ref)}
      className={className}
      {...selectionIndicatorDecorativeProps()}
      {...rest}
    >
      {children}
    </span>
  );
});
 
export const SelectionIndicator = forwardRef<HTMLSpanElement, SelectionIndicatorProps>(
  function SelectionIndicator({
  size = "base",
  variant,
  selected,
  indeterminate = false,
  check = false,
  dot = false,
  icon,
  children,
  className,
  classNames,
  motion,
  motionController,
  motionState,
  motionPayload,
  playInitialState,
  ...rest
}, ref) {
  const { shellClassName, contextValue, usesCompound, fillSlot, markSlot, hasMark, markContent, showsFill, state } =
    useSelectionIndicatorRootState({
      size,
      variant,
      selected,
      indeterminate,
      check,
      dot,
      icon,
      children,
      className,
      classNames,
    });
 
  const skinVariant = useSkinVariant(variant);
  const skinRevision = useSkinRegistryRevision();
  const motionDefaults = useMemo(() => {
    void skinRevision;
    return resolveSelectionIndicatorMotionDefaults(skinVariant);
  }, [skinRevision, skinVariant]);

  const body = usesCompound ? (
    <>
      {showsFill ? (fillSlot ?? <SelectionIndicatorFill />) : null}
      {hasMark ? (markSlot ?? <SelectionIndicatorMark />) : null}
    </>
  ) : (
    <>
      {showsFill ? <SelectionIndicatorFill /> : null}
      {hasMark ? <SelectionIndicatorMark>{markContent}</SelectionIndicatorMark> : null}
    </>
  );
 
  return (
    <SelectionIndicatorProvider value={contextValue}>
      <SelectionIndicatorMotionProvider motion={motion} defaults={motionDefaults} controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}>
        <SelectionIndicatorRootSlot
          ref={ref}
          className={shellClassName}
          motion={motion?.root}
          {...rest}
          {...dataVariantProps({ size, variant: skinVariant })}
          data-selected={selected ? "true" : undefined}
          data-state={state}
        >
          {body}
        </SelectionIndicatorRootSlot>
        <SelectionIndicatorMotionSync
          selected={selected}
          showsFill={showsFill}
          hasMark={hasMark}
        />
      </SelectionIndicatorMotionProvider>
    </SelectionIndicatorProvider>
  );
});
 
SelectionIndicator.displayName = "SelectionIndicator";

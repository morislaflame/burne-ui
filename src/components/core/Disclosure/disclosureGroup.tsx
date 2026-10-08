import { forwardRef, useRef } from "react";
 
import { mergeRefs } from "@/components/core/utils/mergeRefs";
import { useFirstLevelHoverShadow } from "@/components/core/utils/useShadowMotion";
import { cn } from "@/utils/cn";

import { DisclosureClassNamesProvider, DisclosureGroupProvider } from "./disclosureContext";
import { DISCLOSURE_GROUP_CARD_CLIP_CLASS, disclosureGroupClass } from "./disclosureStyles";
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
    const rootRef = useRef<HTMLDivElement>(null);
    const elevationCard = !state.separated && state.variant === "card";
    const shadow = useFirstLevelHoverShadow(rootRef, elevationCard);
    const { onPointerOver, onPointerOut, ...domRest } = rest;
 
    return (
      <DisclosureGroupProvider value={state.contextValue}>
        <DisclosureClassNamesProvider classNames={classNames}>
          <div
            ref={mergeRefs(rootRef, ref)}
            className={cn(
              disclosureGroupClass({
                separated: state.separated,
                variant: state.variant,
                className,
                slotClass: classNames?.group,
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
          >
            {elevationCard ? (
              <div className={DISCLOSURE_GROUP_CARD_CLIP_CLASS}>{children}</div>
            ) : (
              children
            )}
          </div>
        </DisclosureClassNamesProvider>
      </DisclosureGroupProvider>
    );
  },
);
 
DisclosureGroup.displayName = "DisclosureGroup";
 
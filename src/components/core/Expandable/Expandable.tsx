import { forwardRef, useMemo, type ForwardedRef, type HTMLAttributes } from "react";

import { dataExpandedState, dataVariantProps } from "@/components/core/utils/dataContract";
import { useMotionPart, useOptionalEnterOnMount } from "@/components/core/utils/slotMotion";
import { useFirstLevelHoverShadow } from "@/components/core/utils/useShadowMotion";
import { isKitVariant } from "@/skins/resolveVariantVisual";
import { cn } from "@/utils/cn";
import { mergeSkinSurfaceStyle, useSkinRegistryRevision, useSkinSurfaceStyle } from "@/skins/skinContext";

import { ExpandableClassNamesProvider, ExpandableMotionProvider, ExpandableProvider, useExpandable, useExpandableMotionScope } from "./expandableContext";
import { resolveExpandableMotionDefaults } from "./expandableAnimations";
import { ExpandableChevron, ExpandableContent, ExpandableDescription, ExpandableIcon, ExpandableMessage, ExpandablePanel, ExpandableSimpleBody, ExpandableTitle, ExpandableTrigger } from "./expandableParts";
import { expandableRootClass } from "./expandableStyles";
import { KIT_EXPANDABLE_VARIANTS, type ExpandableProps } from "./expandableTypes";
import { useExpandableRootState } from "./useExpandableRootState";

export type {
  ExpandableProps,
  ExpandableTriggerProps,
  ExpandableMessageProps,
  ExpandableIconProps,
  ExpandableContentProps,
  ExpandableTitleProps,
  ExpandableDescriptionProps,
  ExpandableChevronProps,
  ExpandablePanelProps,
  ExpandableSize,
  ExpandableVariant,
  ExpandableClassNames,
  ExpandableMotion,
  ExpandableLifecycleMotion,
  ExpandableTriggerLiftMotion,
} from "./expandableTypes";

export { useExpandableContext } from "./expandableContext";

export const ExpandableRoot = forwardRef<HTMLDivElement, ExpandableProps>(
  function ExpandableRoot(
    {
      children,
      compound: compoundProp,
      title,
      description,
      icon,
      variant,
      size = "base",
      defaultOpen = false,
      open: openProp,
      onOpenChange,
      disabled = false,
      className,
      classNames,
      motion,
      motionController,
      motionState,
      motionPayload,
      playInitialState,
      ...rest
    },
    ref,
  ) {
    const state = useExpandableRootState({
      children,
      compound: compoundProp,
      defaultOpen,
      open: openProp,
      onOpenChange,
      disabled,
      size,
      variant,
    });

    const skinRevision = useSkinRegistryRevision();
    const motionDefaults = useMemo(() => {
      void skinRevision;
      return resolveExpandableMotionDefaults(state.contextValue.variant);
    }, [skinRevision, state.contextValue.variant]);
    const surfaceStyle = useSkinSurfaceStyle(state.contextValue.variant);

    const body = state.isCompound ? (
      children
    ) : (
      <ExpandableSimpleBody
        title={title}
        description={description}
        icon={icon}
        panelChildren={children}
      />
    );

    return (
      <ExpandableProvider value={state.contextValue}>
        <ExpandableClassNamesProvider classNames={classNames}>
          <ExpandableMotionProvider motion={motion} defaults={motionDefaults} controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}>
          <ExpandableRootSurface
            forwardedRef={ref}
            className={expandableRootClass({
              variant: state.contextValue.variant,
              className,
              slotClass: classNames?.root,
            })}
            rest={rest}
            style={mergeSkinSurfaceStyle(surfaceStyle, rest.style)}
          >
            {body}
          </ExpandableRootSurface>
          </ExpandableMotionProvider>
        </ExpandableClassNamesProvider>
      </ExpandableProvider>
    );
  },
);

ExpandableRoot.displayName = "ExpandableRoot";

function ExpandableRootSurface({
  forwardedRef,
  className,
  rest,
  style,
  children,
}: {
  forwardedRef: ForwardedRef<HTMLDivElement>;
  className: string;
  rest: HTMLAttributes<HTMLDivElement>;
  style: HTMLAttributes<HTMLDivElement>["style"];
  children: ExpandableProps["children"];
}) {
  const { onPointerOver, onPointerOut, ...domRest } = rest;
  const scope = useExpandableMotionScope();
  const part = useMotionPart<HTMLDivElement>({
    scope,
    slot: "root",
    forwardedRef,
  });
  useOptionalEnterOnMount(scope, "root", part.targetRef);
  const { open, size, variant } = useExpandable();
  const shadow = useFirstLevelHoverShadow(
    part.targetRef,
    isKitVariant(variant, KIT_EXPANDABLE_VARIANTS),
  );
  return (
    <div
      ref={part.setRef}
      className={cn(className, shadow.motionClass)}
      {...domRest}
      onPointerOver={(event) => {
        onPointerOver?.(event);
        shadow.onPointerOver(event);
      }}
      onPointerOut={(event) => {
        onPointerOut?.(event);
        shadow.onPointerOut(event);
      }}
      style={style}
      {...dataVariantProps({ size, variant })}
      data-state={dataExpandedState(open)}
    >
      {children}
    </div>
  );
}

export {
  ExpandableTrigger,
  ExpandableMessage,
  ExpandableIcon,
  ExpandableContent,
  ExpandableTitle,
  ExpandableDescription,
  ExpandableChevron,
  ExpandablePanel,
};

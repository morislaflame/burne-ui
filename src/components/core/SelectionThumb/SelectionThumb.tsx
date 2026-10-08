
import { forwardRef, useMemo, type ForwardedRef } from "react";

import { useSkinRegistryRevision, useSkinVariant } from "@/skins/skinContext";

import {
  hasPointerPhases,
  useMotionPart,
  useOptionalEnterOnMount,
} from "@/components/core/utils/slotMotion";
import { dataVariantProps } from "@/components/core/utils/dataContract";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";

import { selectionThumbDecorativeProps } from "./selectionThumbA11y";
import { resolveSelectionThumbMotionDefaults } from "./selectionThumbAnimations";
import {
  SelectionThumbMotionProvider,
  useOptionalSelectionThumbMotionScope,
  useSelectionThumbMotionScope,
} from "./selectionThumbContext";
import {
  selectionThumbIconInnerClass,
  selectionThumbIconRootClass,
  selectionThumbShellClass,
} from "./selectionThumbStyles";
import type {
  SelectionThumbIconProps,
  SelectionThumbPartMotion,
  SelectionThumbProps,
  SelectionThumbVariant,
} from "./selectionThumbTypes";

export type {
  SelectionThumbClassNames,
  SelectionThumbIconClassNames,
  SelectionThumbIconProps,
  SelectionThumbMotion,
  SelectionThumbPartMotion,
  SelectionThumbProps,
  SelectionThumbVariant,
  KitSelectionThumbVariant,
} from "./selectionThumbTypes";
export { KIT_SELECTION_THUMB_VARIANTS } from "./selectionThumbTypes";

export const SelectionThumb = forwardRef<HTMLSpanElement, SelectionThumbProps>(
  function SelectionThumb({
  size = "base",
  variant: variantProp,
  shellRef,
  className,
  classNames,
  children,
  motion,
  motionController,
  motionState,
  motionPayload,
  playInitialState,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
  ...rest
}, ref) {
  const variant = useSkinVariant(variantProp);
  const skinRevision = useSkinRegistryRevision();
  const motionDefaults = useMemo(() => {
    void skinRevision;
    return resolveSelectionThumbMotionDefaults(variant);
  }, [skinRevision, variant]);

  return (
    <SelectionThumbMotionProvider motion={motion} defaults={motionDefaults} controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}>
      <SelectionThumbShell
        size={size}
        variant={variant}
        shellRef={shellRef}
        forwardedRef={ref}
        className={className}
        classNames={classNames}
        rootMotion={motion?.root}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        rest={rest}
      >
        {children}
      </SelectionThumbShell>
    </SelectionThumbMotionProvider>
  );
});

function SelectionThumbShell({
  size,
  variant,
  shellRef,
  forwardedRef,
  className,
  classNames,
  children,
  rootMotion,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
  rest,
}: {
  size: NonNullable<SelectionThumbProps["size"]>;
  variant: SelectionThumbVariant;
  shellRef: SelectionThumbProps["shellRef"];
  forwardedRef: ForwardedRef<HTMLSpanElement>;
  className: SelectionThumbProps["className"];
  classNames: SelectionThumbProps["classNames"];
  children: SelectionThumbProps["children"];
  rootMotion?: SelectionThumbPartMotion;
  onPointerOver: SelectionThumbProps["onPointerOver"];
  onPointerOut: SelectionThumbProps["onPointerOut"];
  onPointerDown: SelectionThumbProps["onPointerDown"];
  onPointerUp: SelectionThumbProps["onPointerUp"];
  rest: Omit<
    SelectionThumbProps,
    | "size"
    | "variant"
    | "shellRef"
    | "className"
    | "classNames"
    | "children"
    | "motion"
    | "motionController"
    | "onPointerOver"
    | "onPointerOut"
    | "onPointerDown"
    | "onPointerUp"
  >;
}) {
  const scope = useSelectionThumbMotionScope();
  const pointer = hasPointerPhases(rootMotion);
  const part = useMotionPart<HTMLSpanElement>({
    scope,
    slot: "root",
    motion: rootMotion,
    pointerPhases: pointer,
    pressPhases: pointer,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
  useOptionalEnterOnMount(scope, "root", part.targetRef);

  const setRef = (node: HTMLSpanElement | null) => {
    part.setRef(node);
    if (shellRef) mergeForwardedRef(shellRef, node);
    mergeForwardedRef(forwardedRef, node);
  };

  return (
    <span
      ref={setRef}
      className={selectionThumbShellClass({
        variant,
        size,
        className,
        slotRoot: classNames?.root,
      })}
      {...selectionThumbDecorativeProps()}
      {...part.pointerHandlers}
      {...rest}
      {...dataVariantProps({ size, variant })}
    >
      {children}
    </span>
  );
}

SelectionThumb.displayName = "SelectionThumb";

export const SelectionThumbIcon = forwardRef<HTMLSpanElement, SelectionThumbIconProps>(
  function SelectionThumbIcon({
  size = "base",
  variant: variantProp,
  iconRef,
  className,
  classNames,
  children,
  style,
  motion,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
  ...rest
}, ref) {
  const variant = useSkinVariant(variantProp);
  const scope = useOptionalSelectionThumbMotionScope();
  const pointer = hasPointerPhases(motion);
  const part = useMotionPart<HTMLSpanElement>({
    scope,
    slot: "icon",
    motion,
    pointerPhases: pointer,
    pressPhases: pointer,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });

  const setRef = (node: HTMLSpanElement | null) => {
    part.setRef(node);
    if (iconRef) mergeForwardedRef(iconRef, node);
    mergeForwardedRef(ref, node);
  };

  return (
    <span
      ref={setRef}
      {...selectionThumbDecorativeProps()}
      className={selectionThumbIconRootClass({
        variant,
        className,
        slotRoot: classNames?.root,
      })}
      style={style}
      {...part.pointerHandlers}
      {...rest}
    >
      <span className={selectionThumbIconInnerClass(size, classNames?.icon)}>
        {children}
      </span>
    </span>
  );
});

SelectionThumbIcon.displayName = "SelectionThumbIcon";

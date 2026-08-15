import "../utils/glossPanel.css";

import { useMemo } from "react";

import {
  hasPointerPhases,
  useMotionPart,
  useOptionalEnterOnMount,
} from "@/components/core/utils/slotMotion";
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
} from "./selectionThumbTypes";

export type {
  SelectionThumbClassNames,
  SelectionThumbIconClassNames,
  SelectionThumbIconProps,
  SelectionThumbMotion,
  SelectionThumbPartMotion,
  SelectionThumbProps,
} from "./selectionThumbTypes";

export function SelectionThumb({
  size = "base",
  gloss = false,
  shellRef,
  className,
  classNames,
  children,
  motion,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
  ...rest
}: SelectionThumbProps) {
  const motionDefaults = useMemo(() => resolveSelectionThumbMotionDefaults(), []);

  return (
    <SelectionThumbMotionProvider motion={motion} defaults={motionDefaults}>
      <SelectionThumbShell
        size={size}
        gloss={gloss}
        shellRef={shellRef}
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
}

function SelectionThumbShell({
  size,
  gloss,
  shellRef,
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
  gloss: boolean;
  shellRef: SelectionThumbProps["shellRef"];
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
    | "gloss"
    | "shellRef"
    | "className"
    | "classNames"
    | "children"
    | "motion"
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
  useOptionalEnterOnMount(scope, "root");

  const setRef = (node: HTMLSpanElement | null) => {
    part.setRef(node);
    if (shellRef) mergeForwardedRef(shellRef, node);
  };

  return (
    <span
      ref={setRef}
      className={selectionThumbShellClass({
        gloss,
        size,
        className,
        slotRoot: classNames?.root,
      })}
      {...selectionThumbDecorativeProps()}
      {...part.pointerHandlers}
      {...rest}
    >
      {children}
    </span>
  );
}

SelectionThumb.displayName = "SelectionThumb";

export function SelectionThumbIcon({
  size = "base",
  gloss = false,
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
}: SelectionThumbIconProps) {
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
  };

  return (
    <span
      ref={setRef}
      {...selectionThumbDecorativeProps()}
      className={selectionThumbIconRootClass({
        gloss,
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
}

SelectionThumbIcon.displayName = "SelectionThumbIcon";

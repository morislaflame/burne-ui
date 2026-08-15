import { Children, forwardRef, isValidElement, useCallback, useMemo, useRef, useState, type ReactNode } from "react";

import { getMotionConfig } from "@/components/core/utils/motionConfig";
import { mergeMotionPointerHandlers } from "@/components/core/utils/slotMotion";
import { cn } from "@/utils/cn";

import { registerBadgeAnchorLiftTarget, resolveBadgeAnchorMotionDefaults, useBadgeAnchorAnimations, useBadgeAnchorMotion } from "./badgeAnimations";
import { isBadgeElement } from "./badgeAPI";
import { badgeRootA11yProps } from "./badgeA11y";
import {
  BadgeClassNamesProvider,
  BadgeDirectAnchorChildProvider,
  BadgeLiftTargetProvider,
  BadgeMotionProvider,
  useBadgeClassNames,
  useOptionalBadgeMotionScope,
} from "./badgeContext";
import type {
  BadgeAnchorProps,
  BadgeDotViewProps,
  BadgeIconOnlyViewProps,
  BadgeShellProps,
  BadgeTextViewProps,
} from "./badgeTypes";
import { BADGE_ANCHOR_ROOT_CLASS, BADGE_SHELL_SPLIT_OUTER_CLASS, badgeDotViewClass, badgeIconOnlyViewClass, badgeShellAnchorChildClass, badgeTextViewClass } from "./badgeStyles";


function BadgeShell({
  setMergedRef,
  splitLift,
  placementClass,
  splitLiftMotionCls,
  selfLiftMotionCls,
  isDirectAnchorChild,
  isGloss,
  innerLiftRef,
  pointerHandlers,
  rest,
  className,
  dataIcon,
  children,
  withA11y = false,
}: BadgeShellProps) {
  const a11y = withA11y ? badgeRootA11yProps(rest) : undefined;

  if (splitLift) {
    return (
      <span
        ref={setMergedRef}
        data-badge-root
        className={cn(BADGE_SHELL_SPLIT_OUTER_CLASS, placementClass)}
        {...rest}
        {...a11y}
      >
        <span
          ref={innerLiftRef}
          data-badge-lift-target
          data-icon={dataIcon}
          className={cn(splitLiftMotionCls, className)}
        >
          {children}
        </span>
      </span>
    );
  }

  return (
    <span
      ref={setMergedRef}
      data-icon={dataIcon}
      data-badge-root
      className={cn(
        splitLiftMotionCls,
        selfLiftMotionCls,
        badgeShellAnchorChildClass(isDirectAnchorChild, isGloss),
        placementClass,
        className,
      )}
      {...pointerHandlers}
      {...rest}
      {...a11y}
    >
      {children}
    </span>
  );
}

export function BadgeDotView({
  size,
  variant,
  status,
  shell,
  className,
  rest,
}: BadgeDotViewProps) {
  const slotClassNames = useBadgeClassNames();
  const dotInnerCls = badgeDotViewClass(
    size,
    variant,
    status,
    shell.isGloss,
    cn(slotClassNames.root, slotClassNames.dot, className),
  );

  return (
    <BadgeShell {...shell} className={dotInnerCls} rest={rest} withA11y>
      {null}
    </BadgeShell>
  );
}

export function BadgeIconOnlyView({
  size,
  surfaceClass,
  shell,
  className,
  rest,
  iconOnlyBody,
}: BadgeIconOnlyViewProps) {
  const slotClassNames = useBadgeClassNames();
  const iconInnerCls = badgeIconOnlyViewClass(
    size,
    surfaceClass,
    cn(slotClassNames.root, slotClassNames.iconOnly, className),
  );

  return (
    <BadgeShell {...shell} className={iconInnerCls} rest={rest} withA11y>
      {iconOnlyBody}
    </BadgeShell>
  );
}

export function BadgeTextView({
  size,
  surfaceClass,
  shell,
  className,
  rest,
  bodyContent,
  dataIcon,
}: BadgeTextViewProps) {
  const slotClassNames = useBadgeClassNames();
  const textInnerCls = badgeTextViewClass(
    size,
    surfaceClass,
    cn(slotClassNames.root, slotClassNames.text, className),
  );

  return (
    <BadgeShell {...shell} className={textInnerCls} rest={rest} dataIcon={dataIcon}>
      {bodyContent}
    </BadgeShell>
  );
}

export const BadgeAnchor = forwardRef<HTMLDivElement, BadgeAnchorProps>(function BadgeAnchor(
  {
    className = "",
    classNames,
    children,
    hoverLift = true,
    motion,
    onPointerOver: onPointerOverFromProps,
    onPointerOut: onPointerOutFromProps,
    ...rest
  },
  ref,
) {
  const hoverPointerInsideRef = useRef(false);
  const motionDefaults = useMemo(
    () => resolveBadgeAnchorMotionDefaults({ hoverLift }),
    [hoverLift],
  );
  const motionParams = useMemo(
    () => ({
      pointerInside: hoverPointerInsideRef,
      liftScale: getMotionConfig().badgeAnchorHoverLiftScale,
      shadowSize: "base" as const,
    }),
    [],
  );

  return (
    <BadgeClassNamesProvider classNames={classNames}>
      <BadgeMotionProvider motion={motion} defaults={motionDefaults} params={motionParams}>
        <BadgeAnchorSurface
          className={className}
          classNames={classNames}
          hoverLift={hoverLift}
          onPointerOverFromProps={onPointerOverFromProps}
          onPointerOutFromProps={onPointerOutFromProps}
          rest={rest}
          forwardedRef={ref}
        >
          {children}
        </BadgeAnchorSurface>
      </BadgeMotionProvider>
    </BadgeClassNamesProvider>
  );
});

BadgeAnchor.displayName = "BadgeAnchor";

function BadgeAnchorSurface({
  className,
  classNames,
  children,
  hoverLift,
  onPointerOverFromProps,
  onPointerOutFromProps,
  rest,
  forwardedRef,
}: {
  className: string;
  classNames?: BadgeAnchorProps["classNames"];
  children?: ReactNode;
  hoverLift: boolean;
  onPointerOverFromProps?: BadgeAnchorProps["onPointerOver"];
  onPointerOutFromProps?: BadgeAnchorProps["onPointerOut"];
  rest: Omit<
    BadgeAnchorProps,
    | "className"
    | "classNames"
    | "children"
    | "hoverLift"
    | "motion"
    | "onPointerOver"
    | "onPointerOut"
  >;
  forwardedRef: React.ForwardedRef<HTMLDivElement>;
}) {
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const liftedRef = useRef<HTMLElement | null>(null);
  const [anchorCommitGen] = useState(1);
  const scope = useOptionalBadgeMotionScope();

  const setMergedRef = useCallback(
    (node: HTMLDivElement | null) => {
      anchorRef.current = node;
      if (typeof forwardedRef === "function") forwardedRef(node);
      else if (forwardedRef) forwardedRef.current = node;
    },
    [forwardedRef],
  );

  const registerLiftTarget = useCallback(
    (el: HTMLElement | null) => {
      liftedRef.current = el;
      registerBadgeAnchorLiftTarget(el, hoverLift);
      scope?.registerTarget("anchor", el);
    },
    [hoverLift, scope],
  );

  const ctx = useMemo(
    () => ({ registerLiftTarget, anchorRef, anchorCommitGen, hoverLift }),
    [registerLiftTarget, anchorCommitGen, hoverLift],
  );

  useBadgeAnchorAnimations(liftedRef);
  const anchorMotion = useBadgeAnchorMotion(liftedRef, anchorRef);
  const pointerHandlers = useMemo(
    () =>
      mergeMotionPointerHandlers(
        onPointerOverFromProps,
        onPointerOutFromProps,
        anchorMotion.onPointerOver,
        anchorMotion.onPointerOut,
      ),
    [
      anchorMotion.onPointerOut,
      anchorMotion.onPointerOver,
      onPointerOutFromProps,
      onPointerOverFromProps,
    ],
  );
  const slotClassNames = useBadgeClassNames();

  return (
    <BadgeLiftTargetProvider value={ctx}>
      <div
        ref={setMergedRef}
        data-badge-anchor
        className={cn(BADGE_ANCHOR_ROOT_CLASS, slotClassNames.anchor, classNames?.anchor, className)}
        {...rest}
        {...pointerHandlers}
      >
        {Children.map(children, (child, index) => {
          if (!isValidElement(child)) return child;
          if (isBadgeElement(child)) {
            return (
              <BadgeDirectAnchorChildProvider key={child.key ?? `badge-anchor-child-${index}`}>
                {child}
              </BadgeDirectAnchorChildProvider>
            );
          }
          return child;
        })}
      </div>
    </BadgeLiftTargetProvider>
  );
}
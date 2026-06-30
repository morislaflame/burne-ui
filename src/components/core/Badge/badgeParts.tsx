import {
  Children,
  forwardRef,
  isValidElement,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";

import { cn } from "@/utils/cn";

import {
  registerBadgeAnchorLiftTarget,
  useBadgeAnchorAnimations,
} from "./badgeAnimations";
import { isBadgeElement } from "./badgeAPI";
import { badgeRootA11yProps } from "./badgeA11y";
import {
  BadgeClassNamesProvider,
  BadgeDirectAnchorChildProvider,
  BadgeLiftTargetProvider,
  useBadgeClassNames,
} from "./badgeContext";
import type {
  BadgeAnchorProps,
  BadgeDotViewProps,
  BadgeIconOnlyViewProps,
  BadgeShellProps,
  BadgeTextViewProps,
} from "./badgeTypes";
import {
  BADGE_ANCHOR_ROOT_CLASS,
  BADGE_SHELL_SPLIT_OUTER_CLASS,
  badgeDotViewClass,
  badgeIconOnlyViewClass,
  badgeShellAnchorChildClass,
  badgeTextViewClass,
} from "./badgeStyles";


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
  const innerCls = cn(className, splitLiftMotionCls, !splitLift && placementClass);

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
          className={innerCls}
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
        innerCls,
        selfLiftMotionCls,
        badgeShellAnchorChildClass(isDirectAnchorChild, isGloss),
        placementClass,
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
    onPointerOver: onPointerOverFromProps,
    onPointerOut: onPointerOutFromProps,
    ...rest
  },
  ref,
) {
  const anchorRef = useRef<HTMLDivElement | null>(null);
  const liftedRef = useRef<HTMLElement | null>(null);
  const [anchorCommitGen] = useState(1);

  const setMergedRef = useCallback(
    (node: HTMLDivElement | null) => {
      anchorRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const registerLiftTarget = useCallback(
    (el: HTMLElement | null) => {
      liftedRef.current = el;
      registerBadgeAnchorLiftTarget(el, hoverLift);
    },
    [hoverLift],
  );

  const ctx = useMemo(
    () => ({ registerLiftTarget, anchorRef, anchorCommitGen, hoverLift }),
    [registerLiftTarget, anchorCommitGen, hoverLift],
  );

  const anchorLiftShadow = useBadgeAnchorAnimations(liftedRef, hoverLift);
  const slotClassNames = useBadgeClassNames();

  return (
    <BadgeClassNamesProvider classNames={classNames}>
      <BadgeLiftTargetProvider value={ctx}>
        <div
          ref={setMergedRef}
          data-badge-anchor
          className={cn(BADGE_ANCHOR_ROOT_CLASS, slotClassNames.anchor, classNames?.anchor, className)}
          onPointerOver={(e) => {
            onPointerOverFromProps?.(e);
            if (!e.defaultPrevented) anchorLiftShadow.onPointerOver(e);
          }}
          onPointerOut={(e) => {
            onPointerOutFromProps?.(e);
            anchorLiftShadow.onPointerOut(e);
          }}
          {...rest}
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
    </BadgeClassNamesProvider>
  );
});

BadgeAnchor.displayName = "BadgeAnchor";

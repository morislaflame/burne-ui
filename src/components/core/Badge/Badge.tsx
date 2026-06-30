import { forwardRef, type ReactNode } from "react";

import type { BadgeProps } from "./badgeTypes";
import { useBadgeAnimations } from "./badgeAnimations";
import { BadgeClassNamesProvider } from "./badgeContext";
import { BadgeDotView, BadgeIconOnlyView, BadgeTextView } from "./badgeParts";
import { useBadgeRootState } from "./useBadgeRootState";

export type {
  BadgeProps,
  BadgeVariant,
  BadgeStatus,
  BadgeSize,
  BadgePlacement,
  BadgeIconPosition,
  BadgeInlineIconPosition,
  BadgeClassNames,
} from "./badgeTypes";

export const BadgeRoot = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  {
    variant = "default",
    status = "default",
    size = "base",
    icon,
    iconPosition = "start",
    iconOnly = false,
    dot: dotProp = false,
    placement,
    classNames,
    className = "",
    children,
    hoverLift = true,
    onPointerOver,
    onPointerOut,
    ...rest
  },
  forwardedRef,
) {
  const dot = dotProp;

  const {
    surfaceClass,
    meaningChild,
    placementClass,
    isDirectAnchorChild,
    layoutKind,
    bodyContent,
    iconOnlyBody,
    dataIcon,
  } = useBadgeRootState({
    variant,
    status,
    size,
    children,
    icon,
    iconOnly,
    iconPosition,
    dot,
    placement,
  });

  const lift = useBadgeAnimations({
    variant,
    hoverLift,
    forwardedRef,
    isDirectAnchorChild,
    placement,
    onPointerOver,
    onPointerOut,
    syncDeps: { meaningChild, icon, dot, iconOnly, children },
  });

  const shell = {
    setMergedRef: lift.setMergedRef,
    splitLift: lift.splitLift,
    placementClass,
    splitLiftMotionCls: lift.splitLiftMotionCls,
    selfLiftMotionCls: lift.selfLiftMotionCls,
    isDirectAnchorChild,
    isGloss: lift.isGloss,
    innerLiftRef: lift.innerLiftRef,
    pointerHandlers: lift.pointerHandlers,
    rest,
  };

  const renderWithClassNames = (node: ReactNode) => (
    <BadgeClassNamesProvider classNames={classNames}>
      {node}
    </BadgeClassNamesProvider>
  );

  if (layoutKind === "dot") {
    return renderWithClassNames(
      <BadgeDotView
        size={size}
        variant={variant}
        status={status}
        shell={shell}
        className={className}
        rest={rest}
      />
    );
  }

  if (layoutKind === "iconOnly") {
    return renderWithClassNames(
      <BadgeIconOnlyView
        size={size}
        surfaceClass={surfaceClass}
        shell={shell}
        className={className}
        rest={rest}
        iconOnlyBody={iconOnlyBody}
      />
    );
  }

  return renderWithClassNames(
    <BadgeTextView
      size={size}
      surfaceClass={surfaceClass}
      shell={shell}
      className={className}
      rest={rest}
      bodyContent={bodyContent}
      dataIcon={dataIcon}
    />
  );
});

BadgeRoot.displayName = "BadgeRoot";

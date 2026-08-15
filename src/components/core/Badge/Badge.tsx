import { forwardRef, useMemo, type HTMLAttributes, type ReactNode } from "react";

import type { BadgeMotion, BadgeProps } from "./badgeTypes";
import { resolveBadgeMotionDefaults, useBadgeAnimations } from "./badgeAnimations";
import { BadgeClassNamesProvider, BadgeMotionProvider, useBadgeLiftContext } from "./badgeContext";
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
  BadgeMotion,
  BadgePartMotion,
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
    motion,
    onPointerOver,
    onPointerOut,
    ...rest
  },
  forwardedRef,
) {
  const dot = dotProp;
  const liftCtx = useBadgeLiftContext();

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

  const isGloss = variant === "gloss";
  const splitLift = Boolean(isDirectAnchorChild && liftCtx?.hoverLift && !isGloss);
  const motionDefaults = useMemo(
    () => resolveBadgeMotionDefaults({ variant, hoverLift, splitLift }),
    [hoverLift, splitLift, variant],
  );
  const motionParams = useMemo(
    () => ({ shadowSize: "base", variant }),
    [variant],
  );

  return (
    <BadgeClassNamesProvider classNames={classNames}>
      <BadgeMotionProvider motion={motion} defaults={motionDefaults} params={motionParams}>
        <BadgeSurface
          variant={variant}
          status={status}
          size={size}
          icon={icon}
          hoverLift={hoverLift}
          motion={motion}
          forwardedRef={forwardedRef}
          isDirectAnchorChild={isDirectAnchorChild}
          placement={placement}
          onPointerOver={onPointerOver}
          onPointerOut={onPointerOut}
          meaningChild={meaningChild}
          placementClass={placementClass}
          layoutKind={layoutKind}
          bodyContent={bodyContent}
          iconOnlyBody={iconOnlyBody}
          dataIcon={dataIcon}
          surfaceClass={surfaceClass}
          className={className}
          rest={rest}
        />
      </BadgeMotionProvider>
    </BadgeClassNamesProvider>
  );
});

BadgeRoot.displayName = "BadgeRoot";

function BadgeSurface({
  variant,
  status,
  size,
  icon,
  hoverLift,
  motion,
  forwardedRef,
  isDirectAnchorChild,
  placement,
  onPointerOver,
  onPointerOut,
  meaningChild,
  placementClass,
  layoutKind,
  bodyContent,
  iconOnlyBody,
  dataIcon,
  surfaceClass,
  className,
  rest,
}: {
  variant: NonNullable<BadgeProps["variant"]>;
  status: NonNullable<BadgeProps["status"]>;
  size: NonNullable<BadgeProps["size"]>;
  icon: BadgeProps["icon"];
  hoverLift: boolean;
  motion?: BadgeMotion;
  forwardedRef: React.ForwardedRef<HTMLSpanElement>;
  isDirectAnchorChild: boolean;
  placement: BadgeProps["placement"];
  onPointerOver: BadgeProps["onPointerOver"];
  onPointerOut: BadgeProps["onPointerOut"];
  meaningChild: boolean;
  placementClass: string;
  layoutKind: "dot" | "iconOnly" | "text";
  bodyContent: ReactNode;
  iconOnlyBody: ReactNode;
  dataIcon: BadgeProps["iconPosition"] | undefined;
  surfaceClass: string;
  className: string;
  rest: HTMLAttributes<HTMLSpanElement>;
}) {
  const lift = useBadgeAnimations({
    variant,
    hoverLift,
    motion,
    forwardedRef,
    isDirectAnchorChild,
    placement,
    onPointerOver,
    onPointerOut,
    syncDeps: { meaningChild, icon, dot: layoutKind === "dot", iconOnly: layoutKind === "iconOnly", children: bodyContent },
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

  if (layoutKind === "dot") {
    return (
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
    return (
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

  return (
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
}

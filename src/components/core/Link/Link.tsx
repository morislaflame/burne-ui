import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  useMemo,
  type ReactElement,
  type ReactNode,
} from "react";

import { mergeAsChildProps } from "@/components/core/utils/mergeAsChildProps";

import { resolveLinkMotionDefaults, useLinkAnimations } from "./linkAnimations";
import { LinkClassNamesProvider, LinkMotionProvider, useLinkClassNames } from "./linkContext";
import { LinkAnchorBody, LinkBodyContent, LinkIcon } from "./linkParts";
import { linkAnchorClass } from "./linkStyles";
import type { LinkProps } from "./linkTypes";
import { useLinkRootState } from "./useLinkRootState";

export type {
  LinkProps,
  LinkSize,
  LinkIconPos,
  LinkIconProps,
  LinkClassNames,
  LinkMotion,
  LinkPartMotion,
} from "./linkTypes";

export { LinkIcon };

export const LinkRoot = forwardRef<HTMLAnchorElement, Omit<LinkProps, "classNames" | "motion">>(
  function LinkRoot(
    {
      href,
      asChild = false,
      children,
      className = "",
      size: sizeProp,
      underline: underlineProp,
      icon,
      iconPosition,
      showDefaultIcon,
      defaultIconPosition,
      onPointerEnter,
      onPointerLeave,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      onKeyDown,
      ...rest
    },
    forwardedRef,
  ) {
    const asChildElement =
      asChild && isValidElement(children) && Children.count(children) === 1
        ? (children as ReactElement<{ children?: ReactNode; href?: string }>)
        : null;
    const contentChildren = asChildElement
      ? asChildElement.props.children
      : children;

    const state = useLinkRootState({
      size: sizeProp,
      underline: underlineProp,
      icon,
      iconPosition,
      showDefaultIcon,
      defaultIconPosition,
      children: contentChildren,
    });

    const animations = useLinkAnimations({
      forwardedRef,
      onPointerEnter,
      onPointerLeave,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      onKeyDown,
    });

    const slotClassNames = useLinkClassNames();
    const bodyProps = {
      size: state.size,
      underline: state.underline,
      textVariant: state.textVariant,
      textChildren: state.textChildren,
      startIcon: state.startIcon,
      endIcon: state.endIcon,
      startIconMuted: state.startIconMuted,
      endIconMuted: state.endIconMuted,
      usesDefaultAtStart: state.usesDefaultAtStart,
      usesDefaultAtEnd: state.usesDefaultAtEnd,
    };

    if (asChildElement) {
      return cloneElement(
        asChildElement,
        mergeAsChildProps(
          asChildElement,
          {
            ...rest,
            ...(href != null ? { href } : {}),
            className: linkAnchorClass({
              slotClass: slotClassNames.root,
              className,
            }),
            onPointerEnter: animations.handlePointerEnter,
            onPointerLeave: animations.handlePointerLeave,
            onPointerOver: animations.pointerHandlers.onPointerOver,
            onPointerOut: animations.pointerHandlers.onPointerOut,
            onPointerDown: animations.pointerHandlers.onPointerDown,
            onPointerUp: animations.pointerHandlers.onPointerUp,
            onKeyDown: animations.handleKeyDown,
            children: <LinkBodyContent {...bodyProps} />,
          },
          animations.setAnchorRef,
        ),
      );
    }

    return (
      <LinkAnchorBody
        href={href!}
        className={className}
        setAnchorRef={animations.setAnchorRef}
        handlePointerEnter={animations.handlePointerEnter}
        handlePointerLeave={animations.handlePointerLeave}
        pointerHandlers={animations.pointerHandlers}
        handleKeyDown={animations.handleKeyDown}
        {...bodyProps}
        {...rest}
      />
    );
  },
);

LinkRoot.displayName = "Link";

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { classNames, motion, ...rest },
  ref,
) {
  const motionDefaults = useMemo(() => resolveLinkMotionDefaults(), []);

  return (
    <LinkClassNamesProvider classNames={classNames}>
      <LinkMotionProvider motion={motion} defaults={motionDefaults}>
        <LinkRoot ref={ref} {...rest} />
      </LinkMotionProvider>
    </LinkClassNamesProvider>
  );
});

Link.displayName = "Link";

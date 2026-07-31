import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from "react";

import { mergeAsChildProps } from "@/components/core/utils/mergeAsChildProps";

import { useLinkAnimations } from "./linkAnimations";
import { LinkClassNamesProvider, useLinkClassNames } from "./linkContext";
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
} from "./linkTypes";

export { LinkIcon };

export const LinkRoot = forwardRef<HTMLAnchorElement, Omit<LinkProps, "classNames">>(
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
      onPointerDown,
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
      onPointerDown,
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
            onPointerDown: animations.handlePointerDown,
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
        handlePointerDown={animations.handlePointerDown}
        handleKeyDown={animations.handleKeyDown}
        {...bodyProps}
        {...rest}
      />
    );
  },
);

LinkRoot.displayName = "Link";

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(function Link(
  { classNames, ...rest },
  ref,
) {
  return (
    <LinkClassNamesProvider classNames={classNames}>
      <LinkRoot ref={ref} {...rest} />
    </LinkClassNamesProvider>
  );
});

Link.displayName = "Link";

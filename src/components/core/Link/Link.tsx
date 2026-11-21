import {
  Children,
  Fragment,
  cloneElement,
  forwardRef,
  isValidElement,
  useMemo,
  type ReactElement,
  type ReactNode,
} from "react";
 
import { dataFlag, dataVariantProps } from "@/components/core/utils/dataContract";
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
  LinkIconProps,
  LinkClassNames,
  LinkMotion,
  LinkPartMotion,
} from "./linkTypes";
 
export { LinkIcon };
 
export const LinkRoot = forwardRef<
  HTMLAnchorElement,
  Omit<LinkProps, "classNames" | "motion" | "motionController" | "motionState" | "motionPayload" | "playInitialState">
>(
  function LinkRoot(
    {
      href,
      asChild = false,
      disabled,
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
      asChild &&
      isValidElement(children) &&
      children.type !== Fragment &&
      Children.count(children) === 1
        ? (children as ReactElement<{
            children?: ReactNode;
            href?: string;
            disabled?: boolean;
            "aria-disabled"?: boolean | "true" | "false";
          }>)
        : null;
    const contentChildren = asChildElement
      ? asChildElement.props.children
      : children;
    const childAriaDisabled = asChildElement?.props?.["aria-disabled"];
    const isDisabled =
      Boolean(disabled) ||
      rest["aria-disabled"] === true ||
      rest["aria-disabled"] === "true" ||
      Boolean(asChildElement?.props?.disabled) ||
      childAriaDisabled === true ||
      childAriaDisabled === "true";
 
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
      disabled: isDisabled,
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
      startIconClassName: state.startIconClassName,
      endIconClassName: state.endIconClassName,
      startIconMotion: state.startIconMotion,
      endIconMotion: state.endIconMotion,
      startIconRef: state.startIconRef,
      endIconRef: state.endIconRef,
      startIconMuted: state.startIconMuted,
      endIconMuted: state.endIconMuted,
      usesDefaultAtStart: state.usesDefaultAtStart,
      usesDefaultAtEnd: state.usesDefaultAtEnd,
    };
 
    if (asChildElement) {
      const mergedAsChild = mergeAsChildProps(
        asChildElement,
        {
          ...rest,
          ...(href != null && !isDisabled ? { href } : {}),
          ...(isDisabled ? { "aria-disabled": true, tabIndex: -1 } : {}),
          className: linkAnchorClass({
            disabled: isDisabled,
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
          ...dataVariantProps({ size: state.size }),
          "data-disabled": dataFlag(isDisabled),
        },
        animations.setAnchorRef,
        { disabled: isDisabled },
      );
      if (isDisabled) mergedAsChild.href = undefined;
      return cloneElement(asChildElement, mergedAsChild);
    }

    if (asChild && contentChildren == null && href == null) {
      return null;
    }
 
    return (
      <LinkAnchorBody
        href={href}
        disabled={isDisabled}
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
  { classNames, motion, motionController, motionState, motionPayload, playInitialState, ...rest },
  ref,
) {
  const motionDefaults = useMemo(() => resolveLinkMotionDefaults(), []);
 
  return (
    <LinkClassNamesProvider classNames={classNames}>
      <LinkMotionProvider
        motion={motion}
        defaults={motionDefaults}
        controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}
      >
        <LinkRoot ref={ref} {...rest} />
      </LinkMotionProvider>
    </LinkClassNamesProvider>
  );
});
 
Link.displayName = "Link";
 
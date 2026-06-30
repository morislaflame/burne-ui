import { forwardRef } from "react";
import { IoArrowForward } from "react-icons/io5";

import { Text } from "@/components/core/Text";

import {
  LINK_DEFAULT_ICON_ARIA_HIDDEN,
  LINK_ICON_SLOT_ARIA_HIDDEN,
} from "./linkA11y";
import { useLinkAnimations } from "./linkAnimations";
import { useLinkClassNames } from "./linkContext";
import {
  linkAnchorClass,
  linkDefaultIconClass,
  linkIconSlotClass,
  linkMotionClass,
  linkTextClass,
} from "./linkStyles";
import type { LinkIconSlotProps, LinkProps } from "./linkTypes";
import { useLinkRootState } from "./useLinkRootState";

function DefaultLinkIcon({ size }: { size: LinkProps["size"] }) {
  return (
    <IoArrowForward
      aria-hidden={LINK_DEFAULT_ICON_ARIA_HIDDEN}
      className={linkDefaultIconClass(size ?? "base")}
    />
  );
}

function LinkIconSlot({
  children,
  size,
  muted = false,
  slotClass,
}: LinkIconSlotProps) {
  return (
    <span
      className={linkIconSlotClass({ size, muted, slotClass })}
      aria-hidden={LINK_ICON_SLOT_ARIA_HIDDEN}
    >
      {children}
    </span>
  );
}

export const LinkRoot = forwardRef<HTMLAnchorElement, Omit<LinkProps, "classNames">>(
  function LinkRoot(
    {
      href,
      children,
      className = "",
      size: sizeProp,
      underline: underlineProp,
      leftIcon,
      rightIcon,
      showDefaultIcon,
      defaultIconPosition,
      onPointerEnter,
      onPointerLeave,
      onPointerDown,
      ...rest
    },
    forwardedRef,
  ) {
    const slotClassNames = useLinkClassNames();
    const {
      size,
      underline,
      textVariant,
      defaultIconAtStart,
      defaultIconAtEnd,
      usesDefaultIcon,
    } = useLinkRootState({
      size: sizeProp,
      underline: underlineProp,
      leftIcon,
      rightIcon,
      showDefaultIcon,
      defaultIconPosition,
    });

    const {
      setMotionRef,
      setAnchorRef,
      handlePointerEnter,
      handlePointerLeave,
      handlePointerDown,
    } = useLinkAnimations({
      forwardedRef,
      onPointerEnter,
      onPointerLeave,
      onPointerDown,
    });

    const defaultIconNode = usesDefaultIcon ? (
      <DefaultLinkIcon size={size} />
    ) : null;

    const resolvedStart =
      leftIcon ?? (defaultIconAtStart ? defaultIconNode : null);
    const resolvedEnd = rightIcon ?? (defaultIconAtEnd ? defaultIconNode : null);

    return (
      <span
        ref={setMotionRef}
        className={linkMotionClass({ slotClass: slotClassNames.motion })}
      >
        <a
          ref={setAnchorRef}
          href={href}
          className={linkAnchorClass({
            slotClass: slotClassNames.anchor,
            className,
          })}
          onPointerEnter={handlePointerEnter}
          onPointerLeave={handlePointerLeave}
          onPointerDown={handlePointerDown}
          {...rest}
        >
          {resolvedStart ? (
            <LinkIconSlot
              size={size}
              muted={defaultIconAtStart}
              slotClass={slotClassNames.iconStart}
            >
              {resolvedStart}
            </LinkIconSlot>
          ) : null}
          <Text
            as="span"
            variant={textVariant}
            inheritColor
            className={linkTextClass({
              underline,
              slotClass: slotClassNames.text,
            })}
          >
            {children}
          </Text>
          {resolvedEnd ? (
            <LinkIconSlot
              size={size}
              muted={defaultIconAtEnd}
              slotClass={slotClassNames.iconEnd}
            >
              {resolvedEnd}
            </LinkIconSlot>
          ) : null}
        </a>
      </span>
    );
  },
);

LinkRoot.displayName = "Link";

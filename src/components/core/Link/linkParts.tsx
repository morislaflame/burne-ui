import { IoArrowForward } from "react-icons/io5";

import { Text } from "@/components/core/Text";

import {
  LINK_DEFAULT_ICON_ARIA_HIDDEN,
  LINK_ICON_SLOT_ARIA_HIDDEN,
} from "./linkA11y";
import { useLinkClassNames } from "./linkContext";
import {
  linkAnchorClass,
  linkDefaultIconClass,
  linkIconSlotClass,
  linkTextClass,
} from "./linkStyles";
import type {
  LinkAnchorBodyProps,
  LinkIconProps,
  LinkIconSlotProps,
  LinkSize,
} from "./linkTypes";

export function LinkIcon(_props: LinkIconProps) {
  return null;
}

LinkIcon.displayName = "Link.Icon";

export function LinkDefaultIcon({ size }: { size: LinkSize }) {
  return (
    <IoArrowForward
      aria-hidden={LINK_DEFAULT_ICON_ARIA_HIDDEN}
      className={linkDefaultIconClass(size)}
    />
  );
}

export function LinkIconSlot({
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

export function LinkAnchorBody({
  href,
  size,
  underline,
  textVariant,
  textChildren,
  startIcon,
  endIcon,
  startIconMuted,
  endIconMuted,
  usesDefaultAtStart,
  usesDefaultAtEnd,
  className = "",
  setAnchorRef,
  handlePointerEnter,
  handlePointerLeave,
  handlePointerDown,
  ...rest
}: LinkAnchorBodyProps & {
  usesDefaultAtStart: boolean;
  usesDefaultAtEnd: boolean;
}) {
  const slotClassNames = useLinkClassNames();

  const resolvedStart =
    startIcon ?? (usesDefaultAtStart ? <LinkDefaultIcon size={size} /> : null);
  const resolvedEnd =
    endIcon ?? (usesDefaultAtEnd ? <LinkDefaultIcon size={size} /> : null);

  return (
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
          muted={startIconMuted}
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
        {textChildren}
      </Text>
      {resolvedEnd ? (
        <LinkIconSlot
          size={size}
          muted={endIconMuted}
          slotClass={slotClassNames.iconEnd}
        >
          {resolvedEnd}
        </LinkIconSlot>
      ) : null}
    </a>
  );
}

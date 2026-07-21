import { Text } from "@/components/core/Text";

import { useLinkClassNames } from "./linkContext";
import { LinkDefaultIcon } from "./linkDefaultIconPart";
import { LinkIconSlot } from "./linkIconSlotPart";
import { linkAnchorClass, linkTextClass } from "./linkStyles";
import type { LinkAnchorBodyProps } from "./linkTypes";

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
}: LinkAnchorBodyProps) {
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
        slotClass: slotClassNames.root,
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

import { Text } from "@/components/core/Text";

import { useMotionPart } from "@/components/core/utils/slotMotion";

import { useLinkClassNames, useOptionalLinkMotionScope } from "./linkContext";
import { LinkDefaultIcon } from "./linkDefaultIconPart";
import { LinkIconSlot } from "./linkIconSlotPart";
import { linkAnchorClass, linkTextClass } from "./linkStyles";
import type { LinkAnchorBodyProps, LinkBodyContentProps } from "./linkTypes";

export function LinkBodyContent({
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
}: LinkBodyContentProps) {
  const slotClassNames = useLinkClassNames();
  const { setRef: setTextRef, pointerHandlers: textPointer } = useMotionPart<HTMLSpanElement>({
    scope: useOptionalLinkMotionScope(),
    slot: "text",
    pointerPhases: true,
  });

  const resolvedStart =
    startIcon ?? (usesDefaultAtStart ? <LinkDefaultIcon size={size} /> : null);
  const resolvedEnd =
    endIcon ?? (usesDefaultAtEnd ? <LinkDefaultIcon size={size} /> : null);

  return (
    <>
      {resolvedStart ? (
        <LinkIconSlot
          size={size}
          muted={startIconMuted}
          slotClass={slotClassNames.icon}
        >
          {resolvedStart}
        </LinkIconSlot>
      ) : null}
      <span ref={setTextRef} {...textPointer}>
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
      </span>
      {resolvedEnd ? (
        <LinkIconSlot
          size={size}
          muted={endIconMuted}
          slotClass={slotClassNames.icon}
        >
          {resolvedEnd}
        </LinkIconSlot>
      ) : null}
    </>
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
  pointerHandlers,
  handleKeyDown,
  ...rest
}: LinkAnchorBodyProps) {
  const slotClassNames = useLinkClassNames();

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
      onKeyDown={handleKeyDown}
      {...rest}
      {...pointerHandlers}
    >
      <LinkBodyContent
        size={size}
        underline={underline}
        textVariant={textVariant}
        textChildren={textChildren}
        startIcon={startIcon}
        endIcon={endIcon}
        startIconMuted={startIconMuted}
        endIconMuted={endIconMuted}
        usesDefaultAtStart={usesDefaultAtStart}
        usesDefaultAtEnd={usesDefaultAtEnd}
      />
    </a>
  );
}

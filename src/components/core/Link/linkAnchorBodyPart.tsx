import { Text } from "@/components/core/Text";
 
import { dataFlag, dataVariantProps } from "@/components/core/utils/dataContract";
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
  startIconClassName,
  endIconClassName,
  startIconMotion,
  endIconMotion,
  startIconRef,
  endIconRef,
  startIconMuted,
  endIconMuted,
  usesDefaultAtStart,
  usesDefaultAtEnd,
}: LinkBodyContentProps) {
  const slotClassNames = useLinkClassNames();
  const { setRef: setTextRef } = useMotionPart<HTMLSpanElement>({
    scope: useOptionalLinkMotionScope(),
    slot: "text",
  });
 
  const resolvedStart =
    startIcon ?? (usesDefaultAtStart ? <LinkDefaultIcon /> : null);
  const resolvedEnd =
    endIcon ?? (usesDefaultAtEnd ? <LinkDefaultIcon /> : null);
 
  return (
    <>
      {resolvedStart ? (
        <LinkIconSlot
          size={size}
          muted={startIconMuted}
          slot="iconStart"
          slotClass={slotClassNames.iconStart}
          className={startIconClassName}
          motion={startIconMotion}
          forwardedRef={startIconRef}
        >
          {resolvedStart}
        </LinkIconSlot>
      ) : null}
      <Text
        ref={setTextRef}
        as="span"
        textStyle={textVariant}
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
          slot="iconEnd"
          slotClass={slotClassNames.iconEnd}
          className={endIconClassName}
          motion={endIconMotion}
          forwardedRef={endIconRef}
        >
          {resolvedEnd}
        </LinkIconSlot>
      ) : null}
    </>
  );
}
 
export function LinkAnchorBody({
  href,
  disabled = false,
  size,
  underline,
  textVariant,
  textChildren,
  startIcon,
  endIcon,
  startIconClassName,
  endIconClassName,
  startIconMotion,
  endIconMotion,
  startIconRef,
  endIconRef,
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
  onClick,
  onAuxClick,
  tabIndex,
  "aria-disabled": ariaDisabledProp,
  ...rest
}: LinkAnchorBodyProps) {
  const slotClassNames = useLinkClassNames();
 
  return (
    <a
      ref={setAnchorRef}
      href={disabled ? undefined : href}
      aria-disabled={disabled ? true : ariaDisabledProp}
      tabIndex={disabled ? -1 : tabIndex}
      className={linkAnchorClass({
        disabled,
        slotClass: slotClassNames.root,
        className,
      })}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      onClick={(event) => {
        if (disabled) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        onClick?.(event);
      }}
      onAuxClick={(event) => {
        if (disabled) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        onAuxClick?.(event);
      }}
      onKeyDown={(event) => {
        if (disabled && (event.key === "Enter" || event.key === " " || event.key === "Spacebar")) {
          event.preventDefault();
          event.stopPropagation();
          return;
        }
        handleKeyDown(event);
      }}
      {...rest}
      {...pointerHandlers}
      {...dataVariantProps({ size })}
      data-disabled={dataFlag(disabled)}
    >
      <LinkBodyContent
        size={size}
        underline={underline}
        textVariant={textVariant}
        textChildren={textChildren}
        startIcon={startIcon}
        endIcon={endIcon}
        startIconClassName={startIconClassName}
        endIconClassName={endIconClassName}
        startIconMotion={startIconMotion}
        endIconMotion={endIconMotion}
        startIconRef={startIconRef}
        endIconRef={endIconRef}
        startIconMuted={startIconMuted}
        endIconMuted={endIconMuted}
        usesDefaultAtStart={usesDefaultAtStart}
        usesDefaultAtEnd={usesDefaultAtEnd}
      />
    </a>
  );
}
 
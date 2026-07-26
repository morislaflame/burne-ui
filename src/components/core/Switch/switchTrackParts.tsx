import { useMemo, useRef } from "react";

import { SelectionThumb } from "@/components/core/SelectionThumb";

import "@/components/core/utils/glossPanel.css";

import { useSwitchTrackAnimations } from "./switchAnimations";
import { useSwitchClassNames, useSwitchTrackContext, SwitchTrackProvider } from "./switchContext";
import {
  SWITCH_FILL_BASE_CLASS,
  SWITCH_FILL_COLOR_CLASS,
  SWITCH_FILL_GLOSS_CLASS,
  SWITCH_FILL_GLOSS_TINT_CLASS,
  SWITCH_ICON_BASE_CLASS,
  SWITCH_THUMB_BASE_CLASS,
  SWITCH_THUMB_GLOSS_CLASS,
  switchFillColorStyle,
  switchTrackClass,
  switchTrackCustomStyle,
} from "./switchStyles";
import type {
  SwitchFillProps,
  SwitchIconProps,
  SwitchThumbProps,
  SwitchTrackContextValue,
  SwitchTrackProps,
} from "./switchTypes";

import { cn } from "@/utils/cn";

export function SwitchTrack({
  size,
  thickness,
  checked = false,
  disabled,
  color,
  gloss = false,
  squeezeToken = 0,
  iconOff,
  iconOn,
  className,
  classNames: trackClassNames,
  children,
  ...rest
}: SwitchTrackProps) {
  const rootClassNames = useSwitchClassNames();
  const slotClassNames = useMemo(
    () => ({ ...rootClassNames, ...trackClassNames }),
    [rootClassNames, trackClassNames],
  );

  const trackRef = useRef<HTMLSpanElement>(null);
  const trackFillRef = useRef<HTMLSpanElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const thumbShellRef = useRef<HTMLSpanElement>(null);
  const iconOffRef = useRef<HTMLSpanElement>(null);
  const iconOnRef = useRef<HTMLSpanElement>(null);

  useSwitchTrackAnimations({
    checked,
    disabled,
    size,
    thickness,
    squeezeToken,
    trackRef,
    trackFillRef,
    thumbRef,
    thumbShellRef,
    iconOffRef,
    iconOnRef,
  });

  const ctx = useMemo<SwitchTrackContextValue>(
    () => ({
      checked,
      disabled,
      size,
      color,
      gloss,
      trackFillRef,
      thumbRef,
      thumbShellRef,
      iconOffRef,
      iconOnRef,
    }),
    [checked, color, disabled, gloss, size],
  );

  const defaultBody = (
    <>
      <SwitchFill />
      <SwitchThumb>
        {iconOff != null ? <SwitchIcon when="off">{iconOff}</SwitchIcon> : null}
        {iconOn != null ? <SwitchIcon when="on">{iconOn}</SwitchIcon> : null}
      </SwitchThumb>
    </>
  );

  return (
    <SwitchTrackProvider value={ctx}>
      <span
        ref={trackRef}
        className={switchTrackClass({
          size,
          thickness,
          gloss,
          slotClass: slotClassNames.track,
          className,
        })}
        style={switchTrackCustomStyle(thickness)}
        aria-hidden
        {...rest}
      >
        {children ?? defaultBody}
      </span>
    </SwitchTrackProvider>
  );
}

SwitchTrack.displayName = "SwitchTrack";

export function SwitchFill({ className, style, ...rest }: SwitchFillProps) {
  const ctx = useSwitchTrackContext();
  const slotClassNames = useSwitchClassNames();
  const trackFillStyle = switchFillColorStyle(ctx.color);

  return (
    <span
      ref={ctx.trackFillRef}
      aria-hidden
      className={cn(
        SWITCH_FILL_BASE_CLASS,
        ctx.gloss && SWITCH_FILL_GLOSS_CLASS,
        !ctx.color && (ctx.gloss ? SWITCH_FILL_GLOSS_TINT_CLASS : SWITCH_FILL_COLOR_CLASS),
        slotClassNames.fill,
        className,
      )}
      style={{ opacity: 0, ...trackFillStyle, ...style }}
      {...rest}
    />
  );
}

SwitchFill.displayName = "SwitchFill";

export function SwitchThumb({ className, children, ...rest }: SwitchThumbProps) {
  const ctx = useSwitchTrackContext();
  const slotClassNames = useSwitchClassNames();

  return (
    <span
      ref={ctx.thumbRef}
      className={cn(
        SWITCH_THUMB_BASE_CLASS,
        ctx.gloss && SWITCH_THUMB_GLOSS_CLASS,
        slotClassNames.thumb,
        className,
      )}
      {...rest}
    >
      <SelectionThumb
        size={ctx.size}
        gloss={ctx.gloss}
        shellRef={ctx.thumbShellRef}
        className={slotClassNames.thumbShell}
      >
        {children}
      </SelectionThumb>
    </span>
  );
}

SwitchThumb.displayName = "SwitchThumb";

export function SwitchIcon({ when, children, className, ...rest }: SwitchIconProps) {
  const ctx = useSwitchTrackContext();
  const slotClassNames = useSwitchClassNames();
  const iconRef = when === "off" ? ctx.iconOffRef : ctx.iconOnRef;
  const visible = when === "off" ? !ctx.checked : ctx.checked;

  return (
    <SelectionThumb.Icon
      iconRef={iconRef}
      size={ctx.size}
      gloss={ctx.gloss}
      className={cn(SWITCH_ICON_BASE_CLASS, slotClassNames.icon, className)}
      style={{ opacity: visible ? 1 : 0 }}
      {...rest}
    >
      {children}
    </SelectionThumb.Icon>
  );
}

SwitchIcon.displayName = "SwitchIcon";


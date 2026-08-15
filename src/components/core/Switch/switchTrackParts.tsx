import { useCallback, useMemo, useRef, type RefObject } from "react";

import { SelectionThumb } from "@/components/core/SelectionThumb";
import { mergeRefs } from "@/components/core/utils/mergeRefs";
import { mergeMotionSlotMaps, useMotionPart } from "@/components/core/utils/slotMotion";

import "@/components/core/utils/glossPanel.css";

import { SWITCH_MOTION_DEFAULTS, useSwitchTrackAnimations } from "./switchAnimations";
import {
  SwitchMotionProvider,
  SwitchTrackProvider,
  useOptionalSwitchMotionScope,
  useSwitchClassNames,
  useSwitchMotionScope,
  useSwitchTrackContext,
} from "./switchContext";
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
  motion,
  size,
  thickness,
  ...rest
}: SwitchTrackProps) {
  const parentScope = useOptionalSwitchMotionScope();
  const merged = mergeMotionSlotMaps(parentScope?.getRootMotion(), motion);
  const travelPxRef = useRef(0);
  const getTravelPx = useCallback(() => travelPxRef.current, []);

  return (
    <SwitchMotionProvider
      motion={merged}
      defaults={SWITCH_MOTION_DEFAULTS}
      params={{ getTravelPx }}
    >
      <SwitchTrackHost
        size={size}
        thickness={thickness}
        travelPxRef={travelPxRef}
        {...rest}
      />
    </SwitchMotionProvider>
  );
}

SwitchTrack.displayName = "SwitchTrack";

function SwitchTrackHost({
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
  travelPxRef,
  ...rest
}: Omit<SwitchTrackProps, "motion"> & { travelPxRef: RefObject<number> }) {
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
    travelPxRef,
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

export function SwitchFill({ className, style, motion, ...rest }: SwitchFillProps) {
  const ctx = useSwitchTrackContext();
  const slotClassNames = useSwitchClassNames();
  const trackFillStyle = switchFillColorStyle(ctx.color);
  const { setRef } = useMotionPart<HTMLSpanElement>({
    scope: useSwitchMotionScope(),
    slot: "fill",
    motion,
  });

  return (
    <span
      ref={mergeRefs(ctx.trackFillRef, setRef)}
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

export function SwitchThumb({ className, children, motion, ...rest }: SwitchThumbProps) {
  const ctx = useSwitchTrackContext();
  const slotClassNames = useSwitchClassNames();
  const { setRef } = useMotionPart<HTMLSpanElement>({
    scope: useSwitchMotionScope(),
    slot: "thumb",
    motion,
  });

  return (
    <span
      ref={mergeRefs(ctx.thumbRef, setRef)}
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

export function SwitchIcon({ when, children, className, motion, ...rest }: SwitchIconProps) {
  const ctx = useSwitchTrackContext();
  const slotClassNames = useSwitchClassNames();
  const iconRef = when === "off" ? ctx.iconOffRef : ctx.iconOnRef;
  const visible = when === "off" ? !ctx.checked : ctx.checked;
  const { setRef } = useMotionPart<HTMLSpanElement>({
    scope: useSwitchMotionScope(),
    slot: when === "off" ? "iconOff" : "iconOn",
    motion,
  });

  return (
    <SelectionThumb.Icon
      iconRef={mergeRefs(iconRef, setRef)}
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

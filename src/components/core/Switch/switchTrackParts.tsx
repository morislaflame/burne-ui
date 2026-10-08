import { useCallback, useMemo, useRef, type RefObject } from "react";
 
import { SelectionThumb } from "@/components/core/SelectionThumb";
import { useSkinRegistryRevision, useSkinVariant } from "@/skins/skinContext";
import { mergeRefs } from "@/components/core/utils/mergeRefs";
import { mergeMotionSlotMaps, mergeMotionRootSiblings, hasPointerPhases, useMotionPart, useOptionalEnterOnMount } from "@/components/core/utils/slotMotion";
 
import { resolveSwitchMotionDefaults, useSwitchTrackAnimations } from "./switchAnimations";
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
  SWITCH_ICON_BASE_CLASS,
  SWITCH_THUMB_BASE_CLASS,
  switchFillColorStyle,
  switchFillSurfaceClass,
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
  motionController,
  motionState,
  motionPayload,
  playInitialState,
  size,
  thickness,
  variant: variantProp,
  ...rest
}: SwitchTrackProps) {
  const variant = useSkinVariant(variantProp);
  const parentScope = useOptionalSwitchMotionScope();
  const mergedSlots = mergeMotionSlotMaps(parentScope?.getRootMotion(), motion);
  const siblings = mergeMotionRootSiblings({
    events: parentScope?.getEvents(),
    states: parentScope?.getStates(),
  });
  const merged = { ...mergedSlots, ...siblings };
  const travelPxRef = useRef(0);
  const getTravelPx = useCallback(() => travelPxRef.current, []);
  const skinRevision = useSkinRegistryRevision();
  const motionDefaults = useMemo(() => {
    void skinRevision;
    return resolveSwitchMotionDefaults(variant);
  }, [skinRevision, variant]);

  return (
    <SwitchMotionProvider
      motion={merged}
      defaults={motionDefaults}
      params={{ getTravelPx }}
      controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}
    >
      <SwitchTrackHost
        size={size}
        thickness={thickness}
        variant={variant}
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
  variant: variantProp,
  squeezeToken = 0,
  iconOff,
  iconOn,
  className,
  classNames: trackClassNames,
  children,
  travelPxRef,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
  ...rest
}: Omit<SwitchTrackProps, "motion" | "motionController" | "motionState" | "motionPayload" | "playInitialState"> & { travelPxRef: RefObject<number> }) {
  const variant = useSkinVariant(variantProp);
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
 
  const scope = useSwitchMotionScope();
  const trackPointer = hasPointerPhases(scope.getRootMotion()?.track);
  const trackPart = useMotionPart<HTMLSpanElement>({
    scope,
    slot: "track",
    pointerPhases: trackPointer,
    pressPhases: trackPointer,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });
  useOptionalEnterOnMount(scope, "track", trackPart.targetRef);
 
  const ctx = useMemo<SwitchTrackContextValue>(
    () => ({
      checked,
      disabled,
      size,
      color,
      variant,
      trackFillRef,
      thumbRef,
      thumbShellRef,
      iconOffRef,
      iconOnRef,
    }),
    [checked, color, disabled, size, variant],
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
        ref={mergeRefs(trackRef, trackPart.setRef)}
        className={switchTrackClass({
          size,
          thickness,
          variant,
          slotClass: slotClassNames.track,
          className,
        })}
        style={switchTrackCustomStyle(thickness)}
        aria-hidden
        {...rest}
        {...trackPart.pointerHandlers}
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
        !ctx.color && switchFillSurfaceClass(ctx.variant),
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
        slotClassNames.thumb,
        className,
      )}
      {...rest}
    >
      <SelectionThumb
        size={ctx.size}
        variant={ctx.variant}
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
      variant={ctx.variant}
      className={cn(
        SWITCH_ICON_BASE_CLASS,
        when === "off" ? slotClassNames.iconOff : slotClassNames.iconOn,
        className,
      )}
      style={{ opacity: visible ? 1 : 0 }}
      {...rest}
    >
      {children}
    </SelectionThumb.Icon>
  );
}
 
SwitchIcon.displayName = "SwitchIcon";
 
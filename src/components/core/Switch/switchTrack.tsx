import { animate, remove } from "animejs";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
  type RefObject,
} from "react";

import {
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import {
  MOTION_INTERACTIVE_EASE,
  MOTION_INTERACTIVE_MS,
  MOTION_SWITCH_THUMB_EASE,
  MOTION_SWITCH_THUMB_MS,
} from "@/components/core/utils/motionTokens";
import { sliderThicknessToCss } from "@/components/core/Slider/sliderThickness";
import { SelectionThumb, SelectionThumbIcon } from "@/components/core/SelectionThumb";
import { cn } from "@/utils/cn";

import {
  SWITCH_LAYOUT,
  measureSwitchTravel,
  resolveFallbackThumbPx,
  type SwitchSize,
} from "./switchGeometry";

type SwitchTrackContextValue = {
  checked: boolean;
  disabled?: boolean;
  size: SwitchSize;
  color?: string;
  trackFillRef: RefObject<HTMLSpanElement | null>;
  thumbRef: RefObject<HTMLSpanElement | null>;
  thumbShellRef: RefObject<HTMLSpanElement | null>;
  thumbFillRef: RefObject<HTMLSpanElement | null>;
  iconOffRef: RefObject<HTMLSpanElement | null>;
  iconOnRef: RefObject<HTMLSpanElement | null>;
};

const SwitchTrackContext = createContext<SwitchTrackContextValue | null>(null);

export function useSwitchTrackContext() {
  const ctx = useContext(SwitchTrackContext);
  if (!ctx) {
    throw new Error("Switch.Track, Switch.Fill, Switch.Thumb, Switch.Icon — внутри Switch.Track");
  }
  return ctx;
}

export type SwitchTrackProps = HTMLAttributes<HTMLSpanElement> & {
  size: SwitchSize;
  thickness?: number | string;
  /** Задаётся `<Switch.Control>`; в compound-разметке можно опустить. */
  checked?: boolean;
  disabled?: boolean;
  color?: string;
  squeezeToken?: number;
  iconOff?: ReactNode;
  iconOn?: ReactNode;
};

export function SwitchTrack({
  size,
  thickness,
  checked = false,
  disabled,
  color,
  squeezeToken = 0,
  iconOff,
  iconOn,
  className,
  children,
  ...rest
}: SwitchTrackProps) {
  const sz = SWITCH_LAYOUT[size];
  const thicknessCss = thickness != null ? sliderThicknessToCss(thickness) : undefined;
  const fallbackTravelPx = useMemo(
    () => resolveFallbackThumbPx(thickness, size),
    [size, thickness],
  );
  const travelPxRef = useRef(fallbackTravelPx);

  const trackRef = useRef<HTMLSpanElement>(null);
  const trackFillRef = useRef<HTMLSpanElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const thumbShellRef = useRef<HTMLSpanElement>(null);
  const thumbFillRef = useRef<HTMLSpanElement>(null);
  const iconOffRef = useRef<HTMLSpanElement>(null);
  const iconOnRef = useRef<HTMLSpanElement>(null);
  const trackFillFirstLayoutRef = useRef(true);
  const thumbFirstLayoutRef = useRef(true);
  const reduceMotion = prefersReducedInteractiveHoverLift();

  const syncThumbPosition = useCallback(
    (nextChecked: boolean, travelPx: number) => {
      const thumb = thumbRef.current;
      if (!thumb) return;

      const targetX = nextChecked ? travelPx : 0;

      if (reduceMotion || thumbFirstLayoutRef.current) {
        thumbFirstLayoutRef.current = false;
        remove(thumb);
        thumb.style.transform = `translate(${targetX}px, 0)`;
        return;
      }

      remove(thumb);
      void animate(thumb, {
        translateX: targetX,
        duration: MOTION_SWITCH_THUMB_MS,
        ease: MOTION_SWITCH_THUMB_EASE,
      });
    },
    [reduceMotion],
  );

  useLayoutEffect(() => {
    travelPxRef.current = fallbackTravelPx;
    syncThumbPosition(checked, travelPxRef.current);
  }, [checked, fallbackTravelPx, syncThumbPosition]);

  useLayoutEffect(() => {
    const track = trackRef.current;
    const thumb = thumbShellRef.current;
    if (!track || !thumb) return;

    const update = () => {
      travelPxRef.current = measureSwitchTravel(track, thumb);
      syncThumbPosition(checked, travelPxRef.current);
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(track);
    ro.observe(thumb);
    return () => ro.disconnect();
  }, [checked, size, syncThumbPosition, thickness, fallbackTravelPx]);

  useEffect(() => {
    return () => {
      for (const el of [
        trackFillRef.current,
        thumbRef.current,
        thumbShellRef.current,
        thumbFillRef.current,
        iconOffRef.current,
        iconOnRef.current,
        trackRef.current,
      ]) {
        if (el) remove(el);
      }
    };
  }, []);

  useLayoutEffect(() => {
    const trackFill = trackFillRef.current;
    if (!trackFill) return;

    if (reduceMotion) {
      remove(trackFill);
      trackFill.style.opacity = checked ? "1" : "0";
      return;
    }

    if (trackFillFirstLayoutRef.current) {
      trackFillFirstLayoutRef.current = false;
      remove(trackFill);
      trackFill.style.opacity = checked ? "1" : "0";
      return;
    }

    remove(trackFill);
    void animate(trackFill, {
      opacity: checked ? [0, 1] : [1, 0],
      duration: MOTION_INTERACTIVE_MS,
      ease: MOTION_INTERACTIVE_EASE,
    });
  }, [checked, reduceMotion]);

  useLayoutEffect(() => {
    if (!iconOffRef.current && !iconOnRef.current) return;

    if (reduceMotion) {
      if (iconOffRef.current) {
        remove(iconOffRef.current);
        iconOffRef.current.style.opacity = checked ? "0" : "1";
      }
      if (iconOnRef.current) {
        remove(iconOnRef.current);
        iconOnRef.current.style.opacity = checked ? "1" : "0";
      }
      return;
    }

    if (iconOffRef.current) {
      remove(iconOffRef.current);
      void animate(iconOffRef.current, {
        opacity: checked ? [1, 0] : [0, 1],
        scale: checked ? [1, 0.88] : [0.88, 1],
        duration: MOTION_INTERACTIVE_MS,
        ease: MOTION_INTERACTIVE_EASE,
      });
    }
    if (iconOnRef.current) {
      remove(iconOnRef.current);
      void animate(iconOnRef.current, {
        opacity: checked ? [0, 1] : [1, 0],
        scale: checked ? [0.88, 1] : [1, 0.88],
        duration: MOTION_INTERACTIVE_MS,
        ease: MOTION_INTERACTIVE_EASE,
      });
    }
  }, [checked, reduceMotion]);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    remove(track);
    track.style.opacity = disabled ? "0.48" : "1";
  }, [disabled]);

  useLayoutEffect(() => {
    if (squeezeToken === 0 || reduceMotion) return;
    const shell = thumbShellRef.current;
    if (!shell) return;
    void animateInteractivePressSqueeze(shell);
  }, [reduceMotion, squeezeToken]);

  const customTrackStyle = useMemo((): CSSProperties | undefined => {
    if (thicknessCss == null) return undefined;
    return {
      height: thicknessCss,
      minHeight: thicknessCss,
      width: `calc(2 * (${thicknessCss}))`,
      minWidth: `calc(2 * (${thicknessCss}))`,
    };
  }, [thicknessCss]);

  const ctx = useMemo(
    (): SwitchTrackContextValue => ({
      checked,
      disabled,
      size,
      color,
      trackFillRef,
      thumbRef,
      thumbShellRef,
      thumbFillRef,
      iconOffRef,
      iconOnRef,
    }),
    [checked, color, disabled, size],
  );

  const defaultBody = (
    <>
      <SwitchFill />
      <SwitchThumb>
        {iconOff != null ? (
          <SwitchIcon when="off">{iconOff}</SwitchIcon>
        ) : null}
        {iconOn != null ? (
          <SwitchIcon when="on">{iconOn}</SwitchIcon>
        ) : null}
      </SwitchThumb>
    </>
  );

  return (
    <SwitchTrackContext.Provider value={ctx}>
      <span
        ref={trackRef}
        className={cn(
          "relative box-border inline-flex shrink-0 rounded-full",
          thickness == null && sz.track,
          "bg-[color-mix(in_oklab,var(--color-border)_40%,var(--color-surface))]",
          className,
        )}
        style={customTrackStyle}
        aria-hidden
        {...rest}
      >
        {children ?? defaultBody}
      </span>
    </SwitchTrackContext.Provider>
  );
}

SwitchTrack.displayName = "SwitchTrack";

export type SwitchFillProps = HTMLAttributes<HTMLSpanElement>;

export function SwitchFill({ className, style, ...rest }: SwitchFillProps) {
  const ctx = useSwitchTrackContext();
  const trackFillStyle = useMemo((): CSSProperties | undefined => {
    if (!ctx.color) return undefined;
    return { background: ctx.color };
  }, [ctx.color]);

  return (
    <span
      ref={ctx.trackFillRef}
      aria-hidden
      className={cn(
        "pointer-events-none absolute inset-0 rounded-full",
        !ctx.color && "bg-accent",
        className,
      )}
      style={{ opacity: 0, ...trackFillStyle, ...style }}
      {...rest}
    />
  );
}

SwitchFill.displayName = "SwitchFill";

export type SwitchThumbProps = HTMLAttributes<HTMLSpanElement> & {
  children?: ReactNode;
};

export function SwitchThumb({ className, children, ...rest }: SwitchThumbProps) {
  const ctx = useSwitchTrackContext();

  return (
    <span
      ref={ctx.thumbRef}
      className={cn(
        "absolute inset-y-0 left-0 aspect-square h-full w-auto will-change-transform flex",
        className,
      )}
      {...rest}
    >
      <SelectionThumb
        active={ctx.checked}
        size={ctx.size}
        shellRef={ctx.thumbShellRef}
        fillRef={ctx.thumbFillRef}
      >
        {children}
      </SelectionThumb>
    </span>
  );
}

SwitchThumb.displayName = "SwitchThumb";

export type SwitchIconWhen = "off" | "on";

export type SwitchIconProps = HTMLAttributes<HTMLSpanElement> & {
  when: SwitchIconWhen;
  children?: ReactNode;
};

export function SwitchIcon({ when, children, className, ...rest }: SwitchIconProps) {
  const ctx = useSwitchTrackContext();
  const iconRef = when === "off" ? ctx.iconOffRef : ctx.iconOnRef;
  const highlighted = when === "on";
  const visible = when === "off" ? !ctx.checked : ctx.checked;

  return (
    <SelectionThumbIcon
      iconRef={iconRef}
      size={ctx.size}
      highlighted={highlighted}
      className={cn("absolute inset-0 flex items-center justify-center", className)}
      style={{ opacity: visible ? 1 : 0 }}
      {...rest}
    >
      {children}
    </SelectionThumbIcon>
  );
}

SwitchIcon.displayName = "SwitchIcon";

import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
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

import "../utils/glossPanel.css";
import {
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import {
  motionInteractive,
  motionSwitchThumb,
} from "@/components/core/utils/motionConfig";
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
  gloss?: boolean;
  trackFillRef: RefObject<HTMLSpanElement | null>;
  thumbRef: RefObject<HTMLSpanElement | null>;
  thumbShellRef: RefObject<HTMLSpanElement | null>;
  thumbFillRef: RefObject<HTMLSpanElement | null>;
  iconOffRef: RefObject<HTMLSpanElement | null>;
  iconOnRef: RefObject<HTMLSpanElement | null>;
};

const SwitchTrackContext = createContext<SwitchTrackContextValue | null>(null);

function useSwitchTrackContext() {
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
  /** Gloss-вариант: стеклянный трек и кружок. */
  gloss?: boolean;
};

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
        killMotion(thumb);
        thumb.style.transform = `translate(${targetX}px, 0)`;
        return;
      }

      killMotion(thumb);
      void gsap.to(thumb, { x: targetX, ...motionSwitchThumb(), overwrite: "auto" });
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
    const trackFill = trackFillRef.current;
    const thumb = thumbRef.current;
    const thumbShell = thumbShellRef.current;
    const thumbFill = thumbFillRef.current;
    const iconOff = iconOffRef.current;
    const iconOn = iconOnRef.current;
    const track = trackRef.current;
    return () => {
      for (const el of [trackFill, thumb, thumbShell, thumbFill, iconOff, iconOn, track]) {
        if (el) killMotion(el);
      }
    };
  }, []);

  useLayoutEffect(() => {
    const trackFill = trackFillRef.current;
    if (!trackFill) return;

    if (reduceMotion) {
      killMotion(trackFill);
      trackFill.style.opacity = checked ? "1" : "0";
      return;
    }

    if (trackFillFirstLayoutRef.current) {
      trackFillFirstLayoutRef.current = false;
      killMotion(trackFill);
      trackFill.style.opacity = checked ? "1" : "0";
      return;
    }

    killMotion(trackFill);
    if (checked) {
      void gsap.fromTo(trackFill, { autoAlpha: 0 }, { autoAlpha: 1, ...motionInteractive(), overwrite: "auto" });
    } else {
      void gsap.to(trackFill, { autoAlpha: 0, ...motionInteractive(), overwrite: "auto" });
    }
  }, [checked, reduceMotion]);

  useLayoutEffect(() => {
    if (!iconOffRef.current && !iconOnRef.current) return;

    if (reduceMotion) {
      if (iconOffRef.current) {
        killMotion(iconOffRef.current);
        iconOffRef.current.style.opacity = checked ? "0" : "1";
      }
      if (iconOnRef.current) {
        killMotion(iconOnRef.current);
        iconOnRef.current.style.opacity = checked ? "1" : "0";
      }
      return;
    }

    if (iconOffRef.current) {
      killMotion(iconOffRef.current);
      if (checked) {
        void gsap.to(iconOffRef.current, { autoAlpha: 0, scale: 0.88, ...motionInteractive(), overwrite: "auto" });
      } else {
        void gsap.fromTo(iconOffRef.current, { autoAlpha: 0, scale: 0.88 }, { autoAlpha: 1, scale: 1, ...motionInteractive(), overwrite: "auto" });
      }
    }
    if (iconOnRef.current) {
      killMotion(iconOnRef.current);
      if (checked) {
        void gsap.fromTo(iconOnRef.current, { autoAlpha: 0, scale: 0.88 }, { autoAlpha: 1, scale: 1, ...motionInteractive(), overwrite: "auto" });
      } else {
        void gsap.to(iconOnRef.current, { autoAlpha: 0, scale: 0.88, ...motionInteractive(), overwrite: "auto" });
      }
    }
  }, [checked, reduceMotion]);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    killMotion(track);
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
      gloss,
      trackFillRef,
      thumbRef,
      thumbShellRef,
      thumbFillRef,
      iconOffRef,
      iconOnRef,
    }),
    [checked, color, disabled, gloss, size],
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
          gloss
            ? "gloss-indicator border-0"
            : "bg-[color-mix(in_oklab,var(--color-border)_40%,var(--color-surface))]",
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
        ctx.gloss ? "z-[1]" : undefined,
        !ctx.color && "bg-primary",
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
        ctx.gloss ? "z-[2]" : undefined,
        className,
      )}
      {...rest}
    >
      <SelectionThumb
        active={ctx.checked}
        size={ctx.size}
        gloss={ctx.gloss}
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
      gloss={ctx.gloss}
      className={cn("absolute inset-0 flex items-center justify-center", className)}
      style={{ opacity: visible ? 1 : 0 }}
      {...rest}
    >
      {children}
    </SelectionThumbIcon>
  );
}

SwitchIcon.displayName = "SwitchIcon";

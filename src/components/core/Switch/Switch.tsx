import { animate, remove } from "animejs";
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type CSSProperties,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  type PointerEvent,
  type ReactNode,
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
import { sliderThicknessToCss } from "@/components/core/Slider/Slider";
import { Text, type TextVariant } from "@/components/core/Text";
import { cn } from "@/utils/cn";

export type SwitchSize = "small" | "base" | "medium" | "large";
export type SwitchLabelPosition = "left" | "right";

/** Диаметр кружка по `size` (px), если `thickness` не задан. */
const THUMB_PX: Record<SwitchSize, number> = {
  small: 14,
  base: 18,
  medium: 24,
  large: 28,
};

/** Fallback для геометрии до первого измерения DOM. */
function resolveFallbackThumbPx(
  thickness: number | string | undefined,
  size: SwitchSize,
): number {
  if (thickness == null) return THUMB_PX[size];
  if (typeof thickness === "number") return thickness;
  const trimmed = thickness.trim();
  const pxMatch = /^([\d.]+)px$/i.exec(trimmed);
  if (pxMatch) return Number.parseFloat(pxMatch[1]!);
  const remMatch = /^([\d.]+)rem$/i.exec(trimmed);
  if (remMatch && typeof document !== "undefined") {
    const root =
      Number.parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    return Number.parseFloat(remMatch[1]!) * root;
  }
  return THUMB_PX[size];
}

function resolveFallbackTravelPx(
  thickness: number | string | undefined,
  size: SwitchSize,
  padPx: number,
): number {
  const thumbPx = resolveFallbackThumbPx(thickness, size);
  const trackHeightPx = thumbPx + 2 * padPx;
  return 2 * trackHeightPx - thumbPx - 2 * padPx;
}

function measureSwitchTravel(
  trackEl: HTMLElement,
  thumbEl: HTMLElement,
  padPx: number,
): number {
  const trackW = trackEl.getBoundingClientRect().width;
  const thumbW = thumbEl.getBoundingClientRect().width;
  return Math.max(0, trackW - thumbW - 2 * padPx);
}

const SWITCH_LAYOUT: Record<
  SwitchSize,
  {
    track: string;
    thumb: string;
    travelPx: number;
    padPx: number;
    icon: string;
    title: TextVariant;
    desc: TextVariant;
    gapX: string;
  }
> = {
  small: {
    track: "h-4 w-8",
    thumb: "size-3.5 min-size-3.5",
    travelPx: 16,
    padPx: 1,
    icon: "icon-xsmall",
    title: "small",
    desc: "tools",
    gapX: "gap-x-small",
  },
  base: {
    track: "h-5 w-10",
    thumb: "size-4.5 min-size-4.5",
    travelPx: 20,
    padPx: 1,
    icon: "icon-xsmall",
    title: "base",
    desc: "small",
    gapX: "gap-x-base",
  },
  medium: {
    track: "h-[1.625rem] w-[3.25rem]",
    thumb: "size-6 min-size-6",
    travelPx: 26,
    padPx: 1,
    icon: "icon-base",
    title: "mid",
    desc: "small",
    gapX: "gap-x-plus",
  },
  large: {
    track: "h-[1.875rem] w-14",
    thumb: "size-7 min-size-7",
    travelPx: 26,
    padPx: 1,
    icon: "icon-mid",
    title: "large",
    desc: "base",
    gapX: "gap-x-plus",
  },
};

const INPUT_VISUALLY_HIDDEN =
  "absolute m-[-1px] h-px w-px overflow-hidden border-0 p-0 opacity-0 [clip:rect(0,0,0,0)]";

export type SwitchProps = Omit<
  LabelHTMLAttributes<HTMLLabelElement>,
  "children" | "htmlFor" | "onChange"
> &
  Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "children" | "className"> & {
    /** Подпись рядом с переключателем. */
    label?: ReactNode;
    /** Дополнительная строка под подписью (muted, как hint у `Selector`). */
    description?: ReactNode;
    /** С какой стороны от трека показывать текст. По умолчанию `right`. */
    labelPosition?: SwitchLabelPosition;
    size?: SwitchSize;
    /**
     * Толщина трека и диаметр кружка. Перекрывает cross-axis из `size`.
     * Число — px; строка — любая CSS-длина (`"0.75rem"`, `"12px"`).
     */
    thickness?: number | string;
    /** Иконка в кружке, когда выключен (цвет accent). Если задана хотя бы одна — accent-заливка кружка при включении. */
    iconOff?: ReactNode;
    /** Иконка в кружке, когда включен (цвет accent-foreground на заливке). */
    iconOn?: ReactNode;
    /** Фон трека во включённом состоянии: CSS-цвет или `linear-gradient(...)`. Заливка кружка всегда accent. */
    color?: string;
    className?: string;
  };

function useMergedChecked(
  checked: boolean | undefined,
  defaultChecked: boolean | undefined,
): [boolean, (next: boolean) => void, boolean] {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = useState(Boolean(defaultChecked));
  const value = isControlled ? Boolean(checked) : internal;
  const setValue = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternal(next);
    },
    [isControlled],
  );
  return [value, setValue, isControlled];
}

type SwitchControlProps = {
  size: SwitchSize;
  thickness?: number | string;
  checked: boolean;
  disabled?: boolean;
  iconOff?: ReactNode;
  iconOn?: ReactNode;
  color?: string;
  squeezeToken: number;
};

function SwitchControl({
  size,
  thickness,
  checked,
  disabled,
  iconOff,
  iconOn,
  color,
  squeezeToken,
}: SwitchControlProps) {
  const sz = SWITCH_LAYOUT[size];
  const thicknessCss = thickness != null ? sliderThicknessToCss(thickness) : undefined;
  const fallbackTravelPx = useMemo(
    () =>
      thickness != null
        ? resolveFallbackTravelPx(thickness, size, sz.padPx)
        : sz.travelPx,
    [size, sz.padPx, sz.travelPx, thickness],
  );
  const [travelPx, setTravelPx] = useState(fallbackTravelPx);
  const fillRef = useRef<HTMLSpanElement>(null);
  const iconOffRef = useRef<HTMLSpanElement>(null);
  const iconOnRef = useRef<HTMLSpanElement>(null);
  const thumbShellRef = useRef<HTMLSpanElement>(null);
  const trackRef = useRef<HTMLSpanElement>(null);
  const trackFillRef = useRef<HTMLSpanElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const fillFirstLayoutRef = useRef(true);
  const trackFillFirstLayoutRef = useRef(true);
  const thumbFirstLayoutRef = useRef(true);
  const reduceMotion = prefersReducedInteractiveHoverLift();

  const hasIcons = iconOff != null || iconOn != null;

  useEffect(() => {
    setTravelPx(fallbackTravelPx);
  }, [fallbackTravelPx]);

  useLayoutEffect(() => {
    if (thickness == null) {
      setTravelPx(sz.travelPx);
      return;
    }

    const track = trackRef.current;
    const thumb = thumbShellRef.current;
    if (!track || !thumb) return;

    const update = () => {
      setTravelPx(measureSwitchTravel(track, thumb, sz.padPx));
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(track);
    ro.observe(thumb);
    return () => ro.disconnect();
  }, [size, sz.padPx, sz.travelPx, thickness]);

  useEffect(() => {
    return () => {
      for (const el of [
        fillRef.current,
        iconOffRef.current,
        iconOnRef.current,
        thumbShellRef.current,
        trackRef.current,
        trackFillRef.current,
        thumbRef.current,
      ]) {
        if (el) remove(el);
      }
    };
  }, []);

  useLayoutEffect(() => {
    const thumb = thumbRef.current;
    if (!thumb) return;

    const targetX = checked ? travelPx : 0;

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
  }, [checked, reduceMotion, travelPx]);

  useLayoutEffect(() => {
    const fill = fillRef.current;
    if (!fill) return;

    if (reduceMotion) {
      remove(fill);
      fill.style.transform = `scale(${checked ? 1 : 0})`;
      fill.style.opacity = checked ? "1" : "0";
      return;
    }

    if (fillFirstLayoutRef.current) {
      fillFirstLayoutRef.current = false;
      remove(fill);
      fill.style.transform = `scale(${checked ? 1 : 0})`;
      fill.style.opacity = checked ? "1" : "0";
      return;
    }

    remove(fill);
    void animate(fill, {
      scale: checked ? [0, 1] : [1, 0],
      opacity: checked ? [0, 1] : [1, 0],
      duration: MOTION_INTERACTIVE_MS,
      ease: MOTION_INTERACTIVE_EASE,
    });
  }, [checked, reduceMotion]);

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
    if (!hasIcons) return;

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
  }, [checked, hasIcons, reduceMotion]);

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

  const trackFillStyle = useMemo((): CSSProperties | undefined => {
    if (!color) return undefined;
    return { background: color };
  }, [color]);

  const customTrackStyle = useMemo((): CSSProperties | undefined => {
    if (thicknessCss == null) return undefined;
    const pad = sz.padPx;
    return {
      height: `calc(${thicknessCss} + ${2 * pad}px)`,
      width: `calc(2 * (${thicknessCss} + ${2 * pad}px))`,
    };
  }, [sz.padPx, thicknessCss]);

  const customThumbStyle = useMemo((): CSSProperties | undefined => {
    if (thicknessCss == null) return undefined;
    return {
      width: thicknessCss,
      height: thicknessCss,
      minWidth: thicknessCss,
      minHeight: thicknessCss,
    };
  }, [thicknessCss]);

  return (
    <span
      ref={trackRef}
      className={cn(
        "relative inline-flex shrink-0 rounded-full",
        thickness == null && sz.track,
        "bg-[color-mix(in_oklab,var(--color-border)_40%,var(--color-surface))]",
      )}
      style={customTrackStyle}
      aria-hidden
    >
      <span
        ref={trackFillRef}
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 rounded-full",
          !color && "bg-accent",
        )}
        style={{
          opacity: 0,
          ...trackFillStyle,
        }}
      />
      <span
        ref={thumbRef}
        className="absolute will-change-transform"
        style={{ left: sz.padPx, top: sz.padPx }}
      >
        <span
          ref={thumbShellRef}
          className={cn(
            "relative box-border block origin-center rounded-full border border-accent bg-surface",
            checked && "border-accent",
            thickness == null && sz.thumb,
          )}
          style={customThumbStyle}
        >
          <span
            ref={fillRef}
            aria-hidden
            className="pointer-events-none absolute inset-[1px] z-[0] origin-center rounded-full bg-accent text-accent-foreground"
            style={{
              transform: "scale(0)",
              opacity: 0,
            }}
          />

          {hasIcons ? (
            <>
              {iconOff != null ? (
                <span
                  ref={iconOffRef}
                  aria-hidden
                  className="pointer-events-none absolute inset-[1px] z-[1] flex items-center justify-center text-accent"
                  style={{ opacity: checked ? 0 : 1 }}
                >
                  <span
                    className={cn(
                      "inline-flex shrink-0 items-center justify-center [&_svg]:size-full",
                      sz.icon,
                    )}
                  >
                    {iconOff}
                  </span>
                </span>
              ) : null}
              {iconOn != null ? (
                <span
                  ref={iconOnRef}
                  aria-hidden
                  className="pointer-events-none absolute inset-[1px] z-[1] flex items-center justify-center text-accent-foreground"
                  style={{ opacity: checked ? 1 : 0 }}
                >
                  <span
                    className={cn(
                      "inline-flex shrink-0 items-center justify-center [&_svg]:size-full",
                      sz.icon,
                    )}
                  >
                    {iconOn}
                  </span>
                </span>
              ) : null}
            </>
          ) : null}
        </span>
      </span>
    </span>
  );
}

export const Switch = forwardRef<HTMLLabelElement, SwitchProps>(function Switch(
  {
    label,
    description,
    labelPosition = "right",
    size = "base",
    iconOff,
    iconOn,
    color,
    thickness,
    className,
    disabled,
    checked,
    defaultChecked,
    onChange,
    id: idProp,
    name,
    value,
    required,
    form,
    autoFocus,
    tabIndex,
    readOnly,
    onBlur,
    onFocus,
    onPointerDown,
    ...labelRest
  },
  ref,
) {
  const autoId = useId();
  const inputId = idProp ?? `switch-${autoId}`;
  const descriptionId = `${inputId}-description`;

  const [mergedChecked, setMergedChecked, isControlled] = useMergedChecked(
    checked,
    defaultChecked,
  );
  const [squeezeToken, setSqueezeToken] = useState(0);

  const sz = SWITCH_LAYOUT[size];
  const hasDescription = description != null;
  const hasLabel = label != null;
  const labelOnLeft = labelPosition === "left";

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const next = e.target.checked;
      if (!isControlled) setMergedChecked(next);
      onChange?.(e);
    },
    [isControlled, onChange, setMergedChecked],
  );

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLLabelElement>) => {
      onPointerDown?.(e);
      if (e.defaultPrevented || disabled) return;
      setSqueezeToken((t) => t + 1);
    },
    [disabled, onPointerDown],
  );

  const switchCell = (
    <span
      className={cn(
        "relative col-start-1 row-start-1 inline-flex shrink-0 justify-self-start self-center",
        labelOnLeft && hasLabel && "col-start-2",
      )}
    >
      <SwitchControl
        size={size}
        thickness={thickness}
        checked={mergedChecked}
        disabled={disabled}
        iconOff={iconOff}
        iconOn={iconOn}
        color={color}
        squeezeToken={squeezeToken}
      />
    </span>
  );

  const textCell = hasLabel ? (
    hasDescription ? (
      <span
        className={cn(
          "col-span-1 grid min-w-0 max-w-full origin-center justify-self-start self-center [width:fit-content]",
          labelOnLeft ? "col-start-1 row-span-2 row-start-1" : "col-start-2 row-span-2 row-start-1",
          "grid-rows-[auto_auto] gap-y-xsmall",
        )}
      >
        <Text
          as="span"
          variant={sz.title}
          inheritColor
          className={cn("min-w-0 font-medium leading-snug", disabled && "text-muted")}
        >
          {label}
        </Text>
        <Text
          as="span"
          id={descriptionId}
          variant={sz.desc}
          inheritColor
          className={cn("min-w-0 leading-snug text-muted", disabled && "text-muted")}
        >
          {description}
        </Text>
      </span>
    ) : (
      <Text
        as="span"
        variant={sz.title}
        inheritColor
        className={cn(
          "col-start-2 row-start-1 min-w-0 max-w-full self-center font-medium leading-snug [width:fit-content] justify-self-start",
          labelOnLeft && "col-start-1",
          disabled && "text-muted",
        )}
      >
        {label}
      </Text>
    )
  ) : null;

  return (
    <label
      ref={ref}
      className={cn(
        "relative inline-grid cursor-pointer select-none rounded-small text-left",
        hasLabel
          ? cn(
              labelOnLeft
                ? "grid-cols-[minmax(0,1fr)_auto]"
                : "grid-cols-[auto_minmax(0,1fr)]",
              hasDescription ? "grid-rows-[auto_auto] gap-y-xsmall" : "grid-rows-[auto]",
              sz.gapX,
            )
          : "grid-cols-[auto] grid-rows-[auto]",
        disabled && "cursor-not-allowed",
        "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent",
        className,
      )}
      {...labelRest}
      onPointerDown={handlePointerDown}
    >
      <input
        id={inputId}
        type="checkbox"
        role="switch"
        className={INPUT_VISUALLY_HIDDEN}
        checked={isControlled ? mergedChecked : undefined}
        defaultChecked={!isControlled ? defaultChecked : undefined}
        disabled={disabled}
        name={name}
        value={value}
        required={required}
        form={form}
        autoFocus={autoFocus}
        tabIndex={tabIndex}
        readOnly={readOnly}
        onBlur={onBlur}
        onFocus={onFocus}
        aria-describedby={hasDescription ? descriptionId : undefined}
        onChange={handleChange}
      />

      {labelOnLeft ? (
        <>
          {textCell}
          {switchCell}
        </>
      ) : (
        <>
          {switchCell}
          {textCell}
        </>
      )}
    </label>
  );
});

Switch.displayName = "Switch";

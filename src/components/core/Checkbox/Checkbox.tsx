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
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  type PointerEvent,
  type ReactNode,
} from "react";
import { IoCheckmarkSharp } from "react-icons/io5";

import {
  animateInteractiveHoverLift,
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
  useInteractiveHoverLiftContainerHandlers,
} from "@/components/core/utils/hoverInteractiveLift";
import {
  MOTION_INTERACTIVE_EASE,
  MOTION_INTERACTIVE_MS,
} from "@/components/core/utils/motionTokens";
import { Text, type TextVariant } from "@/components/core/Text";
import { cn } from "@/utils/cn";

/** Внешний вид обода кружка в состоянии «не отмечено». `outline` — «o», акцентная обводка. */
export type CheckboxVariant = "default" | "secondary" | "outline";

export type CheckboxSize = "small" | "base" | "medium" | "large";

const CHECKBOX_LABEL_HOVER_SCALE = 1.02;

const VARIANT_TRACK: Record<CheckboxVariant, string> = {
  /** Как `Button` default: `border border-base` + фон оболочки (пустой кружок). */
  default: "border border-base bg-surface",
  /** Как `Button` secondary: `surface-secondary` (бордер 1px из утилиты). */
  secondary: "surface-secondary",
  /** Как `Button` outline: `surface-outline` (бордер `border-base`, не акцентный). */
  outline: "surface-outline",
};

const SIZE_LAYOUT: Record<
  CheckboxSize,
  {
    track: string;
    checkWrap: string;
    title: TextVariant;
    desc: TextVariant;
    /** Горизонтальный зазор между кружком и текстом (`grid` / `flex`). */
    gridGapX: string;
  }
> = {
  small: {
    track: "h-4 w-4 min-h-4 min-w-4",
    checkWrap: "icon-xsmall",
    title: "small",
    desc: "tools",
    gridGapX: "gap-x-small",
  },
  base: {
    track: "h-4.5 w-4.5 min-h-4.5 min-w-4.5",
    checkWrap: "icon-small",
    title: "base",
    desc: "small",
    gridGapX: "gap-x-base",
  },
  medium: {
    track: "h-6 w-6 min-h-6 min-w-6",
    checkWrap: "icon-base",
    title: "mid",
    desc: "small",
    gridGapX: "gap-x-plus",
  },
  large: {
    track: "h-7 w-7 min-h-7 min-w-7",
    checkWrap: "icon-mid",
    title: "large",
    desc: "base",
    gridGapX: "gap-x-plus",
  },
};

const INPUT_VISUALLY_HIDDEN =
  "absolute m-[-1px] h-px w-px overflow-hidden border-0 p-0 opacity-0 [clip:rect(0,0,0,0)]";

export type CheckboxProps = Omit<
  LabelHTMLAttributes<HTMLLabelElement>,
  "children" | "htmlFor" | "onChange"
> &
  Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "children" | "className"> & {
    /** Подпись справа от индикатора. */
    label: ReactNode;
    /** Дополнительная строка под заголовком; цвет всегда приглушённый. */
    description?: ReactNode;
    size?: CheckboxSize;
    variant?: CheckboxVariant;
    /** Иконка внутри залитого кружка. По умолчанию галочка `IoCheckmark`. */
    checkIcon?: ReactNode;
    /** Заголовок в цвете danger (подзаголовок остаётся muted). */
    danger?: boolean;
    /** className на корневой `<label>`. */
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

export const Checkbox = forwardRef<HTMLLabelElement, CheckboxProps>(function Checkbox(
  {
    label,
    description,
    size = "base",
    variant = "default",
    checkIcon,
    danger = false,
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
  const inputId = idProp ?? `checkbox-${autoId}`;
  const descriptionId = `${inputId}-description`;

  const [mergedChecked, setMergedChecked, isControlled] = useMergedChecked(checked, defaultChecked);

  const fillRef = useRef<HTMLSpanElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  const trackRef = useRef<HTMLSpanElement>(null);
  const textColRef = useRef<HTMLSpanElement>(null);
  const firstLayoutRef = useRef(true);
  const trackFirstLayoutRef = useRef(true);

  const sz = SIZE_LAYOUT[size];
  const reduceMotion = prefersReducedInteractiveHoverLift();

  const hoverHandlers = useInteractiveHoverLiftContainerHandlers(
    textColRef,
    !disabled,
    undefined,
    CHECKBOX_LABEL_HOVER_SCALE,
  );

  useEffect(() => {
    return () => {
      const nodes = [fillRef.current, iconRef.current, trackRef.current, textColRef.current];
      for (const el of nodes) {
        if (el) remove(el);
      }
    };
  }, []);

  useLayoutEffect(() => {
    const fill = fillRef.current;
    const icon = iconRef.current;
    if (!fill || !icon) return;

    if (reduceMotion) {
      remove(fill);
      remove(icon);
      fill.style.transform = `scale(${mergedChecked ? 1 : 0})`;
      fill.style.opacity = mergedChecked ? "1" : "0";
      icon.style.opacity = mergedChecked ? "1" : "0";
      icon.style.transform = "scale(1)";
      return;
    }

    if (firstLayoutRef.current) {
      firstLayoutRef.current = false;
      remove(fill);
      remove(icon);
      fill.style.transform = `scale(${mergedChecked ? 1 : 0})`;
      fill.style.opacity = mergedChecked ? "1" : "0";
      icon.style.opacity = mergedChecked ? "1" : "0";
      icon.style.transform = "scale(1)";
      return;
    }

    remove(fill);
    remove(icon);
    void animate(fill, {
      scale: mergedChecked ? [0, 1] : [1, 0],
      opacity: mergedChecked ? [0, 1] : [1, 0],
      duration: MOTION_INTERACTIVE_MS,
      ease: MOTION_INTERACTIVE_EASE,
    });
    void animate(icon, {
      opacity: mergedChecked ? [0, 1] : [1, 0],
      scale: mergedChecked ? [0.88, 1] : [1, 0.92],
      duration: MOTION_INTERACTIVE_MS,
      ease: MOTION_INTERACTIVE_EASE,
    });
  }, [mergedChecked, reduceMotion]);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    if (reduceMotion) {
      remove(track);
      track.style.opacity = disabled ? "0.48" : "1";
      return;
    }

    if (trackFirstLayoutRef.current) {
      trackFirstLayoutRef.current = false;
      track.style.opacity = disabled ? "0.48" : "1";
      return;
    }

    remove(track);
    const from = Number.parseFloat(getComputedStyle(track).opacity);
    const start = Number.isFinite(from) ? from : 1;
    void animate(track, {
      opacity: disabled ? [start, 0.48] : [start, 1],
      duration: MOTION_INTERACTIVE_MS,
      ease: MOTION_INTERACTIVE_EASE,
    });
  }, [disabled, reduceMotion]);

  useEffect(() => {
    const el = textColRef.current;
    if (!el) return;
    if (disabled) {
      remove(el);
      if (reduceMotion) {
        el.style.transform = "";
      } else {
        animateInteractiveHoverLift(el, false, CHECKBOX_LABEL_HOVER_SCALE);
      }
    }
  }, [disabled, reduceMotion]);

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
      if (reduceMotion) return;
      const t = textColRef.current;
      if (!t) return;
      void animateInteractivePressSqueeze(t);
    },
    [disabled, onPointerDown, reduceMotion],
  );

  const hasDescription = description != null;

  const trackClass = useMemo(
    () =>
      cn(
        "relative inline-flex shrink-0 items-center justify-center rounded-full",
        VARIANT_TRACK[variant],
        mergedChecked && "border-accent",
      ),
    [mergedChecked, variant],
  );

  const defaultIcon = <IoCheckmarkSharp aria-hidden className="icon-base" />;

  return (
    <label
      ref={ref}
      className={cn(
        "relative grid cursor-pointer select-none rounded-small",
        "grid-cols-[auto_minmax(0,1fr)]",
        hasDescription ? "grid-rows-[auto_auto] gap-y-xsmall" : "grid-rows-[auto]",
        sz.gridGapX,
        disabled && "cursor-not-allowed",
        "has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-accent",
        className,
      )}
      {...labelRest}
      {...hoverHandlers}
      onPointerDown={handlePointerDown}
    >
      <input
        id={inputId}
        type="checkbox"
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
        aria-describedby={description != null ? descriptionId : undefined}
        onChange={handleChange}
      />

      <span
        ref={trackRef}
        className={cn(
          "relative col-start-1 row-start-1 inline-flex shrink-0 origin-center justify-self-start self-center",
          sz.track,
          trackClass,
        )}
      >
        <span
          ref={fillRef}
          aria-hidden
          className="pointer-events-none absolute inset-[1px] z-[0] flex origin-center items-center justify-center rounded-full bg-accent text-accent-foreground"
          style={{ transform: "scale(0)", opacity: 0 }}
        />
        <span
          ref={iconRef}
          aria-hidden
          className={cn(
            "pointer-events-none relative z-[1] inline-flex items-center justify-center text-accent-foreground [&_svg]:size-full",
            sz.checkWrap,
          )}
          style={{ opacity: 0 }}
        >
          {checkIcon ?? defaultIcon}
        </span>
      </span>

      {hasDescription ? (
        <span
          ref={textColRef}
          className={cn(
            "col-start-2 row-span-2 row-start-1 grid min-w-0 max-w-full origin-center will-change-transform [grid-template-rows:subgrid] [width:fit-content] justify-self-start",
          )}
        >
          <Text
            as="span"
            variant={sz.title}
            inheritColor
            className={cn(
              "min-w-0 self-center",
              disabled && "text-muted",
              !disabled && danger && "text-danger",
            )}
          >
            {label}
          </Text>
          <Text
            as="span"
            id={descriptionId}
            variant={sz.desc}
            inheritColor
            className={cn("min-w-0 text-muted", disabled && "text-muted")}
          >
            {description}
          </Text>
        </span>
      ) : (
        <span
          ref={textColRef}
          className="col-start-2 row-start-1 min-w-0 max-w-full origin-center justify-self-start self-center [width:fit-content] will-change-transform"
        >
          <Text
            as="span"
            variant={sz.title}
            inheritColor
            className={cn(disabled && "text-muted", !disabled && danger && "text-danger")}
          >
            {label}
          </Text>
        </span>
      )}
    </label>
  );
});

Checkbox.displayName = "Checkbox";

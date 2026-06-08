import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type PointerEventHandler,
  type ReactNode,
} from "react";

import { FieldError, FieldHint, FieldRoot } from "@/components/core/Field";
import { fieldErrorId, fieldHintId, joinFieldDescribedBy } from "@/components/core/Field/fieldA11y";
import { Label } from "@/components/core/Label";
import { FieldLabelContext } from "@/components/core/Label/fieldLabelContext";
import { hasCompoundChild } from "@/components/core/utils/hasCompoundChild";
import { hasCompoundChildren } from "@/components/core/utils/hasCompoundChildren";
import {
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/controlSizeLayout";
import type { ComponentSize } from "@/components/core/utils/componentSize";
import { cn } from "@/utils/cn";

// ─── types ────────────────────────────────────────────────────────────────────

export type TimeFieldSize = ComponentSize;
export type TimeFieldStatus = "default" | "danger" | "success" | "warning";
/** `segmented` — сегменты в отдельных «ячейках» внутри оболочки. */
export type TimeFieldVariant = "default" | "outline" | "segmented";
export type TimeFieldFormat = "HH:mm" | "HH:mm:ss";

// ─── context ──────────────────────────────────────────────────────────────────

type TimeFieldCtx = {
  fieldId: string;
  labelId: string;
  hintId: string;
  errorId: string;
  hintConnected: boolean;
  errorConnected: boolean;
  isRequired: boolean;
  status: TimeFieldStatus;
  size: TimeFieldSize;
  variant: TimeFieldVariant;
  compact: boolean;
};

const TimeFieldContext = createContext<TimeFieldCtx | null>(null);

function useTimeFieldContext(): TimeFieldCtx {
  const ctx = useContext(TimeFieldContext);
  if (!ctx) throw new Error("TimeField compound parts must be inside <TimeField>.");
  return ctx;
}

function useOptionalTimeFieldContext() {
  return useContext(TimeFieldContext);
}

// ─── parsing / formatting ─────────────────────────────────────────────────────

type HMS = { h: number; m: number; s: number };

function parseTime(str: string): HMS {
  const parts = str.split(":").map(Number);
  return {
    h: Number.isFinite(parts[0]) ? Math.max(0, Math.min(23, parts[0]!)) : 0,
    m: Number.isFinite(parts[1]) ? Math.max(0, Math.min(59, parts[1]!)) : 0,
    s: Number.isFinite(parts[2]) ? Math.max(0, Math.min(59, parts[2]!)) : 0,
  };
}

function formatTime(hms: HMS, fmt: TimeFieldFormat): string {
  const h = String(hms.h).padStart(2, "0");
  const m = String(hms.m).padStart(2, "0");
  const s = String(hms.s).padStart(2, "0");
  return fmt === "HH:mm:ss" ? `${h}:${m}:${s}` : `${h}:${m}`;
}

// ─── segment config ───────────────────────────────────────────────────────────

type SegId = "h" | "m" | "s";
const SEG_MAX: Record<SegId, number> = { h: 23, m: 59, s: 59 };
const SEG_LABEL: Record<SegId, string> = { h: "часы", m: "минуты", s: "секунды" };

function segValue(hms: HMS, seg: SegId): number {
  return hms[seg];
}

function withSeg(hms: HMS, seg: SegId, val: number): HMS {
  const clamped = Math.max(0, Math.min(SEG_MAX[seg], val));
  return { ...hms, [seg]: clamped };
}

// ─── shell styling (matches Input) ───────────────────────────────────────────

const VARIANT_SHELL: Record<Exclude<TimeFieldVariant, "outline">, string> = {
  default: "bg-surface",
  segmented: "bg-surface",
};

const STATUS_TINT_SHELL: Record<Exclude<TimeFieldStatus, "default">, string> = {
  danger: "bg-surface-tint-danger",
  success: "bg-surface-tint-success",
  warning: "bg-surface-tint-warning",
};

const STATUS_TINT_FOCUS_BORDER: Record<Exclude<TimeFieldStatus, "default">, string> = {
  danger: "focus-within:border-danger",
  success: "focus-within:border-success",
  warning: "focus-within:border-warning",
};

const STATUS_TINT_AFFIX: Record<Exclude<TimeFieldStatus, "default">, string> = {
  danger: "bg-surface-tint-danger-strong",
  success: "bg-surface-tint-success-strong",
  warning: "bg-surface-tint-warning-strong",
};

const AFFIX_SURFACE: Record<TimeFieldVariant, string> = {
  default:
    "bg-[color-mix(in_oklab,var(--color-border)_32%,var(--color-surface))]",
  outline:
    "bg-[color-mix(in_oklab,var(--color-border)_22%,transparent)]",
  segmented:
    "bg-[color-mix(in_oklab,var(--color-border)_32%,var(--color-surface))]",
};

const AFFIX_PADDING: Record<TimeFieldSize, string> = {
  small: `${CONTROL_SIZE_LAYOUT.small.affixPadX} ${CONTROL_SIZE_LAYOUT.small.affixText}`,
  base: `${CONTROL_SIZE_LAYOUT.base.affixPadX} ${CONTROL_SIZE_LAYOUT.base.affixText}`,
  mid: `${CONTROL_SIZE_LAYOUT.mid.affixPadX} ${CONTROL_SIZE_LAYOUT.mid.affixText}`,
  large: `${CONTROL_SIZE_LAYOUT.large.affixPadX} ${CONTROL_SIZE_LAYOUT.large.affixText}`,
};

const SHELL_H: Record<TimeFieldSize, string> = {
  small: CONTROL_SIZE_LAYOUT.small.h,
  base: CONTROL_SIZE_LAYOUT.base.h,
  mid: CONTROL_SIZE_LAYOUT.mid.h,
  large: CONTROL_SIZE_LAYOUT.large.h,
};

function AffixSlot({
  side,
  variant,
  status,
  controlSize,
  children,
}: {
  side: "prefix" | "suffix";
  variant: TimeFieldVariant;
  status: TimeFieldStatus;
  controlSize: TimeFieldSize;
  children: ReactNode;
}) {
  const edge = side === "prefix" ? "border-r border-base" : "border-l border-base";
  const surface =
    status === "default" ? AFFIX_SURFACE[variant] : STATUS_TINT_AFFIX[status];

  return (
    <span
      className={cn(
        "flex h-full shrink-0 items-center text-muted",
        AFFIX_PADDING[controlSize],
        surface,
        edge,
      )}
    >
      {children}
    </span>
  );
}

// ─── TimeFieldControl ─────────────────────────────────────────────────────────

export type TimeFieldControlProps = Omit<
  HTMLAttributes<HTMLFieldSetElement>,
  "onChange" | "prefix" | "suffix"
> & {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  format?: TimeFieldFormat;
  disabled?: boolean;
  size?: TimeFieldSize;
  status?: TimeFieldStatus;
  variant?: TimeFieldVariant;
  /** Оболочка по ширине времени, без растягивания на всю строку. */
  compact?: boolean;
  /** Слот слева внутри оболочки, отделён вертикальной чертой. */
  prefix?: ReactNode;
  /** Слот справа внутри оболочки, отделён вертикальной чертой. */
  suffix?: ReactNode;
  onPointerDown?: PointerEventHandler<HTMLFieldSetElement>;
};

export const TimeFieldControl = forwardRef<HTMLFieldSetElement, TimeFieldControlProps>(
  function TimeFieldControl(
    {
      value: valueProp,
      defaultValue = "00:00",
      onValueChange,
      format = "HH:mm",
      disabled = false,
      size: sizeProp,
      status: statusProp,
      variant: variantProp,
      compact: compactProp,
      prefix,
      suffix,
      className = "",
      id,
      onPointerDown,
      ...rest
    },
    ref,
  ) {
    const ctx = useOptionalTimeFieldContext();
    const size = sizeProp ?? ctx?.size ?? "base";
    const status = statusProp ?? ctx?.status ?? "default";
    const variant = variantProp ?? ctx?.variant ?? "default";
    const compact = compactProp ?? ctx?.compact ?? false;
    const fieldId = ctx?.fieldId;
    const labelId = ctx?.labelId;
    const isRequired = ctx?.isRequired ?? false;

    const isControlled = valueProp !== undefined;
    const [internal, setInternal] = useState<HMS>(() => parseTime(valueProp ?? defaultValue));
    const hms = isControlled ? parseTime(valueProp!) : internal;

    const setHms = useCallback(
      (next: HMS) => {
        if (!isControlled) setInternal(next);
        onValueChange?.(formatTime(next, format));
      },
      [isControlled, format, onValueChange],
    );

    const pendingRef = useRef<{ seg: SegId; digit: number } | null>(null);
    const [focusedSeg, setFocusedSeg] = useState<SegId | null>(null);
    const shellRef = useRef<HTMLFieldSetElement>(null);

    const hSegRef = useRef<HTMLSpanElement>(null);
    const mSegRef = useRef<HTMLSpanElement>(null);
    const sSegRef = useRef<HTMLSpanElement>(null);
    const segRefById = useMemo(
      () =>
        ({
          h: hSegRef,
          m: mSegRef,
          s: sSegRef,
        }) satisfies Record<SegId, React.RefObject<HTMLSpanElement | null>>,
      [],
    );

    const segments = useMemo(
      (): SegId[] => (format === "HH:mm:ss" ? ["h", "m", "s"] : ["h", "m"]),
      [format],
    );

    const setShellRef = useCallback(
      (node: HTMLFieldSetElement | null) => {
        shellRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const focusSeg = useCallback(
      (seg: SegId) => {
        segRefById[seg].current?.focus();
      },
      [segRefById],
    );

    const navigate = useCallback(
      (from: SegId, dir: "prev" | "next") => {
        const idx = segments.indexOf(from);
        if (dir === "next" && idx < segments.length - 1) focusSeg(segments[idx + 1]!);
        if (dir === "prev" && idx > 0) focusSeg(segments[idx - 1]!);
      },
      [segments, focusSeg],
    );

    const commitPending = useCallback(() => {
      const p = pendingRef.current;
      if (!p) return;
      setHms(withSeg(hms, p.seg, p.digit));
      pendingRef.current = null;
    }, [hms, setHms]);

    const handleSegKeyDown = useCallback(
      (e: KeyboardEvent<HTMLSpanElement>, seg: SegId) => {
        if (disabled) return;
        const max = SEG_MAX[seg];
        const digit = parseInt(e.key, 10);

        if (!Number.isNaN(digit)) {
          e.preventDefault();
          const pending = pendingRef.current;

          if (pending && pending.seg === seg) {
            const combined = pending.digit * 10 + digit;
            if (combined > max) {
              setHms(withSeg(hms, seg, pending.digit));
              if (digit * 10 > max) {
                setHms(withSeg(hms, seg, Math.min(digit, max)));
                pendingRef.current = null;
                navigate(seg, "next");
              } else {
                pendingRef.current = { seg, digit };
              }
            } else {
              setHms(withSeg(hms, seg, combined));
              pendingRef.current = null;
              navigate(seg, "next");
            }
          } else {
            if (digit * 10 > max) {
              setHms(withSeg(hms, seg, Math.min(digit, max)));
              pendingRef.current = null;
              navigate(seg, "next");
            } else {
              pendingRef.current = { seg, digit };
              setHms(withSeg(hms, seg, digit));
            }
          }
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          pendingRef.current = null;
          const cur = segValue(hms, seg);
          setHms(withSeg(hms, seg, cur >= max ? 0 : cur + 1));
        } else if (e.key === "ArrowDown") {
          e.preventDefault();
          pendingRef.current = null;
          const cur = segValue(hms, seg);
          setHms(withSeg(hms, seg, cur <= 0 ? max : cur - 1));
        } else if (e.key === "ArrowLeft" || e.key === "Backspace") {
          e.preventDefault();
          commitPending();
          navigate(seg, "prev");
        } else if (e.key === "ArrowRight") {
          e.preventDefault();
          commitPending();
          navigate(seg, "next");
        } else if (e.key === "Tab") {
          commitPending();
        }
      },
      [disabled, hms, setHms, navigate, commitPending],
    );

    const handleSegBlur = useCallback(() => {
      commitPending();
      setFocusedSeg(null);
    }, [commitPending]);

    const handleSegFocus = useCallback((seg: SegId) => {
      pendingRef.current = null;
      setFocusedSeg(seg);
    }, []);

    const handleSegClick = useCallback(
      (e: MouseEvent, seg: SegId) => {
        e.stopPropagation();
        focusSeg(seg);
      },
      [focusSeg],
    );

    const handleShellPointerDown = useCallback(
      (e: PointerEvent<HTMLFieldSetElement>) => {
        onPointerDown?.(e);
        if (e.defaultPrevented || disabled) return;
        const shell = shellRef.current;
        if (!shell || prefersReducedInteractiveHoverLift()) return;
        void animateInteractivePressSqueeze(shell);
      },
      [disabled, onPointerDown],
    );

    const layout = CONTROL_SIZE_LAYOUT[size];
    const segTextCls =
      layout.controlText === "small"
        ? "text-small"
        : layout.controlText === "mid"
          ? "text-mid"
          : "text-base";

    const statusTinted =
      status === "danger" || status === "success" || status === "warning";

    const shellSurface = statusTinted
      ? cn(
          STATUS_TINT_SHELL[status],
          "border-transparent",
          STATUS_TINT_FOCUS_BORDER[status],
        )
      : cn(
          variant === "outline"
            ? "surface-outline focus-within:border-accent"
            : cn(VARIANT_SHELL[variant], "border-base focus-within:border-accent"),
        );

    const isPending = (seg: SegId) =>
      pendingRef.current?.seg === seg && focusedSeg === seg;

    const segDisplay = (seg: SegId) => {
      if (isPending(seg)) return String(pendingRef.current!.digit);
      return String(hms[seg]).padStart(2, "0");
    };

    const ariaDescribedBy = joinFieldDescribedBy(
      ctx?.hintConnected ? ctx.hintId : undefined,
      ctx?.errorConnected ? ctx.errorId : undefined,
    );

    const segCls = cn(
      "inline-flex min-w-[2ch] select-none items-center justify-center outline-none",
      variant === "segmented"
        ? cn(
            "h-[1.65em] min-w-[2.25ch] rounded-small px-[3px]",
            "bg-[color-mix(in_oklab,var(--color-border)_28%,var(--color-surface))]",
            "focus:bg-accent focus:text-accent-foreground",
          )
        : cn(
            "rounded-[3px] px-[2px]",
            "focus:bg-accent focus:text-accent-foreground",
          ),
      disabled ? "cursor-not-allowed" : "cursor-default",
    );

    return (
      <fieldset
        ref={setShellRef}
        id={id ?? fieldId}
        aria-label={labelId ? undefined : "Время"}
        aria-labelledby={labelId}
        aria-describedby={ariaDescribedBy}
        data-slot="timefield-shell"
        onPointerDown={handleShellPointerDown}
        className={cn(
          "m-0 flex min-w-0 items-stretch overflow-hidden rounded-base border-1 p-0 transition-[border-color,background-color] duration-200 ease-out",
          SHELL_H[size],
          compact ? "inline-flex w-fit shrink-0" : "w-full min-w-0",
          shellSurface,
          disabled ? "cursor-not-allowed opacity-55" : "",
          className,
        )}
        {...rest}
      >
        {prefix != null ? (
          <AffixSlot side="prefix" variant={variant} status={status} controlSize={size}>
            {prefix}
          </AffixSlot>
        ) : null}

        <div
          className={cn(
            "flex min-w-0 flex-1 items-center font-mono tabular-nums leading-none",
            compact ? "justify-center px-small" : layout.padX,
            variant === "segmented" && "gap-xsmall py-xsmall",
            segTextCls,
          )}
        >
          {segments.map((seg, i) => (
            <span key={seg} className="inline-flex items-center">
              {i > 0 && (
                <span
                  aria-hidden
                  className={cn(
                    "inline-flex w-[0.45em] shrink-0 select-none items-center justify-center self-center text-muted",
                    variant === "segmented" && "mx-[1px]",
                  )}
                >
                  :
                </span>
              )}
              <span
                ref={segRefById[seg]}
                role="spinbutton"
                aria-label={SEG_LABEL[seg]}
                aria-valuemin={0}
                aria-valuemax={SEG_MAX[seg]}
                aria-valuenow={hms[seg]}
                aria-valuetext={String(hms[seg]).padStart(2, "0")}
                aria-required={seg === segments[0] && isRequired ? true : undefined}
                aria-invalid={seg === segments[0] && status === "danger" ? true : undefined}
                tabIndex={disabled ? -1 : 0}
                className={segCls}
                onKeyDown={(e) => handleSegKeyDown(e, seg)}
                onFocus={() => handleSegFocus(seg)}
                onBlur={handleSegBlur}
                onClick={(e) => handleSegClick(e, seg)}
              >
                {segDisplay(seg)}
              </span>
            </span>
          ))}
        </div>

        {suffix != null ? (
          <AffixSlot side="suffix" variant={variant} status={status} controlSize={size}>
            {suffix}
          </AffixSlot>
        ) : null}
      </fieldset>
    );
  },
);

TimeFieldControl.displayName = "TimeFieldControl";

// ─── TimeFieldRoot (simple + compound) ────────────────────────────────────────

export type TimeFieldRootProps = Omit<HTMLAttributes<HTMLDivElement>, "prefix" | "suffix"> & {
  children?: ReactNode;
  label?: ReactNode;
  hint?: ReactNode;
  error?: ReactNode;
  id?: string;
  isRequired?: boolean;
  status?: TimeFieldStatus;
  size?: TimeFieldSize;
  variant?: TimeFieldVariant;
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  format?: TimeFieldFormat;
  disabled?: boolean;
  compact?: boolean;
  prefix?: ReactNode;
  suffix?: ReactNode;
};

export function TimeFieldRoot({
  children,
  label,
  hint,
  error,
  className,
  id: idProp,
  isRequired = false,
  status = "default",
  size = "base",
  variant = "default",
  value,
  defaultValue,
  onValueChange,
  format,
  disabled,
  compact = false,
  prefix,
  suffix,
  ...rest
}: TimeFieldRootProps) {
  const autoId = useId();
  const fieldId = idProp ?? `timefield-${autoId}`;
  const hintId = fieldHintId(fieldId);
  const errorId = fieldErrorId(fieldId);
  const labelId = `${fieldId}-label`;
  const isCompound = hasCompoundChildren(children);
  const hasHint = hint != null || (isCompound && hasCompoundChild(children, TimeFieldHint));
  const hasError = error != null || (isCompound && hasCompoundChild(children, TimeFieldError));

  const body = isCompound ? (
    children
  ) : (
    <>
      {label != null && <Label id={labelId}>{label}</Label>}
      <TimeFieldControl
        id={fieldId}
        value={value}
        defaultValue={defaultValue}
        onValueChange={onValueChange}
        format={format}
        disabled={disabled}
        size={size}
        status={status}
        variant={variant}
        compact={compact}
        prefix={prefix}
        suffix={suffix}
      />
      {hint != null && <TimeFieldHint>{hint}</TimeFieldHint>}
      {error != null && <TimeFieldError>{error}</TimeFieldError>}
    </>
  );

  const timeFieldCtx = useMemo(
    () => ({
      fieldId,
      labelId,
      hintId,
      errorId,
      hintConnected: hasHint,
      errorConnected: hasError,
      isRequired,
      status,
      size,
      variant,
      compact,
    }),
    [
      compact,
      errorId,
      fieldId,
      hasError,
      hasHint,
      hintId,
      isRequired,
      labelId,
      size,
      status,
      variant,
    ],
  );
  const fieldLabelCtx = useMemo(
    () => ({ controlId: fieldId, labelId, isRequired }),
    [fieldId, isRequired, labelId],
  );

  return (
    <TimeFieldContext.Provider value={timeFieldCtx}>
      <FieldLabelContext.Provider value={fieldLabelCtx}>
        <FieldRoot className={cn(compact && "w-fit", className)} {...rest}>
          {body}
        </FieldRoot>
      </FieldLabelContext.Provider>
    </TimeFieldContext.Provider>
  );
}

// ─── TimeFieldHint / TimeFieldError ──────────────────────────────────────────

export type TimeFieldHintProps = HTMLAttributes<HTMLParagraphElement> & { children?: ReactNode };
export type TimeFieldErrorProps = HTMLAttributes<HTMLParagraphElement> & { children?: ReactNode };

export function TimeFieldHint({ children, id: idProp, ...rest }: TimeFieldHintProps) {
  const ctx = useTimeFieldContext();
  const hintStatus =
    ctx.status === "danger" || ctx.status === "default" ? "default" : ctx.status;
  return (
    <FieldHint id={idProp ?? ctx.hintId} status={hintStatus} {...rest}>
      {children}
    </FieldHint>
  );
}

TimeFieldHint.displayName = "TimeFieldHint";

export function TimeFieldError({ children, id: idProp, ...rest }: TimeFieldErrorProps) {
  const ctx = useTimeFieldContext();
  return (
    <FieldError id={idProp ?? ctx.errorId} role="alert" {...rest}>
      {children}
    </FieldError>
  );
}

TimeFieldError.displayName = "TimeFieldError";


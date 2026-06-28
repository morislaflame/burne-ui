import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useId,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type FormEvent,
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
import { useGlossFieldShellMotion } from "@/components/core/utils/glossInteractiveMotion";
import "../utils/glossInteractive.css";
import {
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import { useFieldShellHoverLift, FIELD_SHELL_FOCUS_CLASS, FIELD_SHELL_TRANSITION_CLASS, fieldShellHoverClass } from "@/components/core/utils/useFieldShellHoverLift";
import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/controlSizeLayout";
import { affixSlotClass } from "@/components/core/utils/inputAffixLayout";
import type { ComponentSize } from "@/components/core/utils/componentSize";
import { cn } from "@/utils/cn";


export type TimeFieldSize = ComponentSize;
export type TimeFieldStatus = "default" | "danger" | "success" | "warning";
export type TimeFieldVariant = "default" | "outline" | "segmented" | "gloss";
export type TimeFieldFormat = "HH:mm" | "HH:mm:ss";


type TimeFieldCtx = {
  fieldId: string;
  labelId: string;
  labelConnected: boolean;
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
  if (!ctx) throw new Error("Components TimeField must be inside <TimeField>.");
  return ctx;
}

function useOptionalTimeFieldContext() {
  return useContext(TimeFieldContext);
}


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


type SegId = "h" | "m" | "s";
const SEG_MAX: Record<SegId, number> = { h: 23, m: 59, s: 59 };
const SEG_LABEL: Record<SegId, string> = { h: "hours", m: "minutes", s: "seconds" };

function segValue(hms: HMS, seg: SegId): number {
  return hms[seg];
}

function withSeg(hms: HMS, seg: SegId, val: number): HMS {
  const clamped = Math.max(0, Math.min(SEG_MAX[seg], val));
  return { ...hms, [seg]: clamped };
}


const VARIANT_SHELL: Record<Exclude<TimeFieldVariant, "outline" | "gloss">, string> = {
  default: "bg-surface",
  segmented: "bg-surface",
};

const STATUS_TINT_SHELL: Record<Exclude<TimeFieldStatus, "default">, string> = {
  danger: "bg-surface-tint-danger",
  success: "bg-surface-tint-success",
  warning: "bg-surface-tint-warning",
};

const STATUS_TINT_AFFIX: Record<Exclude<TimeFieldStatus, "default">, string> = {
  danger: "bg-surface-tint-danger",
  success: "bg-surface-tint-success",
  warning: "bg-surface-tint-warning",
};

const AFFIX_SURFACE = "bg-primary-tint";

const AFFIX_PADDING: Record<TimeFieldSize, string> = {
  small: affixSlotClass("small"),
  base: affixSlotClass("base"),
  mid: affixSlotClass("mid"),
  large: affixSlotClass("large"),
};

const SHELL_H: Record<TimeFieldSize, string> = {
  small: CONTROL_SIZE_LAYOUT.small.h,
  base: CONTROL_SIZE_LAYOUT.base.h,
  mid: CONTROL_SIZE_LAYOUT.mid.h,
  large: CONTROL_SIZE_LAYOUT.large.h,
};

function AffixSlot({
  side,
  status,
  controlSize,
  children,
}: {
  side: "prefix" | "suffix";
  status: TimeFieldStatus;
  controlSize: TimeFieldSize;
  children: ReactNode;
}) {
  const edge = side === "prefix" ? "border-r-token" : "border-l-token";
  const surface =
    status === "default" ? AFFIX_SURFACE : STATUS_TINT_AFFIX[status];

  return (
    <span
      className={cn(
        AFFIX_PADDING[controlSize],
        surface,
        edge,
      )}
    >
      {children}
    </span>
  );
}


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
  compact?: boolean;
  prefix?: ReactNode;
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
      onPointerEnter: onPointerEnterProp,
      onPointerLeave: onPointerLeaveProp,
      ...rest
    },
    ref,
  ) {
    const ctx = useOptionalTimeFieldContext();
    const size = sizeProp ?? ctx?.size ?? "base";
    const status = statusProp ?? ctx?.status ?? "default";
    const variant = variantProp ?? ctx?.variant ?? "default";
    const compact = compactProp ?? ctx?.compact ?? false;
    const isGloss = variant === "gloss";
    const fieldId = ctx?.fieldId;
    const labelId = ctx?.labelId;
    const labelConnected = ctx?.labelConnected ?? false;
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
    const keyboardInputRef = useRef<HTMLInputElement>(null);

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

    const focusSeg = useCallback((seg: SegId) => {
      pendingRef.current = null;
      setFocusedSeg(seg);
      keyboardInputRef.current?.focus({ preventScroll: true });
    }, []);

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

    const applyDigit = useCallback(
      (seg: SegId, digit: number) => {
        const max = SEG_MAX[seg];
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
        } else if (digit * 10 > max) {
          setHms(withSeg(hms, seg, Math.min(digit, max)));
          pendingRef.current = null;
          navigate(seg, "next");
        } else {
          pendingRef.current = { seg, digit };
          setHms(withSeg(hms, seg, digit));
        }
      },
      [hms, navigate, setHms],
    );

    const handleSegKeyDown = useCallback(
      (e: KeyboardEvent<HTMLSpanElement | HTMLInputElement>, seg: SegId) => {
        if (disabled) return;
        const max = SEG_MAX[seg];
        const digit = parseInt(e.key, 10);

        if (!Number.isNaN(digit)) {
          e.preventDefault();
          applyDigit(seg, digit);
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
      [applyDigit, commitPending, disabled, hms, navigate, setHms],
    );

    const handleFieldBlur = useCallback(
      (e: FocusEvent<HTMLSpanElement | HTMLInputElement>) => {
        const related = e.relatedTarget as Node | null;
        const shell = shellRef.current;
        if (shell && related && shell.contains(related)) return;
        commitPending();
        setFocusedSeg(null);
      },
      [commitPending],
    );

    const handleSegFocus = useCallback((seg: SegId) => {
      pendingRef.current = null;
      setFocusedSeg(seg);
    }, []);

    const handleKeyboardInput = useCallback(
      (e: FormEvent<HTMLInputElement>) => {
        const raw = e.currentTarget.value;
        e.currentTarget.value = "";
        if (disabled || !focusedSeg) return;
        for (const ch of raw) {
          const digit = parseInt(ch, 10);
          if (!Number.isNaN(digit)) applyDigit(focusedSeg, digit);
        }
      },
      [applyDigit, disabled, focusedSeg],
    );

    const handleKeyboardInputKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        if (disabled || !focusedSeg) return;
        handleSegKeyDown(e, focusedSeg);
      },
      [disabled, focusedSeg, handleSegKeyDown],
    );

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
        if (e.defaultPrevented || disabled || isGloss) return;
        const shell = shellRef.current;
        if (!shell || prefersReducedInteractiveHoverLift()) return;
        void animateInteractivePressSqueeze(shell);
      },
      [disabled, isGloss, onPointerDown],
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

    const shellSurface = isGloss
      ? "gloss-control"
      : statusTinted
        ? cn(STATUS_TINT_SHELL[status], "border-token")
        : cn(
            variant === "outline"
              ? "bg-transparent border-token"
              : cn(VARIANT_SHELL[variant], "border-token"),
          );

    const shellHoverLift = useFieldShellHoverLift(shellRef, !disabled && !isGloss);
    const glossShellMotion = useGlossFieldShellMotion(shellRef, !disabled && isGloss);

    const bindShellRef = useCallback(
      (node: HTMLFieldSetElement | null) => {
        setShellRef(node);
        if (!disabled && isGloss) glossShellMotion.bindShellRef(node);
      },
      [disabled, glossShellMotion, isGloss, setShellRef],
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

    const segCls = (seg: SegId) =>
      cn(
        "inline-flex min-w-[2ch] select-none items-center justify-center outline-none",
        variant === "segmented"
          ? cn("h-[1.65em] min-w-[2.25ch] rounded-small px-[3px]", "bg-default-hover")
          : "rounded-[3px] px-[2px]",
        focusedSeg === seg && "bg-primary text-primary-foreground",
        disabled ? "cursor-not-allowed" : "cursor-default",
      );

    return (
      <fieldset
        ref={bindShellRef}
        id={id ?? fieldId}
        aria-label={labelConnected ? undefined : "Время"}
        aria-labelledby={labelConnected ? labelId : undefined}
        aria-describedby={ariaDescribedBy}
        data-slot="timefield-shell"
        onPointerDown={
          isGloss && !disabled
            ? glossShellMotion.onShellPointerDown
            : handleShellPointerDown
        }
        onPointerEnter={(e) => {
          onPointerEnterProp?.(e);
          if (e.defaultPrevented) return;
          if (isGloss) glossShellMotion.onShellPointerEnter(e);
          else shellHoverLift.onShellPointerEnter(e);
        }}
        onPointerLeave={(e) => {
          onPointerLeaveProp?.(e);
          if (isGloss) glossShellMotion.onShellPointerLeave(e);
          else shellHoverLift.onShellPointerLeave(e);
        }}
        onFocusCapture={
          isGloss && !disabled ? glossShellMotion.onShellFocusIn : undefined
        }
        onBlurCapture={
          isGloss && !disabled ? glossShellMotion.onShellFocusOut : undefined
        }
        {...(disabled && isGloss ? { "data-gloss-disabled": "" } : {})}
        className={cn(
          "m-0 flex min-w-0 items-stretch overflow-hidden rounded-base border-1 p-0",
          isGloss && "relative",
          SHELL_H[size],
          compact ? "inline-flex w-fit shrink-0" : "w-full min-w-0",
          shellSurface,
          FIELD_SHELL_TRANSITION_CLASS,
          FIELD_SHELL_FOCUS_CLASS,
          isGloss ? "" : fieldShellHoverClass(!disabled, status),
          isGloss
            ? glossShellMotion.shellHoverMotionClass
            : shellHoverLift.shellHoverMotionClass,
          disabled ? "cursor-not-allowed opacity-55 shadow-token-sm" : "",
          className,
        )}
        {...rest}
      >
        {prefix != null ? (
          <AffixSlot side="prefix" status={status} controlSize={size}>
            {prefix}
          </AffixSlot>
        ) : null}

        <div
          className={cn(
            "relative flex min-w-0 flex-1 items-center font-mono tabular-nums leading-none",
            compact ? "justify-center px-small" : layout.padX,
            layout.padY,
            variant === "segmented" && "gap-xsmall",
            segTextCls,
          )}
        >
          <input
            ref={keyboardInputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            aria-hidden
            tabIndex={-1}
            disabled={disabled}
            className="pointer-events-none absolute h-px w-px opacity-0"
            style={{ fontSize: 16 }}
            onInput={handleKeyboardInput}
            onKeyDown={handleKeyboardInputKeyDown}
            onBlur={handleFieldBlur}
          />
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
                className={segCls(seg)}
                onKeyDown={(e) => handleSegKeyDown(e, seg)}
                onFocus={() => handleSegFocus(seg)}
                onBlur={handleFieldBlur}
                onClick={(e) => handleSegClick(e, seg)}
              >
                {segDisplay(seg)}
              </span>
            </span>
          ))}
        </div>

        {suffix != null ? (
          <AffixSlot side="suffix" status={status} controlSize={size}>
            {suffix}
          </AffixSlot>
        ) : null}
      </fieldset>
    );
  },
);

TimeFieldControl.displayName = "TimeFieldControl";


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
  const hasLabel = label != null || (isCompound && hasCompoundChild(children, "Label"));
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
      labelConnected: hasLabel,
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
      hasLabel,
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


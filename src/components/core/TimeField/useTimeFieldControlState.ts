import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
  type FormEvent,
  type KeyboardEvent,
  type MouseEvent,
  type RefObject,
} from "react";

import { joinFieldDescribedBy } from "@/components/core/Field/fieldA11y";
import { useControllableState } from "@/components/core/utils/useControllableState";

import { timeFieldShellAria } from "./timeFieldA11y";
import {
  formatTime,
  parseTime,
  segmentsForFormat,
  segValue,
  TIME_FIELD_SEG_MAX,
  withSeg,
} from "./timeFieldAPI";
import { useTimeFieldShellMotion } from "./timeFieldAnimations";
import { useOptionalTimeFieldContext } from "./timeFieldContext";
import { timeFieldShellSurfaceClass } from "./timeFieldStyles";
import type {
  TimeFieldControlProps,
  TimeFieldSegId,
} from "./timeFieldTypes";

export function useTimeFieldControlState({
  value: valueProp,
  defaultValue = "00:00",
  onValueChange,
  format = "HH:mm",
  disabled = false,
  size: sizeProp,
  status: statusProp,
  variant: variantProp,
  compact: compactProp,
  id,
  onPointerDown,
  onPointerEnter: onPointerEnterProp,
  onPointerLeave: onPointerLeaveProp,
  ref,
}: TimeFieldControlProps & {
  ref: React.Ref<HTMLFieldSetElement>;
}) {
  const ctx = useOptionalTimeFieldContext();
  const size = sizeProp ?? ctx?.size ?? "base";
  const status = statusProp ?? ctx?.status ?? "default";
  const variant = variantProp ?? ctx?.variant ?? "default";
  const compact = compactProp ?? ctx?.compact ?? false;
  const isGloss = variant === "gloss";
  const fieldId = ctx?.fieldId;
  const labelId = ctx?.labelId ?? "";
  const labelConnected = ctx?.labelConnected ?? false;
  const isRequired = ctx?.isRequired ?? false;

  const [hms, setHms] = useControllableState({
    value: valueProp !== undefined ? parseTime(valueProp) : undefined,
    defaultValue: () => parseTime(defaultValue),
    onChange: (next) => onValueChange?.(formatTime(next, format)),
  });

  const pendingRef = useRef<{ seg: TimeFieldSegId; digit: number } | null>(null);
  const [focusedSeg, setFocusedSeg] = useState<TimeFieldSegId | null>(null);
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
      }) satisfies Record<TimeFieldSegId, RefObject<HTMLSpanElement | null>>,
    [],
  );

  const segments = useMemo(() => segmentsForFormat(format), [format]);

  const setShellRef = useCallback(
    (node: HTMLFieldSetElement | null) => {
      shellRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const shellMotion = useTimeFieldShellMotion({
    shellRef,
    disabled,
    variant,
    onPointerDown,
    onPointerEnter: onPointerEnterProp,
    onPointerLeave: onPointerLeaveProp,
  });

  const bindShellRef = useCallback(
    (node: HTMLFieldSetElement | null) => {
      shellMotion.bindShellRef(node, setShellRef);
    },
    [setShellRef, shellMotion],
  );

  const focusSeg = useCallback((seg: TimeFieldSegId) => {
    pendingRef.current = null;
    setFocusedSeg(seg);
    shellRef.current?.scrollIntoView({ block: "nearest", inline: "center" });
    keyboardInputRef.current?.focus({ preventScroll: true });
  }, []);

  const navigate = useCallback(
    (from: TimeFieldSegId, dir: "prev" | "next") => {
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
    (seg: TimeFieldSegId, digit: number) => {
      const max = TIME_FIELD_SEG_MAX[seg];
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
    (e: KeyboardEvent<HTMLSpanElement | HTMLInputElement>, seg: TimeFieldSegId) => {
      if (disabled) return;
      const max = TIME_FIELD_SEG_MAX[seg];
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
      const shell = shellRef.current;
      const related = e.relatedTarget as Node | null;
      if (shell && related && shell.contains(related)) return;

      if (shell && related == null) {
        requestAnimationFrame(() => {
          const active = document.activeElement;
          if (shell.contains(active)) return;
          commitPending();
          setFocusedSeg(null);
        });
        return;
      }

      commitPending();
      setFocusedSeg(null);
    },
    [commitPending],
  );

  const handleSegFocus = useCallback((seg: TimeFieldSegId) => {
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
    (e: MouseEvent, seg: TimeFieldSegId) => {
      e.stopPropagation();
      focusSeg(seg);
    },
    [focusSeg],
  );

  const handleShellClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (disabled) return;
      const firstSeg = segments[0];
      if (!firstSeg) return;
      if (e.target instanceof Element && e.target.closest('[role="spinbutton"]')) return;
      focusSeg(firstSeg);
    },
    [disabled, focusSeg, segments],
  );

  const isPending = (seg: TimeFieldSegId) =>
    pendingRef.current?.seg === seg && focusedSeg === seg;

  const segDisplay = (seg: TimeFieldSegId) => {
    if (isPending(seg)) return String(pendingRef.current!.digit);
    return String(hms[seg]).padStart(2, "0");
  };

  const statusTinted =
    status === "danger" || status === "success" || status === "info" || status === "warning";

  const shellSurface = timeFieldShellSurfaceClass({ variant, status, statusTinted });

  const shellAria = timeFieldShellAria({ labelConnected, labelId });

  const ariaDescribedBy = joinFieldDescribedBy(
    ctx?.hintConnected ? ctx.hintId : undefined,
    ctx?.errorConnected ? ctx.errorId : undefined,
  );

  return {
    size,
    status,
    variant,
    compact,
    disabled,
    isGloss,
    format,
    fieldId,
    controlId: id ?? fieldId,
    shellAria,
    ariaDescribedBy,
    isRequired,
    hms,
    segments,
    segRefById,
    keyboardInputRef,
    bindShellRef,
    shellMotion,
    shellSurface,
    focusedSeg,
    handleSegKeyDown,
    handleFieldBlur,
    handleSegFocus,
    handleKeyboardInput,
    handleKeyboardInputKeyDown,
    handleSegClick,
    handleShellClick,
    segDisplay,
  };
}

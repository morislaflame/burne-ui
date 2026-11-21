import {
  useCallback,
  useMemo,
  useRef,
  useState,
  type ClipboardEvent,
  type FocusEvent,
  type FormEvent,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type RefObject,
} from "react";
 
import { useFormFieldBinding } from "@/components/composite/Form/useFormFieldBinding";
import { joinFieldDescribedBy } from "@/components/core/Field/fieldA11y";
import { isImeComposingEvent, useNativeFormReset } from "@/components/core/utils/fieldFormDom";
import { focusElement } from "@/components/core/utils/focusElement";
import { fieldPaintStatus, useResolvedFieldInvalid } from "@/components/core/utils/fieldInvalid";
import { useSkinVariant } from "@/skins/skinContext";
import { useBurneLabel } from "@/theme/BurneLabelsProvider";
 
import { timeFieldShellAria } from "./timeFieldA11y";
import { formatTime, parseTime, segmentsForFormat, segValue, TIME_FIELD_SEG_MAX, withSeg } from "./timeFieldAPI";
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
  readOnly = false,
  name,
  size: sizeProp,
  variant: variantProp,
  compact: compactProp,
  id,
}: TimeFieldControlProps) {
  const formBinding = useFormFieldBinding({
    name: typeof name === "string" ? name : undefined,
    value: valueProp,
    disabled,
    readOnly,
  });
  const resolvedReadOnly = Boolean(formBinding.readOnly);
  const resolvedDisabled = Boolean(formBinding.disabled);
  const boundText = formBinding.bound ? String(formBinding.value ?? "") : undefined;
  const timeLabel = useBurneLabel("time");
  const ctx = useOptionalTimeFieldContext();
  const size = sizeProp ?? ctx?.size ?? "base";
  const isInvalid = useResolvedFieldInvalid({
    invalid: ctx?.invalid,
    errorConnected: ctx?.errorConnected ?? false,
    formInvalid: formBinding["aria-invalid"] === true,
  });
  const status = fieldPaintStatus(isInvalid);
  const variant = useSkinVariant(variantProp ?? ctx?.variant);
  const compact = compactProp ?? ctx?.compact ?? false;
  const fieldId = ctx?.fieldId;
  const labelId = ctx?.labelId ?? "";
  const labelConnected = ctx?.labelConnected ?? false;
  const required = ctx?.required ?? false;

  const controlledHms =
    valueProp !== undefined
      ? parseTime(valueProp)
      : boundText !== undefined
        ? parseTime(boundText || defaultValue)
        : undefined;
  const isControlled = controlledHms !== undefined;
  const [internalHms, setInternalHms] = useState(() => parseTime(defaultValue));
  const hms = isControlled ? controlledHms : internalHms;

  const onValueChangeRef = useRef(onValueChange);
  // react-doctor-disable-next-line react-doctor/no-ref-current-in-render -- latest callback without recreating setter
  onValueChangeRef.current = onValueChange;

  const setHms = useCallback(
    (next: ReturnType<typeof parseTime>) => {
      if (!isControlled) setInternalHms(next);
      const text = formatTime(next, format);
      onValueChangeRef.current?.(text);
      if (formBinding.bound) formBinding.setValue(text);
    },
    [formBinding, format, isControlled],
  );
 
  const pendingRef = useRef<{ seg: TimeFieldSegId; digit: number } | null>(null);
  const lastPointerTypeRef = useRef<string>("");
  const [focusedSeg, setFocusedSeg] = useState<TimeFieldSegId | null>(null);
  const shellRef = useRef<HTMLFieldSetElement>(null);
  const keyboardInputRef = useRef<HTMLInputElement>(null);

  useNativeFormReset(
    shellRef,
    () => {
      pendingRef.current = null;
      setInternalHms(parseTime(defaultValue));
    },
    !isControlled,
  );
 
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
    },
    [],
  );

  const formRef = formBinding.ref;
  const bindFirstSegRef = useCallback(
    (seg: TimeFieldSegId) => (node: HTMLSpanElement | null) => {
      segRefById[seg].current = node;
      if (seg === segments[0]) {
        formRef(node);
      }
    },
    [formRef, segRefById, segments],
  );
 
  const focusSeg = useCallback(
    (seg: TimeFieldSegId, viaTouch = false) => {
      if (resolvedDisabled) return;
      pendingRef.current = null;
      setFocusedSeg(seg);
      shellRef.current?.scrollIntoView({ block: "nearest", inline: "center" });
      if (viaTouch && !resolvedReadOnly) {
        focusElement(keyboardInputRef.current);
      } else {
        focusElement(segRefById[seg].current);
      }
    },
    [resolvedDisabled, resolvedReadOnly, segRefById],
  );
 
  const navigate = useCallback(
    (from: TimeFieldSegId, dir: "prev" | "next") => {
      const idx = segments.indexOf(from);
      const viaTouch = document.activeElement === keyboardInputRef.current;
      if (dir === "next" && idx < segments.length - 1) focusSeg(segments[idx + 1]!, viaTouch);
      if (dir === "prev" && idx > 0) focusSeg(segments[idx - 1]!, viaTouch);
    },
    [segments, focusSeg],
  );
 
  const commitPending = useCallback(() => {
    const p = pendingRef.current;
    if (!p) return;
    if (resolvedDisabled || resolvedReadOnly) {
      pendingRef.current = null;
      return;
    }
    setHms(withSeg(hms, p.seg, p.digit));
    pendingRef.current = null;
  }, [hms, resolvedDisabled, resolvedReadOnly, setHms]);
 
  const applyDigit = useCallback(
    (seg: TimeFieldSegId, digit: number) => {
      if (resolvedDisabled || resolvedReadOnly) return;
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
    [hms, navigate, resolvedDisabled, resolvedReadOnly, setHms],
  );
 
  const handleSegKeyDown = useCallback(
    (e: KeyboardEvent<HTMLSpanElement | HTMLInputElement>, seg: TimeFieldSegId) => {
      if (isImeComposingEvent(e) || resolvedDisabled) return;
      if (e.key === "Tab") {
        commitPending();
        return;
      }
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        commitPending();
        navigate(seg, "prev");
        return;
      }
      if (e.key === "ArrowRight") {
        e.preventDefault();
        commitPending();
        navigate(seg, "next");
        return;
      }
      if (resolvedReadOnly) {
        if (
          e.key === "ArrowUp" ||
          e.key === "ArrowDown" ||
          e.key === "Backspace" ||
          e.key === "Delete" ||
          !Number.isNaN(parseInt(e.key, 10))
        ) {
          e.preventDefault();
        }
        return;
      }

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
      } else if (e.key === "Backspace") {
        e.preventDefault();
        if (pendingRef.current != null || segValue(hms, seg) !== 0) {
          pendingRef.current = null;
          setHms(withSeg(hms, seg, 0));
        } else {
          navigate(seg, "prev");
        }
      } else if (e.key === "Delete") {
        e.preventDefault();
        pendingRef.current = null;
        setHms(withSeg(hms, seg, 0));
      }
    },
    [applyDigit, commitPending, hms, navigate, resolvedDisabled, resolvedReadOnly, setHms],
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLElement>, seg?: TimeFieldSegId) => {
      e.preventDefault();
      if (resolvedDisabled || resolvedReadOnly) return;
      const raw = e.clipboardData.getData("text").trim();
      if (!raw) return;
      if (raw.includes(":")) {
        pendingRef.current = null;
        setHms(parseTime(raw));
        return;
      }
      const digits = [...raw].filter((ch) => ch >= "0" && ch <= "9");
      if (digits.length >= 4) {
        const hh = digits.slice(0, 2).join("");
        const mm = digits.slice(2, 4).join("");
        const ss = digits.slice(4, 6).join("");
        pendingRef.current = null;
        setHms(parseTime(ss ? `${hh}:${mm}:${ss}` : `${hh}:${mm}`));
        return;
      }
      const targetSeg = seg ?? focusedSeg ?? segments[0];
      if (!targetSeg) return;
      for (const ch of digits) {
        applyDigit(targetSeg, Number(ch));
      }
    },
    [applyDigit, focusedSeg, resolvedDisabled, resolvedReadOnly, segments, setHms],
  );
 
  const formOnBlur = formBinding.onBlur;
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
          formOnBlur();
        });
        return;
      }
 
      commitPending();
      setFocusedSeg(null);
      formOnBlur();
    },
    [commitPending, formOnBlur],
  );
 
  const handleSegFocus = useCallback((seg: TimeFieldSegId) => {
    pendingRef.current = null;
    setFocusedSeg(seg);
  }, []);
 
  const handleKeyboardInput = useCallback(
    (e: FormEvent<HTMLInputElement>) => {
      const raw = e.currentTarget.value;
      e.currentTarget.value = "";
      if (resolvedDisabled || resolvedReadOnly || !focusedSeg) return;
      for (const ch of raw) {
        const digit = parseInt(ch, 10);
        if (!Number.isNaN(digit)) applyDigit(focusedSeg, digit);
      }
    },
    [applyDigit, focusedSeg, resolvedDisabled, resolvedReadOnly],
  );
 
  const handleKeyboardInputKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      if (resolvedDisabled || !focusedSeg) return;
      handleSegKeyDown(e, focusedSeg);
    },
    [focusedSeg, handleSegKeyDown, resolvedDisabled],
  );

  const recordPointerType = useCallback((e: PointerEvent<HTMLElement>) => {
    lastPointerTypeRef.current = e.pointerType;
  }, []);
 
  const handleSegClick = useCallback(
    (e: MouseEvent, seg: TimeFieldSegId) => {
      e.stopPropagation();
      if (resolvedDisabled) return;
      focusSeg(seg, lastPointerTypeRef.current === "touch");
    },
    [focusSeg, resolvedDisabled],
  );
 
  const handleShellClick = useCallback(
    (e: MouseEvent<HTMLDivElement>) => {
      if (resolvedDisabled) return;
      const firstSeg = segments[0];
      if (!firstSeg) return;
      if (e.target instanceof Element && e.target.closest('[role="spinbutton"]')) return;
      focusSeg(firstSeg, lastPointerTypeRef.current === "touch");
    },
    [focusSeg, resolvedDisabled, segments],
  );
 
  const isPending = (seg: TimeFieldSegId) =>
    pendingRef.current?.seg === seg && focusedSeg === seg;
 
  const segDisplay = (seg: TimeFieldSegId) => {
    if (isPending(seg)) return String(pendingRef.current!.digit);
    return String(hms[seg]).padStart(2, "0");
  };
 
  const shellSurface = timeFieldShellSurfaceClass({ variant });
 
  const shellAria = timeFieldShellAria({
    labelConnected,
    labelId,
    timeLabel,
  });
 
  const ariaDescribedBy = joinFieldDescribedBy(
    ctx?.hintConnected ? ctx.hintId : undefined,
    ctx?.errorConnected ? ctx.errorId : undefined,
  );
 
  return {
    size,
    status,
    variant,
    compact,
    disabled: resolvedDisabled,
    readOnly: resolvedReadOnly,
    name: formBinding.name ?? (typeof name === "string" ? name : undefined),
    text: formatTime(hms, format),
    format,
    fieldId,
    controlId: id ?? fieldId,
    shellAria,
    ariaDescribedBy,
    required,
    errorConnected: ctx?.errorConnected ?? false,
    isInvalid,
    hms,
    segments,
    segRefById,
    bindFirstSegRef,
    keyboardInputRef,
    shellRef,
    bindShellRef: setShellRef,
    shellSurface,
    focusedSeg,
    recordPointerType,
    handleSegKeyDown,
    handlePaste,
    handleFieldBlur,
    handleSegFocus,
    handleKeyboardInput,
    handleKeyboardInputKeyDown,
    handleSegClick,
    handleShellClick,
    segDisplay,
  };
}
 
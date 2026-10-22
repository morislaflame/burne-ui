import { useCallback, useEffect, useMemo, useRef, type ChangeEvent, type FocusEvent, type ForwardedRef, type KeyboardEvent as ReactKeyboardEvent } from "react";
 
import { joinFieldDescribedBy } from "@/components/core/Field/fieldA11y";
import { useResolvedFieldInvalid } from "@/components/core/utils/fieldInvalid";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
 
import { focusElement } from "@/components/core/utils/focusElement";
 
import { useComboBoxOpenAfterSqueeze } from "./comboBoxAnimations";
import { comboBoxActiveOptionId } from "./comboBoxA11y";
import { comboBoxBumpActiveValue, comboBoxFilteredValues, comboBoxFirstEnabledValue, comboBoxLastEnabledValue, comboBoxOptionDisplayString, comboBoxOptionsByValue } from "./comboBoxAPI";
import { useComboBoxContext } from "./comboBoxContext";
import type { ComboBoxInputProps } from "./comboBoxTypes";
 
export function useComboBoxInputState(
  {
    onKeyDown,
    onChange,
    onBlur,
  }: Pick<ComboBoxInputProps, "onKeyDown" | "onChange" | "onBlur">,
  forwardedRef: ForwardedRef<HTMLInputElement>,
) {
  const ctx = useComboBoxContext();
  const {
    comboBoxId,
    open,
    setOpen,
    value,
    setValue,
    filterQuery,
    setFilterQuery,
    listId,
    activeValue,
    setActiveValue,
    inputRef,
    anchorRef,
    items,
    filteredValues,
    allowsCustomValue,
    loading,
    filter,
    blurGeneration,
    cancelBlurCommit,
    disabled,
    readOnly,
    placeholder,
    size,
    required,
    hintConnected,
    errorConnected,
    invalid,
    formInvalid,
    hintId,
    errorId,
    formInputRef,
    formOnBlur,
  } = ctx;
  const isInvalid = useResolvedFieldInvalid({ invalid, errorConnected, formInvalid });
 
  const openingSqueeze = useComboBoxOpenAfterSqueeze({
    triggerRef: anchorRef,
    disabled,
  });
  const queuedFilterCharRef = useRef<string | null>(null);
  const optionsByValue = useMemo(() => comboBoxOptionsByValue(items), [items]);
  const selectedOption = useMemo(
    () => optionsByValue.get(value),
    [optionsByValue, value],
  );
  const selectedDisplayString = useMemo(() => {
    const fromOption = comboBoxOptionDisplayString(selectedOption);
    if (fromOption) return fromOption;
    if (allowsCustomValue && value) return value;
    return "";
  }, [allowsCustomValue, selectedOption, value]);
  const activeOptionId = comboBoxActiveOptionId(listId, open, activeValue);
  const ariaDescribedBy = joinFieldDescribedBy(
    hintConnected ? hintId : undefined,
    errorConnected ? errorId : undefined,
  );
 
  const finishOpen = useCallback(() => {
    const append = queuedFilterCharRef.current;
    queuedFilterCharRef.current = null;
    const nextQ = append ?? "";
    setFilterQuery(nextQ);
 
    if (loading) {
      setActiveValue(null);
    } else {
      const fi = comboBoxFilteredValues(items, nextQ, filter);
      const selectedIdx = fi.indexOf(value);
      setActiveValue(selectedIdx >= 0 ? value : fi[0] ?? null);
    }
 
    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      focusElement(el);
      const len = nextQ.length;
      el.setSelectionRange(len, len);
    });
  }, [filter, inputRef, items, loading, setActiveValue, setFilterQuery, value]);
 
  const openAfterSqueeze = useCallback(() => {
    openingSqueeze({ setOpen, onOpened: finishOpen });
  }, [finishOpen, openingSqueeze, setOpen]);
 
  const bumpActive = useCallback(
    (delta: number) => {
      const next = comboBoxBumpActiveValue({
        filteredValues,
        activeValue,
        optionsByValue,
        delta,
      });
      if (next) setActiveValue(next);
    },
    [activeValue, filteredValues, optionsByValue, setActiveValue],
  );
 
  const selectValue = useCallback(
    (next: string) => {
      const opt = optionsByValue.get(next);
      if (!opt || opt.disabled) return;
      cancelBlurCommit();
      setValue(next);
      setOpen(false);
      setFilterQuery("");
      focusElement(inputRef.current);
    },
    [cancelBlurCommit, inputRef, optionsByValue, setFilterQuery, setOpen, setValue],
  );
 
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
      if (!open) return;
      setFilterQuery(event.target.value);
    },
    [onChange, open, setFilterQuery],
  );
 
  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || disabled) return;
      if (event.nativeEvent.isComposing) return;
 
      if (!open) {
        if (event.key === "ArrowDown" || event.key === "ArrowUp") {
          event.preventDefault();
          openAfterSqueeze();
          return;
        }
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openAfterSqueeze();
          return;
        }
        if (
          event.key.length === 1 &&
          !event.ctrlKey &&
          !event.metaKey &&
          !event.altKey &&
          event.key !== "Tab"
        ) {
          event.preventDefault();
          queuedFilterCharRef.current = event.key;
          openAfterSqueeze();
        }
        return;
      }
 
      if (event.key === "ArrowDown") {
        event.preventDefault();
        bumpActive(1);
        return;
      }
      if (event.key === "ArrowUp") {
        event.preventDefault();
        bumpActive(-1);
        return;
      }
      if (event.key === "Enter") {
        event.preventDefault();
        if (loading) return;
        if (activeValue && filteredValues.includes(activeValue)) {
          selectValue(activeValue);
          return;
        }
        const custom = filterQuery.trim();
        if (allowsCustomValue && custom) {
          cancelBlurCommit();
          setValue(custom);
          setOpen(false);
          setFilterQuery("");
          focusElement(inputRef.current);
        }
        return;
      }
      if (event.key === "Home") {
        event.preventDefault();
        const first = comboBoxFirstEnabledValue(filteredValues, optionsByValue);
        if (first) setActiveValue(first);
        return;
      }
      if (event.key === "End") {
        event.preventDefault();
        const last = comboBoxLastEnabledValue(filteredValues, optionsByValue);
        if (last) setActiveValue(last);
      }
    },
    [
      activeValue,
      allowsCustomValue,
      bumpActive,
      disabled,
      filteredValues,
      cancelBlurCommit,
      filterQuery,
      inputRef,
      loading,
      onKeyDown,
      open,
      openAfterSqueeze,
      optionsByValue,
      selectValue,
      setActiveValue,
      setFilterQuery,
      setOpen,
      setValue,
    ],
  );
 
  useEffect(() => {
    if (open) return;
    setFilterQuery("");
  }, [open, setFilterQuery]);

  useEffect(() => {
    if (loading) setActiveValue(null);
  }, [loading, setActiveValue]);
 
  const handleBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      onBlur?.(event);
      formOnBlur?.();
      if (event.defaultPrevented || disabled || readOnly || !allowsCustomValue) return;
      const custom = event.currentTarget.value.trim();
      if (!custom) return;
      const related = event.relatedTarget;
      if (related instanceof Element && document.getElementById(listId)?.contains(related)) return;
      const generation = blurGeneration.current;
      queueMicrotask(() => {
        if (blurGeneration.current !== generation) return;
        cancelBlurCommit();
        setValue(custom);
        setOpen(false);
        setFilterQuery("");
      });
    },
    [
      allowsCustomValue,
      blurGeneration,
      cancelBlurCommit,
      disabled,
      formOnBlur,
      listId,
      onBlur,
      readOnly,
      setFilterQuery,
      setOpen,
      setValue,
    ],
  );
 
  const setRefs = useCallback(
    (node: HTMLInputElement | null) => {
      mergeForwardedRef(forwardedRef, node);
      mergeForwardedRef(inputRef, node);
      if (formInputRef) mergeForwardedRef(formInputRef, node);
    },
    [formInputRef, forwardedRef, inputRef],
  );
 
  return {
    comboBoxId,
    open,
    disabled,
    readOnly,
    placeholder,
    size,
    required,
    listId,
    errorConnected,
    isInvalid,
    activeOptionId,
    ariaDescribedBy,
    inputValue: open ? filterQuery : selectedDisplayString,
    isMuted: !open && !selectedOption,
    setRefs,
    handleChange,
    handleKeyDown,
    handleBlur,
  };
}
 
import { useCallback, useEffect, useMemo, useRef, type ChangeEvent, type FocusEvent, type ForwardedRef, type KeyboardEvent as ReactKeyboardEvent } from "react";

import { joinFieldDescribedBy } from "@/components/core/Field/fieldA11y";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";

import { runOpenAfterSqueeze, useOpeningRef } from "@/components/core/utils/runOpenAfterSqueeze";

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
    options,
    filteredValues,
    disabled,
    placeholder,
    size,
    status,
    required,
    hintConnected,
    errorConnected,
    hintId,
    errorId,
    formInputRef,
    formOnBlur,
  } = ctx;

  const openingRef = useOpeningRef();
  const queuedFilterCharRef = useRef<string | null>(null);
  const optionsByValue = useMemo(() => comboBoxOptionsByValue(options), [options]);
  const selectedOption = useMemo(
    () => optionsByValue.get(value),
    [optionsByValue, value],
  );
  const selectedDisplayString = useMemo(
    () => comboBoxOptionDisplayString(selectedOption),
    [selectedOption],
  );
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

    const fi = comboBoxFilteredValues(options, nextQ);
    const selectedIdx = fi.indexOf(value);
    setActiveValue(selectedIdx >= 0 ? value : fi[0] ?? null);

    requestAnimationFrame(() => {
      const el = inputRef.current;
      if (!el) return;
      el.focus();
      const len = nextQ.length;
      el.setSelectionRange(len, len);
    });
  }, [inputRef, options, setActiveValue, setFilterQuery, value]);

  const openAfterSqueeze = useCallback(() => {
    runOpenAfterSqueeze({
      triggerRef: anchorRef,
      disabled,
      setOpen,
      onOpened: finishOpen,
      openingRef,
    });
  }, [anchorRef, disabled, finishOpen, openingRef, setOpen]);

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
      setValue(next);
      setOpen(false);
      setFilterQuery("");
      inputRef.current?.focus();
    },
    [inputRef, optionsByValue, setFilterQuery, setOpen, setValue],
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
        if (activeValue) selectValue(activeValue);
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
      bumpActive,
      disabled,
      filteredValues,
      onKeyDown,
      open,
      openAfterSqueeze,
      optionsByValue,
      selectValue,
      setActiveValue,
    ],
  );

  useEffect(() => {
    if (open) return;
    setFilterQuery("");
  }, [open, setFilterQuery]);

  const handleBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      onBlur?.(event);
      formOnBlur?.();
    },
    [formOnBlur, onBlur],
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
    placeholder,
    size,
    status,
    required,
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

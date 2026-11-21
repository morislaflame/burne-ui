import {
  useCallback,
  useEffect,
  useMemo,
  type ChangeEvent,
  type FocusEvent,
  type ForwardedRef,
  type KeyboardEvent as ReactKeyboardEvent,
  type MouseEvent as ReactMouseEvent,
} from "react";
 
import { joinFieldDescribedBy } from "@/components/core/Field/fieldA11y";
import { isImeComposingEvent } from "@/components/core/utils/fieldFormDom";
import { useResolvedFieldInvalid } from "@/components/core/utils/fieldInvalid";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
 
import { focusElement } from "@/components/core/utils/focusElement";
 
import { comboBoxActiveOptionId } from "./comboBoxA11y";
import {
  comboBoxBumpActiveValue,
  comboBoxFilteredValues,
  comboBoxFirstEnabledValue,
  comboBoxLastEnabledValue,
  comboBoxOptionDisplayString,
} from "./comboBoxAPI";
import { useComboBoxContext } from "./comboBoxContext";
import type { ComboBoxInputProps } from "./comboBoxTypes";
 
export function useComboBoxInputState(
  {
    onKeyDown,
    onChange,
    onBlur,
    onClick,
  }: Pick<ComboBoxInputProps, "onKeyDown" | "onChange" | "onBlur" | "onClick">,
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
    isFiltering,
    setIsFiltering,
    isInputControlled,
    optionsByValue,
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

  const openCombo = useCallback(
    (edge: "first" | "last" = "first") => {
      if (disabled || readOnly) return;
      const query = isInputControlled ? filterQuery : "";
      if (!isInputControlled) {
        setIsFiltering(false);
        setFilterQuery("");
      }
      setOpen(true);
      if (loading) {
        setActiveValue(null);
      } else {
        const fi = comboBoxFilteredValues(items, query, filter);
        const selectedIdx = value ? fi.indexOf(value) : -1;
        if (selectedIdx >= 0) {
          setActiveValue(value);
        } else {
          setActiveValue(
            edge === "last"
              ? comboBoxLastEnabledValue(fi, optionsByValue)
              : comboBoxFirstEnabledValue(fi, optionsByValue),
          );
        }
      }
    },
    [
      disabled,
      filter,
      filterQuery,
      isInputControlled,
      items,
      loading,
      optionsByValue,
      readOnly,
      setActiveValue,
      setFilterQuery,
      setIsFiltering,
      setOpen,
      value,
    ],
  );

  const closeCombo = useCallback(() => {
    setOpen(false);
  }, [setOpen]);
 
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
      setIsFiltering(false);
      setValue(next);
      setOpen(false);
      setFilterQuery("");
      focusElement(inputRef.current);
    },
    [cancelBlurCommit, inputRef, optionsByValue, setFilterQuery, setIsFiltering, setOpen, setValue],
  );
 
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange?.(event);
      if (disabled || readOnly) return;
      const nextQuery = event.target.value;
      setIsFiltering(true);
      setFilterQuery(nextQuery);
      if (!open) {
        setOpen(true);
      }
      if (loading) {
        setActiveValue(null);
      } else {
        const fi = comboBoxFilteredValues(items, nextQuery, filter);
        const selectedIdx = value ? fi.indexOf(value) : -1;
        setActiveValue(selectedIdx >= 0 ? value : comboBoxFirstEnabledValue(fi, optionsByValue));
      }
    },
    [
      disabled,
      filter,
      items,
      loading,
      onChange,
      open,
      optionsByValue,
      readOnly,
      setActiveValue,
      setFilterQuery,
      setIsFiltering,
      setOpen,
      value,
    ],
  );

  const handleClick = useCallback(
    (event: ReactMouseEvent<HTMLInputElement>) => {
      onClick?.(event);
      if (event.defaultPrevented || disabled || readOnly) return;
      if (!open) {
        openCombo("first");
      }
    },
    [disabled, onClick, open, openCombo, readOnly],
  );
 
  const handleKeyDown = useCallback(
    (event: ReactKeyboardEvent<HTMLInputElement>) => {
      onKeyDown?.(event);
      if (event.defaultPrevented || isImeComposingEvent(event)) return;
 
      if (open && event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        closeCombo();
        return;
      }

      if (disabled || readOnly) return;
 
      if (!open) {
        if (event.key === "ArrowDown") {
          event.preventDefault();
          openCombo("first");
          return;
        }
        if (event.key === "ArrowUp") {
          event.preventDefault();
          openCombo("last");
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
        const custom = (isInputControlled || isFiltering ? filterQuery : "").trim();
        if (allowsCustomValue && custom) {
          cancelBlurCommit();
          setIsFiltering(false);
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
      cancelBlurCommit,
      closeCombo,
      disabled,
      filterQuery,
      filteredValues,
      inputRef,
      isFiltering,
      isInputControlled,
      loading,
      onKeyDown,
      open,
      openCombo,
      optionsByValue,
      readOnly,
      selectValue,
      setActiveValue,
      setFilterQuery,
      setIsFiltering,
      setOpen,
      setValue,
    ],
  );
 
  useEffect(() => {
    if (loading) setActiveValue(null);
  }, [loading, setActiveValue]);
 
  const handleBlur = useCallback(
    (event: FocusEvent<HTMLInputElement>) => {
      onBlur?.(event);
      const related = event.relatedTarget;
      const movingIntoPopup =
        related instanceof Element &&
        (Boolean(document.getElementById(listId)?.contains(related)) ||
          Boolean(anchorRef.current?.contains(related)));
      if (!movingIntoPopup) {
        formOnBlur?.();
      }
      if (event.defaultPrevented || disabled || readOnly || !allowsCustomValue) return;
      if (!isFiltering && !isInputControlled) return;
      const custom = event.currentTarget.value.trim();
      if (!custom) return;
      if (movingIntoPopup) return;
      const generation = blurGeneration.current;
      queueMicrotask(() => {
        if (blurGeneration.current !== generation) return;
        cancelBlurCommit();
        setIsFiltering(false);
        setValue(custom);
        setOpen(false);
        setFilterQuery("");
      });
    },
    [
      allowsCustomValue,
      anchorRef,
      blurGeneration,
      cancelBlurCommit,
      disabled,
      formOnBlur,
      isFiltering,
      isInputControlled,
      listId,
      onBlur,
      readOnly,
      setFilterQuery,
      setIsFiltering,
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

  const displayedInputValue = isInputControlled
    ? filterQuery
    : open
      ? isFiltering
        ? filterQuery
        : selectedDisplayString
      : selectedDisplayString;
 
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
    inputValue: displayedInputValue,
    isMuted: !open && !selectedOption && !displayedInputValue,
    setRefs,
    handleChange,
    handleClick,
    handleKeyDown,
    handleBlur,
  };
}
 
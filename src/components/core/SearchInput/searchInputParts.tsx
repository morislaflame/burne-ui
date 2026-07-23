import type {
  ChangeEvent,
  CSSProperties,
  FocusEvent,
  InputHTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  Ref,
} from "react";
import { IoClose, IoSearch } from "react-icons/io5";

import { Ripple } from "@/components/core/Ripple";
import { useBurneLabel } from "@/theme/BurneLabelsProvider";

import { searchInputClearA11yLabel } from "./searchInputA11y";
import {
  searchInputClearClass,
  searchInputClearIconClass,
  searchInputControlClass,
  searchInputIconClass,
  searchInputIconWrapClass,
} from "./searchInputStyles";
import type { SearchSizeLayout } from "./searchInputTypes";

export function SearchInputRipple({ disabled }: { disabled: boolean }) {
  return <Ripple color="neutral" disabled={disabled} />;
}

export function SearchInputIcon({
  bindIconRef,
  layout,
  className,
}: {
  bindIconRef: (node: HTMLSpanElement | null) => void;
  layout: SearchSizeLayout;
  className?: string;
}) {
  return (
    <span
      ref={bindIconRef}
      className={searchInputIconWrapClass(className)}
      style={{ width: layout.iconBox }}
      aria-hidden
    >
      <IoSearch className={searchInputIconClass(layout.iconClass)} aria-hidden />
    </span>
  );
}

export function SearchInputControl({
  inputRef,
  id,
  disabled,
  readOnly,
  placeholder,
  value,
  defaultValue,
  onChange,
  onBlur,
  onKeyDown,
  expanded,
  ariaLabel,
  layout,
  paddingStyle,
  className,
  rest,
}: {
  inputRef: Ref<HTMLInputElement>;
  id: string;
  disabled?: boolean;
  readOnly?: boolean;
  placeholder?: string;
  value?: InputHTMLAttributes<HTMLInputElement>["value"];
  defaultValue?: InputHTMLAttributes<HTMLInputElement>["defaultValue"];
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  onBlur: (e: FocusEvent<HTMLInputElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
  expanded: boolean;
  ariaLabel: string;
  layout: SearchSizeLayout;
  paddingStyle?: CSSProperties;
  className?: string;
  rest: Omit<
    InputHTMLAttributes<HTMLInputElement>,
    | "size"
    | "type"
    | "id"
    | "disabled"
    | "readOnly"
    | "placeholder"
    | "value"
    | "defaultValue"
    | "onChange"
    | "onBlur"
    | "onKeyDown"
    | "className"
    | "aria-label"
  >;
}) {
  return (
    <input
      ref={inputRef}
      id={id}
      type="search"
      disabled={disabled}
      readOnly={readOnly}
      placeholder={placeholder}
      value={value}
      defaultValue={defaultValue}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      tabIndex={expanded ? 0 : -1}
      aria-label={ariaLabel}
      className={searchInputControlClass({
        controlPad: layout.controlPad,
        expanded,
        slotInput: className,
      })}
      style={paddingStyle}
      {...rest}
    />
  );
}

export function SearchInputClear({
  layout,
  onClick,
  className,
}: {
  layout: SearchSizeLayout;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  className?: string;
}) {
  const clearLabel = useBurneLabel("clearField");
  return (
    <button
      type="button"
      aria-label={searchInputClearA11yLabel(clearLabel)}
      onClick={onClick}
      onPointerDown={(e) => e.stopPropagation()}
      className={searchInputClearClass(className)}
      style={{
        right: layout.padX,
        width: layout.clearTap,
        height: layout.clearTap,
      }}
    >
      <IoClose
        className={searchInputClearIconClass(layout.clearIconClass)}
        aria-hidden
      />
    </button>
  );
}

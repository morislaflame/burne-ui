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
import { useMotionPart } from "@/components/core/utils/slotMotion";
import { useBurneLabel } from "@/theme/BurneLabelsProvider";

import { searchInputClearA11yLabel } from "./searchInputA11y";
import { useOptionalSearchInputMotionScope } from "./searchInputContext";
import {
  SEARCH_INPUT_EXPAND_TRIGGER_CLASS,
  searchInputClearClass,
  searchInputClearIconClass,
  searchInputControlClass,
  searchInputIconClass,
  searchInputIconWrapClass,
} from "./searchInputStyles";
import type { SearchSizeLayout } from "./searchInputTypes";

import { cn } from "@/utils/cn";

export function SearchInputRipple({ disabled }: { disabled: boolean }) {
  return <Ripple color="neutral" disabled={disabled} />;
}

export function SearchInputExpandTrigger({
  blocked,
  inputId,
  collapseA11yLabel,
  className,
  onClick,
  onKeyDown,
}: {
  blocked: boolean;
  inputId: string;
  collapseA11yLabel: string;
  className?: string;
  onClick: (e: MouseEvent<HTMLButtonElement>) => void;
  onKeyDown: (e: KeyboardEvent<HTMLButtonElement>) => void;
}) {
  const { setRef } = useMotionPart<HTMLButtonElement>({
    scope: useOptionalSearchInputMotionScope(),
    slot: "expandTrigger",
  });

  return (
    <button
      ref={setRef}
      type="button"
      data-search-expand=""
      className={cn(SEARCH_INPUT_EXPAND_TRIGGER_CLASS, className)}
      tabIndex={blocked ? -1 : 0}
      disabled={blocked}
      aria-expanded={false}
      aria-controls={inputId}
      aria-label={collapseA11yLabel}
      onClick={onClick}
      onKeyDown={onKeyDown}
    />
  );
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
  const { setRef } = useMotionPart<HTMLSpanElement>({
    scope: useOptionalSearchInputMotionScope(),
    slot: "icon",
  });

  return (
    <span
      ref={(node) => {
        bindIconRef(node);
        setRef(node);
      }}
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
  const { setRef, pointerHandlers } = useMotionPart<HTMLInputElement>({
    scope: useOptionalSearchInputMotionScope(),
    slot: "input",
    forwardedRef: inputRef,
    pointerPhases: true,
  });

  return (
    <input
      ref={setRef}
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
      {...pointerHandlers}
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
  const { setRef, pointerHandlers } = useMotionPart<HTMLButtonElement>({
    scope: useOptionalSearchInputMotionScope(),
    slot: "clear",
    pointerPhases: true,
    onPointerDown: (e) => e.stopPropagation(),
  });

  return (
    <button
      ref={setRef}
      type="button"
      aria-label={searchInputClearA11yLabel(clearLabel)}
      onClick={onClick}
      className={searchInputClearClass(className)}
      style={{
        right: layout.padX,
        width: layout.clearTap,
        height: layout.clearTap,
      }}
      {...pointerHandlers}
    >
      <IoClose
        className={searchInputClearIconClass(layout.clearIconClass)}
        aria-hidden
      />
    </button>
  );
}

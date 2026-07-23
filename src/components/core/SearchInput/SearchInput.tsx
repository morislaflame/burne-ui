import { forwardRef } from "react";

import {
  SearchInputClear,
  SearchInputControl,
  SearchInputIcon,
  SearchInputRipple,
} from "./searchInputParts";
import { SEARCH_INPUT_EXPAND_TRIGGER_CLASS } from "./searchInputStyles";
import type { SearchInputProps } from "./searchInputTypes";
import { useSearchInputRootState } from "./useSearchInputRootState";

import { cn } from "@/utils/cn";

export type {
  SearchInputProps,
  SearchInputSize,
  SearchInputVariant,
  SearchInputClassNames,
} from "./searchInputTypes";

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(
    {
      className = "",
      size,
      variant,
      expandedWidth,
      defaultExpanded,
      expanded,
      onExpandedChange,
      collapseOnBlur,
      disabled,
      readOnly,
      placeholder,
      value,
      defaultValue,
      onChange,
      onBlur,
      onKeyDown,
      id,
      "aria-label": ariaLabel,
      ripple,
      groupSegment,
      classNames,
      ...rest
    },
    ref,
  ) {
    const state = useSearchInputRootState({
      className,
      size,
      variant,
      expandedWidth,
      defaultExpanded,
      expanded,
      onExpandedChange,
      collapseOnBlur,
      disabled,
      readOnly,
      placeholder,
      value,
      defaultValue,
      onChange,
      onBlur,
      onKeyDown,
      id,
      "aria-label": ariaLabel,
      ripple,
      groupSegment,
      classNames,
      forwardedRef: ref,
    });

    return (
      <div
        ref={state.bindRootRef}
        role="search"
        data-search-expanded={state.expanded ? "" : undefined}
        onFocusCapture={state.onShellFocusIn}
        onBlurCapture={state.onShellFocusOut}
        className={state.rootClass}
        onPointerDown={state.handleRootPointerDown}
        onPointerEnter={state.handlePointerEnter}
        onPointerLeave={state.handlePointerLeave}
      >
        {!state.expanded ? (
          <button
            type="button"
            data-search-expand=""
            className={cn(
              SEARCH_INPUT_EXPAND_TRIGGER_CLASS,
              state.classNames?.expandTrigger,
            )}
            tabIndex={state.blocked ? -1 : 0}
            disabled={state.blocked}
            aria-expanded={false}
            aria-controls={state.inputId}
            aria-label={state.collapseA11yLabel}
            onClick={state.handleRootClick}
            onKeyDown={state.handleRootKeyDown}
          />
        ) : null}
        {state.ripple ? <SearchInputRipple disabled={state.blocked} /> : null}
        <SearchInputIcon
          bindIconRef={state.bindIconRef}
          layout={state.layout}
          className={state.classNames?.icon}
        />
        <SearchInputControl
          inputRef={state.setInputRef}
          id={state.inputId}
          disabled={state.disabled}
          readOnly={state.readOnly}
          placeholder={state.placeholder}
          value={state.valueProp}
          defaultValue={state.defaultValue}
          onChange={state.handleInputChange}
          onBlur={state.handleInputBlur}
          onKeyDown={state.handleInputKeyDown}
          expanded={state.expanded}
          ariaLabel={state.inputAriaLabel}
          layout={state.layout}
          paddingStyle={state.inputPaddingStyle}
          className={state.classNames?.input}
          rest={rest}
        />
        {state.showClear ? (
          <SearchInputClear
            layout={state.layout}
            onClick={state.handleClearClick}
            className={state.classNames?.clear}
          />
        ) : null}
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";

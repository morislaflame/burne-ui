import { forwardRef } from "react";

import {
  SearchInputClear,
  SearchInputControl,
  SearchInputIcon,
  SearchInputRipple,
} from "./searchInputParts";
import type { SearchInputProps } from "./searchInputTypes";
import { useSearchInputRootState } from "./useSearchInputRootState";

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
        {...(state.expanded
          ? { role: "search" as const, tabIndex: -1 as const }
          : {
              role: "button" as const,
              tabIndex: (state.blocked ? -1 : 0) as 0 | -1,
              onClick: state.handleRootClick,
              onKeyDown: state.handleRootKeyDown,
            })}
        aria-expanded={state.expanded}
        aria-disabled={state.blocked || undefined}
        aria-label={state.expanded ? undefined : state.collapseA11yLabel}
        data-search-expanded={state.expanded ? "" : undefined}
        onFocusCapture={state.onShellFocusIn}
        onBlurCapture={state.onShellFocusOut}
        className={state.rootClass}
        onPointerDown={state.handleRootPointerDown}
        onPointerEnter={state.handlePointerEnter}
        onPointerLeave={state.handlePointerLeave}
      >
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

import { forwardRef, useMemo, useRef, type InputHTMLAttributes, type MutableRefObject } from "react";

import {
  SearchInputClear,
  SearchInputControl,
  SearchInputExpandTrigger,
  SearchInputIcon,
  SearchInputRipple,
} from "./searchInputParts";
import {
  resolveSearchInputMotionDefaults,
  resolveSearchInputMotionParams,
  useSearchInputAnimations,
} from "./searchInputAnimations";
import { SearchInputMotionProvider } from "./searchInputContext";
import { searchInputRootClass } from "./searchInputStyles";
import type { SearchInputMotion, SearchInputProps } from "./searchInputTypes";
import { useSearchInputRootState } from "./useSearchInputRootState";

export type {
  SearchInputProps,
  SearchInputSize,
  SearchInputVariant,
  SearchInputClassNames,
  SearchInputMotion,
  SearchInputPartMotion,
} from "./searchInputTypes";

type SearchInputRest = Omit<
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
      motion,
      ...rest
    },
    ref,
  ) {
    const pointerInsideRef = useRef(false);
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

    const motionDefaults = useMemo(
      () =>
        resolveSearchInputMotionDefaults({
          isGloss: state.isGloss,
          blocked: state.blocked,
          groupSegment: state.groupSegment,
          expanded: state.expanded,
        }),
      [state.blocked, state.expanded, state.groupSegment, state.isGloss],
    );
    const motionParams = useMemo(
      () =>
        resolveSearchInputMotionParams({
          size: state.size,
          layout: state.layout,
          targetW: state.targetW,
          expanded: state.expanded,
          blocked: state.blocked,
          isGloss: state.isGloss,
          groupSegment: state.groupSegment,
          pointerInside: pointerInsideRef,
        }),
      [
        state.blocked,
        state.expanded,
        state.groupSegment,
        state.isGloss,
        state.layout,
        state.size,
        state.targetW,
      ],
    );

    return (
      <SearchInputMotionProvider motion={motion} defaults={motionDefaults} params={motionParams}>
        <SearchInputSurface
          state={state}
          motion={motion}
          rest={rest}
          pointerInsideRef={pointerInsideRef}
        />
      </SearchInputMotionProvider>
    );
  },
);

SearchInput.displayName = "SearchInput";

function SearchInputSurface({
  state,
  motion,
  rest,
  pointerInsideRef,
}: {
  state: ReturnType<typeof useSearchInputRootState>;
  motion?: SearchInputMotion;
  rest: SearchInputRest;
  pointerInsideRef: MutableRefObject<boolean>;
}) {
  const animations = useSearchInputAnimations({
    size: state.size,
    expanded: state.expanded,
    blocked: state.blocked,
    isGloss: state.isGloss,
    groupSegment: state.groupSegment,
    layout: state.layout,
    targetW: state.targetW,
    motion,
    rootRef: state.rootRef,
    iconRef: state.iconRef,
    pointerInsideRef,
  });

  const rootClass = searchInputRootClass({
    size: state.size,
    variant: state.variant,
    expanded: state.expanded,
    blocked: state.blocked,
    isGloss: state.isGloss,
    groupSegment: state.groupSegment,
    shellHoverMotionClass: animations.shellHoverMotionClass,
    standardMotionClass: animations.standardMotionClass,
    className: state.className,
    slotRoot: state.classNames?.root,
  });

  return (
    <div
      ref={animations.bindRootRef}
      role="search"
      data-search-expanded={state.expanded ? "" : undefined}
      onFocusCapture={animations.onShellFocusIn}
      onBlurCapture={animations.onShellFocusOut}
      className={rootClass}
      onPointerDown={() => animations.beginPressSqueeze()}
      onPointerEnter={animations.handlePointerEnter}
      onPointerLeave={animations.handlePointerLeave}
    >
      {!state.expanded ? (
        <SearchInputExpandTrigger
          blocked={state.blocked}
          inputId={state.inputId}
          collapseA11yLabel={state.collapseA11yLabel}
          className={state.classNames?.expandTrigger}
          onClick={(e) => state.handleRootClick(e, animations.awaitPressSqueeze)}
          onKeyDown={(e) => state.handleRootKeyDown(e, animations.awaitPressSqueeze)}
        />
      ) : null}
      {state.ripple ? <SearchInputRipple disabled={state.blocked} /> : null}
      <SearchInputIcon
        bindIconRef={animations.bindIconRef}
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
}

import { forwardRef, useMemo, useRef, type ForwardedRef, type InputHTMLAttributes, type MutableRefObject } from "react";

import { dataFlag, dataGroupSegment, dataVariantProps } from "@/components/core/utils/dataContract";
import { readOnlyData } from "@/components/core/utils/fieldFormDom";
import {
  dataInvalidValue,
  fieldPaintStatus,
  useResolvedFieldInvalid,
} from "@/components/core/utils/fieldInvalid";
import { useSkinRegistryRevision } from "@/skins/skinContext";
 
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
 
export const SearchInput = forwardRef<HTMLDivElement, SearchInputProps>(
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
      name,
      placeholder,
      value,
      defaultValue,
      onChange,
      onBlur,
      onKeyDown,
      id,
      "aria-label": ariaLabel,
      invalid,
      ripple,
      groupSegment,
      classNames,
      inputRef,
      motion,
      motionController,
      motionState,
      motionPayload,
      playInitialState,
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
      name,
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
      inputRef,
    });
 
    const skinRevision = useSkinRegistryRevision();
    const motionDefaults = useMemo(() => {
      void skinRevision;
      return resolveSearchInputMotionDefaults({
        variant: state.variant,
        blocked: state.blocked,
        readOnly: state.readOnly,
        groupSegment: state.groupSegment,
        expanded: state.expanded,
      });
    }, [skinRevision, state.blocked, state.expanded, state.groupSegment, state.readOnly, state.variant]);
    const motionParams = useMemo(
      () =>
        resolveSearchInputMotionParams({
          size: state.size,
          layout: state.layout,
          targetW: state.targetW,
          blocked: state.blocked,
          variant: state.variant,
          groupSegment: state.groupSegment,
          pointerInside: pointerInsideRef,
        }),
      [
        state.blocked,
        state.groupSegment,
        state.variant,
        state.layout,
        state.size,
        state.targetW,
      ],
    );
 
    return (
      <SearchInputMotionProvider
        motion={motion}
        defaults={motionDefaults}
        params={motionParams}
        controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}
      >
        <SearchInputSurface
          state={state}
          motion={motion}
          invalid={invalid}
          rest={rest}
          pointerInsideRef={pointerInsideRef}
          forwardedRef={ref}
        />
      </SearchInputMotionProvider>
    );
  },
);
 
SearchInput.displayName = "SearchInput";
 
function SearchInputSurface({
  state,
  motion,
  invalid,
  rest,
  pointerInsideRef,
  forwardedRef,
}: {
  state: ReturnType<typeof useSearchInputRootState>;
  motion?: SearchInputMotion;
  invalid?: boolean;
  rest: SearchInputRest;
  pointerInsideRef: MutableRefObject<boolean>;
  forwardedRef: ForwardedRef<HTMLDivElement>;
}) {
  const ariaInvalid = rest["aria-invalid"];
  const isInvalid = useResolvedFieldInvalid({
    invalid,
    errorConnected: ariaInvalid === true || ariaInvalid === "true",
    formInvalid: state.formInvalid,
  });
  const status = fieldPaintStatus(isInvalid);

  const animations = useSearchInputAnimations({
    size: state.size,
    expanded: state.expanded,
    blocked: state.blocked,
    readOnly: state.readOnly,
    variant: state.variant,
    groupSegment: state.groupSegment,
    layout: state.layout,
    targetW: state.targetW,
    motion,
    rootRef: state.rootRef,
    iconRef: state.iconRef,
    pointerInsideRef,
    forwardedRef,
  });
 
  const rootClass = searchInputRootClass({
    size: state.size,
    variant: state.variant,
    status,
    expanded: state.expanded,
    blocked: state.blocked,
    groupSegment: state.groupSegment,
    shellHoverMotionClass: animations.shellHoverMotionClass,
    className: state.className,
    slotRoot: state.classNames?.root,
  });
 
  return (
    <div
      ref={animations.bindRootRef}
      role="search"
      data-group-segment={dataGroupSegment(state.groupSegment != null)}
      style={state.expanded ? { width: state.targetW } : undefined}
      className={rootClass}
      onPointerDown={(e) => animations.beginPressSqueeze(e)}
      onPointerEnter={animations.handlePointerEnter}
      onPointerLeave={animations.handlePointerLeave}
      {...dataVariantProps({ size: state.size, variant: state.variant })}
      data-state={state.expanded ? "expanded" : "collapsed"}
      data-invalid={dataInvalidValue(isInvalid)}
      data-disabled={dataFlag(state.disabled)}
      data-readonly={readOnlyData(state.readOnly)}
    >
      {!state.expanded ? (
        <SearchInputExpandTrigger
          triggerRef={state.expandTriggerRef}
          blocked={state.blocked}
          inputId={state.inputId}
          collapseA11yLabel={state.collapseA11yLabel}
          className={state.classNames?.expandTrigger}
          onClick={state.handleRootClick}
          onKeyDown={state.handleRootKeyDown}
        />
      ) : null}
      {state.ripple ? <SearchInputRipple disabled={state.blocked || state.readOnly} /> : null}
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
        isInvalid={isInvalid}
        rest={{ ...rest, name: state.name }}
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
 
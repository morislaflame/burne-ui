import type { PointerEventHandler, ReactNode } from "react";
import { forwardRef, useMemo, useRef } from "react";

import { Field } from "@/components/core/Field";
import type { LabelProps } from "@/components/core/Label";

import "@/components/core/utils/glossInteractive.css";

import { FIELD_CONTROL_MOBILE_NO_ZOOM_CLASS } from "@/components/core/utils/fieldControlMobileNoZoom";
import { mergeForwardedRef } from "@/components/core/utils/mergeRefs";
import { mergeMotionSlotMaps, useMotionPart } from "@/components/core/utils/slotMotion";
import { useBurneLabels } from "@/theme/BurneLabelsProvider";

import {
  resolveTimeFieldMotionDefaults,
  resolveTimeFieldMotionParams,
  useTimeFieldShellAnimations,
} from "./timeFieldAnimations";
import { timeFieldHintStatus, timeFieldSegLabel, timeFieldSegSpinbuttonA11y } from "./timeFieldA11y";
import {
  TimeFieldMotionProvider,
  useOptionalTimeFieldMotionScope,
  useTimeFieldClassNames,
  useTimeFieldContext,
} from "./timeFieldContext";
import { TIME_FIELD_KEYBOARD_INPUT_CLASS, timeFieldAffixSlotClass, timeFieldSegmentClass, timeFieldSegmentGroupClass, timeFieldSegmentSeparatorClass, timeFieldSegmentsClass, timeFieldShellClass, timeFieldShellInnerClass } from "./timeFieldStyles";
import type {
  TimeFieldControlProps,
  TimeFieldErrorProps,
  TimeFieldHintProps,
  TimeFieldPartMotion,
  TimeFieldSimpleBodyProps,
} from "./timeFieldTypes";
import { useTimeFieldControlState } from "./useTimeFieldControlState";

import { cn } from "@/utils/cn";

function TimeFieldAffixSlot({
  side,
  status,
  size,
  className,
  children,
}: {
  side: "prefix" | "suffix";
  status: ReturnType<typeof useTimeFieldControlState>["status"];
  size: ReturnType<typeof useTimeFieldControlState>["size"];
  className?: string;
  children: ReactNode;
}) {
  const { setRef, pointerHandlers } = useMotionPart<HTMLSpanElement>({
    scope: useOptionalTimeFieldMotionScope(),
    slot: side,
    pointerPhases: true,
  });

  return (
    <span
      ref={setRef}
      className={timeFieldAffixSlotClass({ side, status, size, slotClass: className })}
      {...pointerHandlers}
    >
      {children}
    </span>
  );
}

export const TimeFieldControl = forwardRef<HTMLFieldSetElement, TimeFieldControlProps>(
  function TimeFieldControl(props, ref) {
    const {
      value,
      defaultValue,
      onValueChange,
      format,
      disabled,
      size,
      status,
      variant,
      compact,
      prefix,
      suffix,
      segmentSeparator: segmentSeparatorProp,
      className,
      id,
      onPointerDown,
      onPointerEnter,
      onPointerLeave,
      motion,
      ...rest
    } = props;
    const resolvedDisabled = disabled ?? false;
    const resolvedVariant = variant ?? "default";
    const isGloss = resolvedVariant === "gloss";
    const pointerInsideRef = useRef(false);
    const parentScope = useOptionalTimeFieldMotionScope();
    const motionDefaults = useMemo(
      () => resolveTimeFieldMotionDefaults({ isGloss, disabled: resolvedDisabled }),
      [isGloss, resolvedDisabled],
    );
    const motionParams = useMemo(
      () =>
        resolveTimeFieldMotionParams({
          disabled: resolvedDisabled,
          isGloss,
          pointerInside: pointerInsideRef,
        }),
      [isGloss, resolvedDisabled],
    );
    const mergedMotion = mergeMotionSlotMaps(
      parentScope?.getRootMotion(),
      motion ? { shell: motion } : undefined,
    );

    return (
      <TimeFieldMotionProvider motion={mergedMotion} defaults={motionDefaults} params={motionParams}>
        <TimeFieldControlSurface
          forwardedRef={ref}
          value={value}
          defaultValue={defaultValue}
          onValueChange={onValueChange}
          format={format}
          disabled={disabled}
          size={size}
          status={status}
          variant={variant}
          compact={compact}
          prefix={prefix}
          suffix={suffix}
          segmentSeparator={segmentSeparatorProp}
          className={className}
          id={id}
          onPointerDown={onPointerDown}
          onPointerEnter={onPointerEnter}
          onPointerLeave={onPointerLeave}
          pointerInsideRef={pointerInsideRef}
          shellPartMotion={motion}
          rest={rest}
        />
      </TimeFieldMotionProvider>
    );
  },
);

TimeFieldControl.displayName = "TimeFieldControl";

function TimeFieldControlSurface({
  forwardedRef,
  value,
  defaultValue,
  onValueChange,
  format,
  disabled,
  size,
  status,
  variant,
  compact,
  prefix,
  suffix,
  segmentSeparator,
  className,
  id,
  onPointerDown,
  onPointerEnter,
  onPointerLeave,
  pointerInsideRef,
  shellPartMotion,
  rest,
}: {
  forwardedRef: React.ForwardedRef<HTMLFieldSetElement>;
  value?: TimeFieldControlProps["value"];
  defaultValue?: TimeFieldControlProps["defaultValue"];
  onValueChange?: TimeFieldControlProps["onValueChange"];
  format?: TimeFieldControlProps["format"];
  disabled?: TimeFieldControlProps["disabled"];
  size?: TimeFieldControlProps["size"];
  status?: TimeFieldControlProps["status"];
  variant?: TimeFieldControlProps["variant"];
  compact?: TimeFieldControlProps["compact"];
  prefix?: TimeFieldControlProps["prefix"];
  suffix?: TimeFieldControlProps["suffix"];
  segmentSeparator?: TimeFieldControlProps["segmentSeparator"];
  className?: string;
  id?: string;
  onPointerDown?: PointerEventHandler<HTMLFieldSetElement>;
  onPointerEnter?: TimeFieldControlProps["onPointerEnter"];
  onPointerLeave?: TimeFieldControlProps["onPointerLeave"];
  pointerInsideRef: React.MutableRefObject<boolean>;
  shellPartMotion?: TimeFieldPartMotion;
  rest: Omit<
    TimeFieldControlProps,
    | "value"
    | "defaultValue"
    | "onValueChange"
    | "format"
    | "disabled"
    | "size"
    | "status"
    | "variant"
    | "compact"
    | "prefix"
    | "suffix"
    | "segmentSeparator"
    | "className"
    | "id"
    | "onPointerDown"
    | "onPointerEnter"
    | "onPointerLeave"
    | "motion"
  >;
}) {
  const labels = useBurneLabels();
  const slotClassNames = useTimeFieldClassNames();
  const state = useTimeFieldControlState({
    value,
    defaultValue,
    onValueChange,
    format,
    disabled,
    size,
    status,
    variant,
    compact,
    id,
  });
  const {
    bindShellRef,
    shellPointerDown,
    shellPointerUp,
    shellPointerEnter,
    shellPointerLeave,
    shellFocusCapture,
    shellBlurCapture,
    glossShellHoverMotionClass,
    standardShellHoverMotionClass,
    glossDisabledAttr,
  } = useTimeFieldShellAnimations({
    shellRef: state.shellRef,
    disabled: state.disabled,
    variant: state.variant,
    motion: shellPartMotion,
    pointerInsideRef,
    onPointerDown,
  });
  const { setRef: setSegmentsRef, pointerHandlers: segmentsPointer } = useMotionPart<HTMLDivElement>({
    scope: useOptionalTimeFieldMotionScope(),
    slot: "segments",
    pointerPhases: true,
  });

  return (
    <fieldset
      ref={(node) => {
        mergeForwardedRef(forwardedRef, node);
        state.bindShellRef(node);
        bindShellRef(node);
      }}
      id={state.controlId}
      aria-label={state.shellAria["aria-label"]}
      aria-labelledby={state.shellAria["aria-labelledby"]}
      aria-describedby={state.ariaDescribedBy}
      data-slot="timefield-shell"
      onPointerDown={shellPointerDown}
      onPointerUp={shellPointerUp}
      onPointerEnter={(e) => {
        onPointerEnter?.(e);
        if (e.defaultPrevented) return;
        shellPointerEnter?.(e);
      }}
      onPointerLeave={(e) => {
        onPointerLeave?.(e);
        if (e.defaultPrevented) return;
        shellPointerLeave?.(e);
      }}
      onFocusCapture={shellFocusCapture}
      onBlurCapture={shellBlurCapture}
      {...glossDisabledAttr}
      className={timeFieldShellClass({
        variant: state.variant,
        status: state.status,
        disabled: state.disabled,
        size: state.size,
        compact: state.compact,
        shellSurface: state.shellSurface,
        glossShellHoverMotionClass,
        standardShellHoverMotionClass,
        slotClass: slotClassNames.shell,
        className,
      })}
      {...rest}
    >
      <div
        className={timeFieldShellInnerClass({
          variant: state.variant,
          slotClass: slotClassNames.shellInner,
        })}
        onClick={state.handleShellClick}
      >
        {prefix != null ? (
          <TimeFieldAffixSlot
            side="prefix"
            status={state.status}
            size={state.size}
            className={slotClassNames.prefix}
          >
            {prefix}
          </TimeFieldAffixSlot>
        ) : null}

        <div
          ref={setSegmentsRef}
          className={timeFieldSegmentsClass({
            variant: state.variant,
            size: state.size,
            compact: state.compact,
            slotClass: slotClassNames.segments,
          })}
          {...segmentsPointer}
        >
          <input
            ref={state.keyboardInputRef}
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="off"
            aria-hidden
            tabIndex={-1}
            disabled={state.disabled}
            className={cn(
              TIME_FIELD_KEYBOARD_INPUT_CLASS,
              slotClassNames.keyboardInput,
              FIELD_CONTROL_MOBILE_NO_ZOOM_CLASS,
            )}
            onInput={state.handleKeyboardInput}
            onKeyDown={state.handleKeyboardInputKeyDown}
            onBlur={state.handleFieldBlur}
          />
          {state.segments.map((seg, i) => (
            <span
              key={seg}
              className={timeFieldSegmentGroupClass({
                slotClass: slotClassNames.segmentGroup,
              })}
            >
              {i > 0 && (
                <span
                  aria-hidden
                  className={timeFieldSegmentSeparatorClass({
                    variant: state.variant,
                    slotClass: slotClassNames.segmentSeparator,
                  })}
                >
                  {segmentSeparator ?? ":"}
                </span>
              )}
              <span
                ref={state.segRefById[seg]}
                {...timeFieldSegSpinbuttonA11y({
                  seg,
                  value: state.hms[seg],
                  required: state.required,
                  isDanger: state.status === "danger",
                  isFirstSegment: seg === state.segments[0],
                  disabled: state.disabled,
                  segLabel: timeFieldSegLabel(seg, labels),
                })}
                className={timeFieldSegmentClass({
                  variant: state.variant,
                  focused: state.focusedSeg === seg,
                  disabled: state.disabled,
                  slotClass: slotClassNames.segment,
                })}
                onKeyDown={(e) => state.handleSegKeyDown(e, seg)}
                onFocus={() => state.handleSegFocus(seg)}
                onBlur={state.handleFieldBlur}
                onClick={(e) => state.handleSegClick(e, seg)}
              >
                {state.segDisplay(seg)}
              </span>
            </span>
          ))}
        </div>

        {suffix != null ? (
          <TimeFieldAffixSlot
            side="suffix"
            status={state.status}
            size={state.size}
            className={slotClassNames.suffix}
          >
            {suffix}
          </TimeFieldAffixSlot>
        ) : null}
      </div>
    </fieldset>
  );
}

export function TimeFieldLabel({ className, classNames, ...rest }: LabelProps) {
  const slotClassNames = useTimeFieldClassNames();

  return (
    <Field.Label
      className={className}
      classNames={{
        ...classNames,
        root: cn(slotClassNames.label, classNames?.root),
      }}
      {...rest}
    />
  );
}

TimeFieldLabel.displayName = "TimeFieldLabel";

export function TimeFieldHint({
  children,
  id: idProp,
  className,
  ...rest
}: TimeFieldHintProps) {
  const ctx = useTimeFieldContext();
  const slotClassNames = useTimeFieldClassNames();

  return (
    <Field.Hint
      id={idProp ?? ctx.hintId}
      status={timeFieldHintStatus(ctx.status)}
      className={cn(slotClassNames.hint, className)}
      {...rest}
    >
      {children}
    </Field.Hint>
  );
}

TimeFieldHint.displayName = "TimeFieldHint";

export function TimeFieldError({
  children,
  id: idProp,
  className,
  ...rest
}: TimeFieldErrorProps) {
  const ctx = useTimeFieldContext();
  const slotClassNames = useTimeFieldClassNames();

  return (
    <Field.Error
      id={idProp ?? ctx.errorId}
      role="alert"
      className={cn(slotClassNames.error, className)}
      {...rest}
    >
      {children}
    </Field.Error>
  );
}

TimeFieldError.displayName = "TimeFieldError";

export function TimeFieldSimpleBody({
  label,
  hint,
  error,
  labelId,
  controlProps,
}: TimeFieldSimpleBodyProps) {
  const slotClassNames = useTimeFieldClassNames();

  return (
    <>
      {label != null ? (
        <Field.Label id={labelId} classNames={{ root: slotClassNames.label }}>
          {label}
        </Field.Label>
      ) : null}
      <TimeFieldControl {...controlProps} />
      {hint != null && <TimeFieldHint>{hint}</TimeFieldHint>}
      {error != null && <TimeFieldError>{error}</TimeFieldError>}
    </>
  );
}

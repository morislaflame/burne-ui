import type { ReactNode } from "react";
import { forwardRef } from "react";

import { FieldError, FieldHint } from "@/components/core/Field";
import { Label, type LabelProps } from "@/components/core/Label";

import "@/components/core/utils/glossInteractive.css";

import { timeFieldHintStatus, timeFieldSegSpinbuttonA11y } from "./timeFieldA11y";
import { mergeTimeFieldSlotClass } from "./timeFieldAPI";
import {
  useTimeFieldClassNames,
  useTimeFieldContext,
} from "./timeFieldContext";
import {
  TIME_FIELD_KEYBOARD_INPUT_CLASS,
  timeFieldAffixSlotClass,
  timeFieldSegmentClass,
  timeFieldSegmentSeparatorClass,
  timeFieldSegmentsClass,
  timeFieldShellClass,
  timeFieldShellInnerClass,
} from "./timeFieldStyles";
import type {
  TimeFieldControlProps,
  TimeFieldErrorProps,
  TimeFieldHintProps,
  TimeFieldSimpleBodyProps,
} from "./timeFieldTypes";
import { useTimeFieldControlState } from "./useTimeFieldControlState";

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
  return (
    <span className={timeFieldAffixSlotClass({ side, status, size, slotClass: className })}>
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
      className,
      id,
      onPointerDown,
      onPointerEnter,
      onPointerLeave,
      ...rest
    } = props;
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
      onPointerDown,
      onPointerEnter,
      onPointerLeave,
      ref,
    });

    return (
      <fieldset
        ref={state.bindShellRef}
        id={state.controlId}
        aria-label={state.shellAria["aria-label"]}
        aria-labelledby={state.shellAria["aria-labelledby"]}
        aria-describedby={state.ariaDescribedBy}
        data-slot="timefield-shell"
        onPointerDown={state.shellMotion.shellPointerDown}
        onPointerEnter={state.shellMotion.shellPointerEnter}
        onPointerLeave={state.shellMotion.shellPointerLeave}
        onFocusCapture={state.shellMotion.shellFocusCapture}
        onBlurCapture={state.shellMotion.shellBlurCapture}
        {...(state.disabled && state.isGloss ? { "data-gloss-disabled": "" } : {})}
        className={timeFieldShellClass({
          variant: state.variant,
          status: state.status,
          disabled: state.disabled,
          size: state.size,
          compact: state.compact,
          shellSurface: state.shellSurface,
          glossShellHoverMotionClass: state.shellMotion.glossShellHoverMotionClass,
          standardShellHoverMotionClass: state.shellMotion.standardShellHoverMotionClass,
          slotClass: slotClassNames.shell,
          className,
        })}
        {...rest}
      >
        <div
          className={timeFieldShellInnerClass({
            variant: state.variant,
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
          className={timeFieldSegmentsClass({
            variant: state.variant,
            size: state.size,
            compact: state.compact,
            slotClass: slotClassNames.segments,
          })}
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
            className={mergeTimeFieldSlotClass(
              TIME_FIELD_KEYBOARD_INPUT_CLASS,
              slotClassNames.keyboardInput,
            )}
            style={{ fontSize: 16 }}
            onInput={state.handleKeyboardInput}
            onKeyDown={state.handleKeyboardInputKeyDown}
            onBlur={state.handleFieldBlur}
          />
          {state.segments.map((seg, i) => (
            <span key={seg} className="inline-flex items-center">
              {i > 0 && (
                <span
                  aria-hidden
                  className={timeFieldSegmentSeparatorClass({
                    variant: state.variant,
                    slotClass: slotClassNames.segmentSeparator,
                  })}
                >
                  :
                </span>
              )}
              <span
                ref={state.segRefById[seg]}
                {...timeFieldSegSpinbuttonA11y({
                  seg,
                  value: state.hms[seg],
                  isRequired: state.isRequired,
                  isDanger: state.status === "danger",
                  isFirstSegment: seg === state.segments[0],
                  disabled: state.disabled,
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
  },
);

TimeFieldControl.displayName = "TimeFieldControl";

export function TimeFieldLabel({ className, classNames, ...rest }: LabelProps) {
  const slotClassNames = useTimeFieldClassNames();

  return (
    <Label
      className={className}
      classNames={{
        ...classNames,
        root: mergeTimeFieldSlotClass(slotClassNames.label, classNames?.root),
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
    <FieldHint
      id={idProp ?? ctx.hintId}
      status={timeFieldHintStatus(ctx.status)}
      className={mergeTimeFieldSlotClass(slotClassNames.hint, className)}
      {...rest}
    >
      {children}
    </FieldHint>
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
    <FieldError
      id={idProp ?? ctx.errorId}
      role="alert"
      className={mergeTimeFieldSlotClass(slotClassNames.error, className)}
      {...rest}
    >
      {children}
    </FieldError>
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
        <Label id={labelId} classNames={{ root: slotClassNames.label }}>
          {label}
        </Label>
      ) : null}
      <TimeFieldControl {...controlProps} />
      {hint != null && <TimeFieldHint>{hint}</TimeFieldHint>}
      {error != null && <TimeFieldError>{error}</TimeFieldError>}
    </>
  );
}

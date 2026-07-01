import {
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useId,
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
  type PointerEvent,
  type ReactNode,
} from "react";

import { FieldError, FieldHint } from "@/components/core/Field";
import { joinFieldDescribedBy } from "@/components/core/Field/fieldA11y";
import { SelectionThumb, SelectionThumbIcon } from "@/components/core/SelectionThumb";
import { Text } from "@/components/core/Text";

import "@/components/core/utils/glossPanel.css";

import {
  hasSwitchThumbChild,
  mergeSwitchSlotClass,
  partitionSwitchControlChildren,
  useMergedChecked,
} from "./switchAPI";
import { switchFallbackAriaLabel, switchInputId } from "./switchA11y";
import { useSwitchTrackAnimations } from "./switchAnimations";
import {
  useOptionalSwitchFieldContext,
  useSwitchClassNames,
  useSwitchFieldContext,
  useSwitchTrackContext,
  SwitchTrackProvider,
} from "./switchContext";
import {
  SWITCH_CONTENT_COMPOUND_CLASS,
  SWITCH_CONTENT_PASS_THROUGH_CLASS,
  SWITCH_CONTROL_BASE_CLASS,
  SWITCH_ERROR_DISABLED_CLASS,
  SWITCH_FILL_BASE_CLASS,
  SWITCH_FILL_COLOR_CLASS,
  SWITCH_FILL_GLOSS_CLASS,
  SWITCH_FILL_GLOSS_TINT_CLASS,
  SWITCH_HINT_DISABLED_CLASS,
  SWITCH_ICON_BASE_CLASS,
  SWITCH_INPUT_VISUALLY_HIDDEN_CLASS,
  SWITCH_LABEL_CLASS,
  SWITCH_LABEL_COMPOUND_SECONDARY_CLASS,
  SWITCH_LABEL_MOTION_CLASS,
  SWITCH_LABEL_TEXT_CLASS,
  SWITCH_LABEL_TEXT_DISABLED_CLASS,
  SWITCH_LAYOUT,
  SWITCH_SIMPLE_LABEL_TEXT_CLASS,
  SWITCH_SIMPLE_LABEL_WRAP_CLASS,
  SWITCH_THUMB_BASE_CLASS,
  SWITCH_THUMB_GLOSS_CLASS,
  switchControlCellClass,
  switchErrorRow,
  switchFillColorStyle,
  switchLabelCellClass,
  switchSecondaryCellClass,
  switchTrackClass,
  switchTrackCustomStyle,
} from "./switchStyles";
import type {
  SwitchContentProps,
  SwitchControlProps,
  SwitchErrorProps,
  SwitchFillProps,
  SwitchHintProps,
  SwitchIconProps,
  SwitchLabelProps,
  SwitchSize,
  SwitchThumbProps,
  SwitchTrackContextValue,
  SwitchTrackProps,
} from "./switchTypes";

export const SwitchControl = forwardRef<HTMLInputElement, SwitchControlProps>(
  function SwitchControl(
    {
      size: sizeProp,
      iconOff,
      iconOn,
      color,
      gloss = false,
      thickness,
      className,
      classNames: controlClassNames,
      disabled,
      checked,
      defaultChecked,
      onChange,
      id: idProp,
      name,
      value,
      required,
      form,
      autoFocus,
      tabIndex,
      readOnly,
      onBlur,
      onFocus,
      onPointerDown,
      children,
      ...rest
    },
    ref,
  ) {
    const fieldCtx = useOptionalSwitchFieldContext();
    const rootClassNames = useSwitchClassNames();
    const slotClassNames = useMemo(
      () => ({ ...rootClassNames, ...controlClassNames }),
      [controlClassNames, rootClassNames],
    );
    const autoId = useId();
    const inputId = switchInputId(idProp, autoId, fieldCtx?.switchId);
    const hintId = fieldCtx?.hintId ?? `${inputId}-hint`;
    const errorId = fieldCtx?.errorId ?? `${inputId}-error`;
    const size = sizeProp ?? fieldCtx?.size ?? "base";

    const [mergedChecked, setMergedChecked, isControlled] = useMergedChecked(
      checked,
      defaultChecked,
    );
    const [squeezeToken, setSqueezeToken] = useState(0);

    const handleChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const next = e.target.checked;
        if (!isControlled) setMergedChecked(next);
        onChange?.(e);
      },
      [isControlled, onChange, setMergedChecked],
    );

    const handlePointerDown = useCallback(
      (e: PointerEvent<HTMLInputElement>) => {
        onPointerDown?.(e);
        if (e.defaultPrevented || disabled) return;
        setSqueezeToken((t) => t + 1);
        fieldCtx?.setSqueezeToken((t) => t + 1);
      },
      [disabled, fieldCtx, onPointerDown],
    );

    const { "aria-label": ariaLabelProp, ...inputRest } = rest;

    const trackDefaults = {
      size,
      thickness,
      checked: mergedChecked,
      disabled,
      color,
      gloss,
      squeezeToken,
      iconOff,
      iconOn,
      classNames: {
        track: slotClassNames.track,
        fill: slotClassNames.fill,
        thumb: slotClassNames.thumb,
        thumbShell: slotClassNames.thumbShell,
        icon: slotClassNames.icon,
      },
    };

    const { track: compoundTrack } = partitionSwitchControlChildren(children);
    let trackVisual: ReactNode;

    if (compoundTrack != null) {
      trackVisual = isValidElement(compoundTrack)
        ? cloneElement(compoundTrack, trackDefaults)
        : compoundTrack;
    } else if (children != null && hasSwitchThumbChild(children)) {
      trackVisual = (
        <SwitchTrack {...trackDefaults}>
          <SwitchFill />
          {children}
        </SwitchTrack>
      );
    } else if (children != null) {
      trackVisual = children;
    } else {
      trackVisual = <SwitchTrack {...trackDefaults} />;
    }

    return (
      <span
        className={mergeSwitchSlotClass(
          SWITCH_CONTROL_BASE_CLASS,
          fieldCtx != null
            ? switchControlCellClass(fieldCtx.labelPosition)
            : undefined,
          slotClassNames.control,
          className,
        )}
      >
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          role="switch"
          aria-checked={mergedChecked}
          className={mergeSwitchSlotClass(
            SWITCH_INPUT_VISUALLY_HIDDEN_CLASS,
            slotClassNames.input,
          )}
          disabled={disabled}
          name={name}
          value={value}
          required={required}
          form={form}
          autoFocus={autoFocus}
          tabIndex={tabIndex}
          readOnly={readOnly ?? (isControlled && onChange === undefined)}
          onBlur={onBlur}
          onFocus={onFocus}
          aria-describedby={joinFieldDescribedBy(
            fieldCtx?.hintConnected ? hintId : undefined,
            fieldCtx?.errorConnected ? errorId : undefined,
          )}
          aria-label={
            ariaLabelProp ??
            switchFallbackAriaLabel(fieldCtx?.hasTextColumn ?? false)
          }
          onPointerDown={handlePointerDown}
          {...(isControlled
            ? { checked: mergedChecked, onChange: handleChange }
            : { defaultChecked, onChange: handleChange })}
          {...inputRest}
        />
        {trackVisual}
      </span>
    );
  },
);

SwitchControl.displayName = "SwitchControl";

export function SwitchTrack({
  size,
  thickness,
  checked = false,
  disabled,
  color,
  gloss = false,
  squeezeToken = 0,
  iconOff,
  iconOn,
  className,
  classNames: trackClassNames,
  children,
  ...rest
}: SwitchTrackProps) {
  const rootClassNames = useSwitchClassNames();
  const slotClassNames = useMemo(
    () => ({ ...rootClassNames, ...trackClassNames }),
    [rootClassNames, trackClassNames],
  );

  const trackRef = useRef<HTMLSpanElement>(null);
  const trackFillRef = useRef<HTMLSpanElement>(null);
  const thumbRef = useRef<HTMLSpanElement>(null);
  const thumbShellRef = useRef<HTMLSpanElement>(null);
  const thumbFillRef = useRef<HTMLSpanElement>(null);
  const iconOffRef = useRef<HTMLSpanElement>(null);
  const iconOnRef = useRef<HTMLSpanElement>(null);

  useSwitchTrackAnimations({
    checked,
    disabled,
    size,
    thickness,
    squeezeToken,
    trackRef,
    trackFillRef,
    thumbRef,
    thumbShellRef,
    thumbFillRef,
    iconOffRef,
    iconOnRef,
  });

  const ctx = useMemo<SwitchTrackContextValue>(
    () => ({
      checked,
      disabled,
      size,
      color,
      gloss,
      trackFillRef,
      thumbRef,
      thumbShellRef,
      thumbFillRef,
      iconOffRef,
      iconOnRef,
    }),
    [checked, color, disabled, gloss, size],
  );

  const defaultBody = (
    <>
      <SwitchFill />
      <SwitchThumb>
        {iconOff != null ? <SwitchIcon when="off">{iconOff}</SwitchIcon> : null}
        {iconOn != null ? <SwitchIcon when="on">{iconOn}</SwitchIcon> : null}
      </SwitchThumb>
    </>
  );

  return (
    <SwitchTrackProvider value={ctx}>
      <span
        ref={trackRef}
        className={switchTrackClass({
          size,
          thickness,
          gloss,
          slotClass: slotClassNames.track,
          className,
        })}
        style={switchTrackCustomStyle(thickness)}
        aria-hidden
        {...rest}
      >
        {children ?? defaultBody}
      </span>
    </SwitchTrackProvider>
  );
}

SwitchTrack.displayName = "SwitchTrack";

export function SwitchFill({ className, style, ...rest }: SwitchFillProps) {
  const ctx = useSwitchTrackContext();
  const slotClassNames = useSwitchClassNames();
  const trackFillStyle = switchFillColorStyle(ctx.color);

  return (
    <span
      ref={ctx.trackFillRef}
      aria-hidden
      className={mergeSwitchSlotClass(
        SWITCH_FILL_BASE_CLASS,
        ctx.gloss && SWITCH_FILL_GLOSS_CLASS,
        !ctx.color && (ctx.gloss ? SWITCH_FILL_GLOSS_TINT_CLASS : SWITCH_FILL_COLOR_CLASS),
        slotClassNames.fill,
        className,
      )}
      style={{ opacity: 0, ...trackFillStyle, ...style }}
      {...rest}
    />
  );
}

SwitchFill.displayName = "SwitchFill";

export function SwitchThumb({ className, children, ...rest }: SwitchThumbProps) {
  const ctx = useSwitchTrackContext();
  const slotClassNames = useSwitchClassNames();

  return (
    <span
      ref={ctx.thumbRef}
      className={mergeSwitchSlotClass(
        SWITCH_THUMB_BASE_CLASS,
        ctx.gloss && SWITCH_THUMB_GLOSS_CLASS,
        slotClassNames.thumb,
        className,
      )}
      {...rest}
    >
      <SelectionThumb
        active={ctx.checked}
        size={ctx.size}
        gloss={ctx.gloss}
        shellRef={ctx.thumbShellRef}
        fillRef={ctx.thumbFillRef}
        className={slotClassNames.thumbShell}
      >
        {children}
      </SelectionThumb>
    </span>
  );
}

SwitchThumb.displayName = "SwitchThumb";

export function SwitchIcon({ when, children, className, ...rest }: SwitchIconProps) {
  const ctx = useSwitchTrackContext();
  const slotClassNames = useSwitchClassNames();
  const iconRef = when === "off" ? ctx.iconOffRef : ctx.iconOnRef;
  const highlighted = when === "on";
  const visible = when === "off" ? !ctx.checked : ctx.checked;

  return (
    <SelectionThumbIcon
      iconRef={iconRef}
      size={ctx.size}
      highlighted={highlighted}
      gloss={ctx.gloss}
      className={mergeSwitchSlotClass(SWITCH_ICON_BASE_CLASS, slotClassNames.icon, className)}
      style={{ opacity: visible ? 1 : 0 }}
      {...rest}
    >
      {children}
    </SelectionThumbIcon>
  );
}

SwitchIcon.displayName = "SwitchIcon";

export const SwitchContent = forwardRef<HTMLDivElement, SwitchContentProps>(
  function SwitchContent({ className, children, ...rest }, ref) {
    const ctx = useSwitchFieldContext();
    const slotClassNames = useSwitchClassNames();

    return (
      <div
        ref={ref}
        className={mergeSwitchSlotClass(
          SWITCH_CONTENT_PASS_THROUGH_CLASS,
          ctx.isCompound && SWITCH_CONTENT_COMPOUND_CLASS,
          slotClassNames.content,
          className,
        )}
        {...rest}
      >
        {children}
      </div>
    );
  },
);

SwitchContent.displayName = "SwitchContent";

export function SwitchLabel({ children, className, ...rest }: SwitchLabelProps) {
  const field = useSwitchFieldContext();
  const slotClassNames = useSwitchClassNames();
  const sz = SWITCH_LAYOUT[field.size];

  return (
    <span
      ref={(node) => {
        if (field.isCompound && field.useInlineCompoundMotion) {
          field.textMotionRef.current = node;
        }
      }}
      className={mergeSwitchSlotClass(
        SWITCH_LABEL_CLASS,
        field.isCompound && switchLabelCellClass(field.labelPosition),
        field.isCompound &&
          (field.hasCompoundHint || field.hasCompoundError) &&
          SWITCH_LABEL_COMPOUND_SECONDARY_CLASS,
        field.isCompound && field.useInlineCompoundMotion && SWITCH_LABEL_MOTION_CLASS,
        slotClassNames.label,
        className,
      )}
      {...rest}
    >
      <Text
        as="span"
        variant={sz.title}
        inheritColor
        className={mergeSwitchSlotClass(
          SWITCH_LABEL_TEXT_CLASS,
          field.disabled && SWITCH_LABEL_TEXT_DISABLED_CLASS,
          slotClassNames.labelText,
        )}
      >
        {children}
      </Text>
    </span>
  );
}

SwitchLabel.displayName = "SwitchLabel";

export function SwitchHint({ children, className, variant, ...rest }: SwitchHintProps) {
  const ctx = useSwitchFieldContext();
  const slotClassNames = useSwitchClassNames();

  return (
    <FieldHint
      as="span"
      id={ctx.hintId}
      variant={variant ?? SWITCH_LAYOUT[ctx.size].desc}
      className={mergeSwitchSlotClass(
        ctx.isCompound && switchSecondaryCellClass(2, ctx.labelPosition),
        ctx.disabled && SWITCH_HINT_DISABLED_CLASS,
        slotClassNames.hint,
        className,
      )}
      {...rest}
    >
      {children}
    </FieldHint>
  );
}

SwitchHint.displayName = "Switch.Hint";

export function SwitchError({ children, className, ...rest }: SwitchErrorProps) {
  const ctx = useSwitchFieldContext();
  const slotClassNames = useSwitchClassNames();

  return (
    <FieldError
      as="span"
      id={ctx.errorId}
      variant={SWITCH_LAYOUT[ctx.size].desc}
      className={mergeSwitchSlotClass(
        ctx.isCompound &&
          switchSecondaryCellClass(switchErrorRow(ctx.hasCompoundHint), ctx.labelPosition),
        ctx.disabled && SWITCH_ERROR_DISABLED_CLASS,
        slotClassNames.error,
        className,
      )}
      {...rest}
    >
      {children}
    </FieldError>
  );
}

SwitchError.displayName = "Switch.Error";

export function SwitchSimpleBody({
  label,
  hint,
  error,
  hasTextColumn,
  hasHint,
  hasError,
  secondaryLines,
  textColRef,
  size,
  disabled,
  labelPosition,
  hintId,
  errorId,
  controlProps,
}: {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  hasTextColumn: boolean;
  hasHint: boolean;
  hasError: boolean;
  secondaryLines: number;
  textColRef: React.RefObject<HTMLElement | null>;
  size: SwitchSize;
  disabled?: boolean;
  labelPosition: "left" | "right";
  hintId: string;
  errorId: string;
  controlProps: SwitchControlProps;
}) {
  const slotClassNames = useSwitchClassNames();
  const sz = SWITCH_LAYOUT[size];

  return (
    <>
      <SwitchControl
        size={size}
        disabled={disabled}
        className={switchControlCellClass(labelPosition)}
        {...controlProps}
      />
      {hasTextColumn ? (
        <>
          <span
            ref={textColRef}
            className={mergeSwitchSlotClass(
              switchLabelCellClass(labelPosition),
              !secondaryLines && SWITCH_SIMPLE_LABEL_WRAP_CLASS,
              slotClassNames.simpleLabelWrap,
            )}
          >
            <Text
              as="span"
              variant={sz.title}
              inheritColor
              className={mergeSwitchSlotClass(
                SWITCH_SIMPLE_LABEL_TEXT_CLASS,
                disabled && SWITCH_LABEL_TEXT_DISABLED_CLASS,
                slotClassNames.simpleLabelText,
                slotClassNames.labelText,
              )}
            >
              {label}
            </Text>
          </span>
          {hasHint ? (
            <FieldHint
              as="span"
              id={hintId}
              variant={sz.desc}
              className={mergeSwitchSlotClass(
                switchSecondaryCellClass(2, labelPosition),
                disabled && SWITCH_HINT_DISABLED_CLASS,
                slotClassNames.hint,
              )}
            >
              {hint}
            </FieldHint>
          ) : null}
          {hasError ? (
            <FieldError
              as="span"
              id={errorId}
              variant={sz.desc}
              className={mergeSwitchSlotClass(
                switchSecondaryCellClass(hasHint ? 3 : 2, labelPosition),
                disabled && SWITCH_ERROR_DISABLED_CLASS,
                slotClassNames.error,
              )}
            >
              {error}
            </FieldError>
          ) : null}
        </>
      ) : null}
    </>
  );
}

import {
  cloneElement,
  forwardRef,
  isValidElement,
  useCallback,
  useId,
  useState,
  type ChangeEvent,
  type InputHTMLAttributes,
  type LabelHTMLAttributes,
  type PointerEvent,
  type ReactNode,
} from "react";

import { cn } from "@/utils/cn";

import { optionControlCellClass } from "@/components/core/utils/optionControlGridLayout";
import { useOptionalSwitchFieldContext } from "./switchFieldContext";
import { joinFieldDescribedBy } from "@/components/core/Field/fieldA11y";
import { SWITCH_LAYOUT, type SwitchSize } from "./switchGeometry";
import {
  hasSwitchThumbChild,
  partitionSwitchControlChildren,
} from "./partitionSwitchControlChildren";
import {
  SwitchFill,
  SwitchIcon,
  SwitchThumb,
  SwitchTrack,
  type SwitchFillProps,
  type SwitchIconProps,
  type SwitchIconWhen,
  type SwitchThumbProps,
  type SwitchTrackProps,
} from "./switchTrack";

export type { SwitchSize };
export type SwitchLabelPosition = "left" | "right";

export { SWITCH_LAYOUT };

const INPUT_VISUALLY_HIDDEN =
  "absolute m-[-1px] h-px w-px overflow-hidden border-0 p-0 opacity-0 [clip:rect(0,0,0,0)]";

export type SwitchControlProps = Omit<
  LabelHTMLAttributes<HTMLLabelElement>,
  "children" | "htmlFor" | "onChange"
> &
  Omit<InputHTMLAttributes<HTMLInputElement>, "type" | "size" | "children" | "className"> & {
    size?: SwitchSize;
    /**
     * Толщина трека и диаметр кружка. Перекрывает cross-axis из `size`.
     * Число — px; строка — любая CSS-длина (`"0.75rem"`, `"12px"`).
     */
    thickness?: number | string;
    /** Иконка в кружке, когда выключен (цвет primary). Если задана хотя бы одна — primary-заливка кружка при включении. */
    iconOff?: ReactNode;
    /** Иконка в кружке, когда включен (цвет primary-foreground на заливке). */
    iconOn?: ReactNode;
    /** Фон трека во включённом состоянии: CSS-цвет или `linear-gradient(...)`. Заливка кружка всегда primary. */
    color?: string;
    className?: string;
    children?: ReactNode;
  };

export const SwitchControl = forwardRef<HTMLInputElement, SwitchControlProps>(
  function SwitchControl(
    {
      size: sizeProp,
      iconOff,
      iconOn,
      color,
      thickness,
      className,
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
    const autoId = useId();
    const inputId = idProp ?? fieldCtx?.switchId ?? `switch-${autoId}`;
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
      squeezeToken,
      iconOff,
      iconOn,
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
        className={cn(
          "relative inline-flex shrink-0 items-center justify-center",
          fieldCtx != null
            ? optionControlCellClass(fieldCtx.labelPosition === "left" ? "left" : "right")
            : undefined,
          className,
        )}
      >
        <input
          ref={ref}
          id={inputId}
          type="checkbox"
          role="switch"
          aria-checked={mergedChecked}
          className={INPUT_VISUALLY_HIDDEN}
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
          aria-label={ariaLabelProp ?? (!fieldCtx?.hasTextColumn ? "Переключатель" : undefined)}
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

function useMergedChecked(
  checked: boolean | undefined,
  defaultChecked: boolean | undefined,
): [boolean, (next: boolean) => void, boolean] {
  const isControlled = checked !== undefined;
  const [internal, setInternal] = useState(Boolean(defaultChecked));
  const value = isControlled ? Boolean(checked) : internal;
  const setValue = useCallback(
    (next: boolean) => {
      if (!isControlled) setInternal(next);
    },
    [isControlled],
  );
  return [value, setValue, isControlled];
}

export type {
  SwitchTrackProps,
  SwitchFillProps,
  SwitchThumbProps,
  SwitchIconProps,
  SwitchIconWhen,
};

export { SwitchTrack, SwitchFill, SwitchThumb, SwitchIcon };

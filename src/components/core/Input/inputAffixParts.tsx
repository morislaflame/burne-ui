import type { MouseEvent, ReactNode } from "react";
import { IoClose, IoEye, IoEyeOff, IoFolderOpen } from "react-icons/io5";

import { useMotionPart } from "@/components/core/utils/slotMotion";
import { useBurneLabel, useBurneLabels } from "@/theme/BurneLabelsProvider";

import {
  inputFileRemoveAriaLabel,
  inputPasswordHideAriaLabel,
  inputPasswordShowAriaLabel,
} from "./inputA11y";
import { useInputClassNames, useOptionalInputMotionScope } from "./inputContext";
import {
  INPUT_FILE_GLYPH_ICON_CLASS,
  INPUT_FILE_GLYPH_SHELL_CLASS,
  INPUT_FILE_REMOVE_ICON_CLASS,
  INPUT_PASSWORD_TOGGLE_CONTROL,
  INPUT_PASSWORD_TOGGLE_ICON_CLASS,
  INPUT_PASSWORD_TOGGLE_WRAP_CLASS,
  inputAffixSlotClass,
  inputAffixSurfaceClass,
  inputFileRemoveButtonClass,
  inputPasswordToggleButtonClass,
} from "./inputStyles";
import type { InputSize, InputStatus } from "./inputTypes";

import { cn } from "@/utils/cn";

export function AffixSlot({
  side,
  status,
  controlSize,
  children,
}: {
  side: "prefix" | "suffix";
  status: InputStatus;
  controlSize: InputSize;
  children: ReactNode;
}) {
  const slotClassNames = useInputClassNames();
  const { setRef, pointerHandlers } = useMotionPart<HTMLSpanElement>({
    scope: useOptionalInputMotionScope(),
    slot: side,
    pointerPhases: true,
  });

  return (
    <span
      ref={setRef}
      className={inputAffixSlotClass({
        side,
        status,
        size: controlSize,
        slotClass: side === "prefix" ? slotClassNames.prefix : slotClassNames.suffix,
      })}
      {...pointerHandlers}
    >
      {children}
    </span>
  );
}

export function PasswordVisibilityAffix({
  status,
  controlSize,
  visible,
  disabled,
  onToggle,
}: {
  status: InputStatus;
  controlSize: InputSize;
  visible: boolean;
  disabled?: boolean;
  onToggle: () => void;
}) {
  const labels = useBurneLabels();
  const slotClassNames = useInputClassNames();
  const pwd = INPUT_PASSWORD_TOGGLE_CONTROL[controlSize];
  const { setRef, pointerHandlers } = useMotionPart<HTMLButtonElement>({
    scope: useOptionalInputMotionScope(),
    slot: "passwordToggle",
    pointerPhases: true,
    onPointerDown: (e) => e.stopPropagation(),
  });

  return (
    <span
      className={cn(
        INPUT_PASSWORD_TOGGLE_WRAP_CLASS,
        inputAffixSurfaceClass(status),
      )}
    >
      <button
        ref={setRef}
        type="button"
        disabled={disabled}
        aria-label={
          visible
            ? inputPasswordHideAriaLabel(labels.hidePassword)
            : inputPasswordShowAriaLabel(labels.showPassword)
        }
        aria-pressed={visible}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggle();
        }}
        className={inputPasswordToggleButtonClass({
          size: controlSize,
          disabled,
          slotClass: slotClassNames.passwordToggle,
        })}
        {...pointerHandlers}
      >
        {visible ? (
          <IoEyeOff className={cn(INPUT_PASSWORD_TOGGLE_ICON_CLASS, pwd.icon)} aria-hidden />
        ) : (
          <IoEye className={cn(INPUT_PASSWORD_TOGGLE_ICON_CLASS, pwd.icon)} aria-hidden />
        )}
      </button>
    </span>
  );
}

export function FileGlyph({ className }: { className?: string }) {
  const slotClassNames = useInputClassNames();

  return (
    <span
      className={cn(
        INPUT_FILE_GLYPH_SHELL_CLASS,
        slotClassNames.fileGlyph,
        className,
      )}
      aria-hidden
    >
      <IoFolderOpen className={INPUT_FILE_GLYPH_ICON_CLASS} aria-hidden />
    </span>
  );
}

export function FileRemoveButton({
  disabled,
  onRemove,
}: {
  disabled?: boolean;
  onRemove: (e: MouseEvent<HTMLButtonElement>) => void;
}) {
  const removeLabel = inputFileRemoveAriaLabel(useBurneLabel("removeFile"));
  const slotClassNames = useInputClassNames();
  const { setRef, pointerHandlers } = useMotionPart<HTMLButtonElement>({
    scope: useOptionalInputMotionScope(),
    slot: "fileRemove",
    pointerPhases: true,
    onPointerDown: (e) => e.stopPropagation(),
  });

  return (
    <button
      ref={setRef}
      type="button"
      disabled={disabled}
      title={removeLabel}
      aria-label={removeLabel}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onRemove(e);
      }}
      className={inputFileRemoveButtonClass({
        disabled,
        slotClass: slotClassNames.fileRemove,
      })}
      {...pointerHandlers}
    >
      <IoClose className={INPUT_FILE_REMOVE_ICON_CLASS} aria-hidden />
    </button>
  );
}

export function InputFileRow({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  const { setRef, pointerHandlers } = useMotionPart<HTMLDivElement>({
    scope: useOptionalInputMotionScope(),
    slot: "fileRow",
    pointerPhases: true,
  });

  return (
    <div ref={setRef} data-file-row="" className={className} {...pointerHandlers}>
      {children}
    </div>
  );
}


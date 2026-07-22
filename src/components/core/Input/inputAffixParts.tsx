import type { MouseEvent, ReactNode } from "react";
import { IoClose, IoEye, IoEyeOff, IoFolderOpen } from "react-icons/io5";

import { INPUT_PASSWORD_HIDE_ARIA_LABEL, INPUT_PASSWORD_SHOW_ARIA_LABEL, INPUT_FILE_REMOVE_ARIA_LABEL } from "./inputA11y";
import { useInputClassNames } from "./inputContext";
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

  return (
    <span
      className={inputAffixSlotClass({
        side,
        status,
        size: controlSize,
        slotClass: side === "prefix" ? slotClassNames.prefix : slotClassNames.suffix,
      })}
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
  const slotClassNames = useInputClassNames();
  const pwd = INPUT_PASSWORD_TOGGLE_CONTROL[controlSize];

  return (
    <span
      className={cn(
        INPUT_PASSWORD_TOGGLE_WRAP_CLASS,
        inputAffixSurfaceClass(status),
      )}
    >
      <button
        type="button"
        disabled={disabled}
        aria-label={visible ? INPUT_PASSWORD_HIDE_ARIA_LABEL : INPUT_PASSWORD_SHOW_ARIA_LABEL}
        aria-pressed={visible}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggle();
        }}
        onPointerDown={(e) => e.stopPropagation()}
        className={inputPasswordToggleButtonClass({
          size: controlSize,
          disabled,
          slotClass: slotClassNames.passwordToggle,
        })}
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
  const slotClassNames = useInputClassNames();

  return (
    <button
      type="button"
      disabled={disabled}
      title={INPUT_FILE_REMOVE_ARIA_LABEL}
      aria-label={INPUT_FILE_REMOVE_ARIA_LABEL}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onRemove(e);
      }}
      onPointerDown={(e) => e.stopPropagation()}
      className={inputFileRemoveButtonClass({
        disabled,
        slotClass: slotClassNames.fileRemove,
      })}
    >
      <IoClose className={INPUT_FILE_REMOVE_ICON_CLASS} aria-hidden />
    </button>
  );
}


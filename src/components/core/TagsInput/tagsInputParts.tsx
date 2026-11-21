import { forwardRef, useRef, type AriaAttributes, type ReactNode } from "react";

import { Field } from "@/components/core/Field";
import { joinFieldDescribedBy } from "@/components/core/Field/fieldA11y";
import { dataFlag } from "@/components/core/utils/dataContract";
import {
  isImeComposingEvent,
  isInteractiveDescendantTarget,
} from "@/components/core/utils/fieldFormDom";
import { KitClose } from "@/components/core/utils/kitIcons";
import { ariaInvalidValue, dataInvalidValue, fieldPaintStatus } from "@/components/core/utils/fieldInvalid";
import { cn } from "@/utils/cn";

import { tagsInputRemoveLabel } from "./tagsInputA11y";
import { tagsInputPieces } from "./tagsInputAPI";
import {
  useTagsInputChromeSlot,
  useTagsInputShellMotion,
  useTagsInputSlotMotion,
} from "./tagsInputAnimations";
import { useTagsInputClassNames, useTagsInputContext } from "./tagsInputContext";
import {
  tagsInputFieldClass,
  tagsInputRemoveClass,
  tagsInputShellClass,
  tagsInputTagClass,
  tagsInputTagTextClass,
} from "./tagsInputStyles";
import type {
  TagsInputShellProps,
  TagsInputErrorProps,
  TagsInputHintProps,
  TagsInputLabelProps,
  TagsInputRemoveProps,
  TagsInputTagProps,
} from "./tagsInputTypes";

export const TagsInputTag = forwardRef<HTMLSpanElement, TagsInputTagProps>(function TagsInputTag(
  {
    className,
    children,
    motion,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
    ...rest
  },
  ref,
) {
  const field = useTagsInputContext();
  const slotClassNames = useTagsInputClassNames();
  const tag = useTagsInputSlotMotion<HTMLSpanElement>("tag", {
    motion,
    forwardedRef: ref,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });

  return (
    <span
      ref={tag.setRef}
      className={tagsInputTagClass(field.size, field.variant, cn(slotClassNames.tag, className))}
      {...rest}
      {...tag.pointerHandlers}
    >
      {children}
    </span>
  );
});
TagsInputTag.displayName = "TagsInputTag";

type ChipInternalProps = {
  value: string;
  shellRef: React.RefObject<HTMLDivElement | null>;
};

export const TagsInputRemove = forwardRef<HTMLButtonElement, TagsInputRemoveProps>(
  function TagsInputRemove(
    {
      value,
      className,
      children,
      motion,
      onClick,
      onBlur,
      onMouseDown,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const field = useTagsInputContext();
    const slotClassNames = useTagsInputClassNames();
    const remove = useTagsInputSlotMotion<HTMLButtonElement>("remove", {
      motion,
      forwardedRef: ref,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
    });
    const locked = field.disabled || field.readOnly;

    return (
      <button
        ref={remove.setRef}
        type="button"
        className={tagsInputRemoveClass(cn(slotClassNames.remove, className))}
        aria-label={tagsInputRemoveLabel(value)}
        disabled={locked}
        onMouseDown={(event) => {
          onMouseDown?.(event);
          if (!event.defaultPrevented) event.preventDefault();
        }}
        onBlur={(event) => {
          onBlur?.(event);
          const related = event.relatedTarget as Node | null;
          const shellEl = event.currentTarget.closest('[data-skin-slot*="tagsInput.shell"]');
          if (!shellEl || !related || !shellEl.contains(related)) {
            field.notifyBlur?.();
          }
        }}
        onClick={(event) => {
          onClick?.(event);
          if (event.defaultPrevented) return;
          field.remove(value);
        }}
        {...rest}
        {...remove.pointerHandlers}
      >
        {children ?? <KitClose aria-hidden />}
      </button>
    );
  },
);
TagsInputRemove.displayName = "TagsInputRemove";

function TagsInputChip({ value }: Pick<ChipInternalProps, "value">) {
  const slotClassNames = useTagsInputClassNames();

  return (
    <TagsInputTag>
      <span className={tagsInputTagTextClass(slotClassNames.tagText)}>{value}</span>
      <TagsInputRemove value={value} />
    </TagsInputTag>
  );
}

export const TagsInputShell = forwardRef<
  HTMLDivElement,
  TagsInputShellProps & {
    inputAriaProps?: Pick<AriaAttributes, "aria-label" | "aria-labelledby" | "aria-describedby">;
  }
>(function TagsInputShell(
  {
    className,
    inputRef,
    inputAriaProps,
    motion,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
    ...rest
  },
  ref,
) {
  const field = useTagsInputContext();
  const slotClassNames = useTagsInputClassNames();
  const shellLocalRef = useRef<HTMLDivElement | null>(null);
  const draftInputRef = useRef<HTMLInputElement>(null);
  const composingRef = useRef(false);
  const inputPart = useTagsInputSlotMotion<HTMLInputElement>("control");
  const draft = field.inputValue;
  const setDraft = field.setInputValue;
  const shell = useTagsInputShellMotion({
    forwardedRef: ref,
    motion,
    onPointerOver,
    onPointerOut,
    onPointerDown: (event) => {
      onPointerDown?.(event);
      if (event.defaultPrevented || field.disabled) return;
      const inputEl = draftInputRef.current;
      if (!inputEl) return;
      if (isInteractiveDescendantTarget(event.target, inputEl)) return;
      if (event.target !== inputEl) {
        event.preventDefault();
        if (!field.atMax && document.activeElement !== inputEl) {
          inputEl.focus();
        }
      }
    },
    onPointerUp,
  });

  function commit(raw: string) {
    if (field.disabled || field.readOnly) return;
    const tag = raw.trim();
    if (!tag) {
      setDraft("");
      return;
    }
    field.append([tag]);
    setDraft("");
  }

  function onDraftChange(value: string) {
    if (field.disabled || field.readOnly) return;
    const pieces = tagsInputPieces(value);
    if (pieces.committed.length > 0) field.append(pieces.committed);
    setDraft(pieces.rest);
  }

  return (
    <div
      ref={(node) => {
        shellLocalRef.current = node;
        shell.setRef(node);
        field.registerShellRef?.(node);
      }}
      className={tagsInputShellClass({
        size: field.size,
        variant: field.variant,
        status: fieldPaintStatus(field.isInvalid),
        disabled: field.disabled,
        motionClass: shell.motionClass,
        slotClass: cn(slotClassNames.shell, className),
      })}
      {...rest}
      {...shell.pointerHandlers}
    >
      {field.values.map((value) => (
        <TagsInputChip key={value} value={value} />
      ))}
      <input
        ref={(node) => {
          draftInputRef.current = node;
          inputPart.setRef(node);
          field.setInputNodeRef?.(node);
          if (typeof inputRef === "function") inputRef(node);
          else if (inputRef) inputRef.current = node;
        }}
        id={field.inputId}
        className={tagsInputFieldClass(slotClassNames.control)}
        value={draft}
        placeholder={field.values.length === 0 ? field.placeholder : undefined}
        disabled={field.disabled || field.atMax}
        readOnly={field.readOnly}
        required={field.required && field.values.length === 0}
        aria-label={inputAriaProps?.["aria-label"]}
        aria-labelledby={
          inputAriaProps?.["aria-labelledby"] ?? (field.labelled ? field.labelId : undefined)
        }
        aria-describedby={joinFieldDescribedBy(
          field.describedBy,
          inputAriaProps?.["aria-describedby"],
        )}
        onCompositionStart={() => {
          composingRef.current = true;
        }}
        onCompositionEnd={(event) => {
          composingRef.current = false;
          onDraftChange(event.currentTarget.value);
        }}
        onChange={(event) => {
          if (composingRef.current) {
            setDraft(event.target.value);
            return;
          }
          onDraftChange(event.target.value);
        }}
        onBlur={(event) => {
          const shellEl = shellLocalRef.current;
          const related = event.relatedTarget as Node | null;
          if (shellEl && related && shellEl.contains(related)) return;
          if (!composingRef.current) {
            commit(draft);
          }
          field.notifyBlur?.();
        }}
        onKeyDown={(event) => {
          if (isImeComposingEvent(event) || composingRef.current || field.disabled || field.readOnly) {
            return;
          }
          if (event.key === "Enter") {
            event.preventDefault();
            commit(draft);
          }
          if (event.key === "Backspace" && draft === "") field.removeLast();
        }}
        {...inputPart.pointerHandlers}
        aria-invalid={ariaInvalidValue(field.isInvalid)}
        data-invalid={dataInvalidValue(field.isInvalid)}
        data-disabled={dataFlag(field.disabled)}
        data-readonly={dataFlag(field.readOnly)}
        data-required={dataFlag(field.required && field.values.length === 0)}
      />
      {field.name
        ? field.values.map((value) => (
            <input key={`value-${value}`} type="hidden" name={field.name} value={value} />
          ))
        : null}
    </div>
  );
});

TagsInputShell.displayName = "TagsInput.Shell";

export const TagsInputLabel = forwardRef<HTMLElement, TagsInputLabelProps>(function TagsInputLabel(
  {
    children,
    className,
    id: idProp,
    motion,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
    ...rest
  },
  ref,
) {
  const field = useTagsInputContext();
  const slotClassNames = useTagsInputClassNames();
  const part = useTagsInputChromeSlot("label", {
    motion,
    forwardedRef: ref,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });

  return (
    <Field.Label
      ref={part.setRef}
      id={idProp ?? field.labelId}
      className={cn(slotClassNames.label, className)}
      {...rest}
      {...part.pointerHandlers}
    >
      {children ?? field.label}
    </Field.Label>
  );
});

TagsInputLabel.displayName = "TagsInputLabel";

export const TagsInputHint = forwardRef<HTMLElement, TagsInputHintProps>(function TagsInputHint(
  {
    children,
    className,
    id: idProp,
    motion,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
    ...rest
  },
  ref,
) {
  const field = useTagsInputContext();
  const slotClassNames = useTagsInputClassNames();
  const part = useTagsInputChromeSlot("hint", {
    motion,
    forwardedRef: ref,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });

  return (
    <Field.Hint
      ref={part.setRef}
      id={idProp ?? field.hintId}
      className={cn(slotClassNames.hint, className)}
      {...rest}
      {...part.pointerHandlers}
    >
      {children ?? field.hint}
    </Field.Hint>
  );
});

TagsInputHint.displayName = "TagsInputHint";

export const TagsInputError = forwardRef<HTMLElement, TagsInputErrorProps>(function TagsInputError(
  {
    children,
    className,
    id: idProp,
    motion,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
    ...rest
  },
  ref,
) {
  const field = useTagsInputContext();
  const slotClassNames = useTagsInputClassNames();
  const part = useTagsInputChromeSlot("error", {
    motion,
    forwardedRef: ref,
    onPointerOver,
    onPointerOut,
    onPointerDown,
    onPointerUp,
  });

  return (
    <Field.Error
      ref={part.setRef}
      id={idProp ?? field.errorId}
      className={cn(slotClassNames.error, className)}
      {...rest}
      {...part.pointerHandlers}
    >
      {children ?? field.error}
    </Field.Error>
  );
});

TagsInputError.displayName = "TagsInputError";

export function TagsInputSimpleBody({
  inputAriaProps,
}: {
  inputAriaProps?: Pick<AriaAttributes, "aria-label" | "aria-labelledby" | "aria-describedby">;
} = {}) {
  const field = useTagsInputContext();
  return (
    <>
      {field.label != null ? <TagsInputLabel /> : null}
      <TagsInputShell inputAriaProps={inputAriaProps} />
      {field.hint != null ? <TagsInputHint /> : null}
      {field.error != null ? <TagsInputError /> : null}
    </>
  );
}

export function TagsInputCompoundBody({ children }: { children?: ReactNode }) {
  return children;
}

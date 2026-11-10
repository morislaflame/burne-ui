import { forwardRef, useRef, type ReactNode } from "react";

import { Field } from "@/components/core/Field";
import { KitClose } from "@/components/core/utils/kitIcons";
import { ariaInvalidValue, fieldPaintStatus } from "@/components/core/utils/fieldInvalid";
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

export const TagsInputRemove = forwardRef<HTMLButtonElement, TagsInputRemoveProps>(
  function TagsInputRemove(
    {
      value,
      className,
      children,
      motion,
      onClick,
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

function TagsInputChip({ value }: { value: string }) {
  const slotClassNames = useTagsInputClassNames();

  return (
    <TagsInputTag>
      <span className={tagsInputTagTextClass(slotClassNames.tagText)}>{value}</span>
      <TagsInputRemove value={value} />
    </TagsInputTag>
  );
}

export const TagsInputShell = forwardRef<HTMLDivElement, TagsInputShellProps>(function TagsInputShell(
  {
    className,
    inputRef,
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
  const draftInputRef = useRef<HTMLInputElement>(null);
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
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("button, input")) return;
      draftInputRef.current?.focus();
    },
    onPointerUp,
  });

  function commit(raw: string) {
    const tag = raw.trim();
    if (!tag) {
      setDraft("");
      return;
    }
    field.append([tag]);
    setDraft("");
  }

  function onDraftChange(value: string) {
    const pieces = tagsInputPieces(value);
    if (pieces.committed.length > 0) field.append(pieces.committed);
    setDraft(pieces.rest);
  }

  return (
    <div
      ref={shell.setRef}
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
        aria-labelledby={field.labelled ? field.labelId : undefined}
        aria-invalid={ariaInvalidValue(field.isInvalid)}
        aria-describedby={field.describedBy}
        onChange={(event) => onDraftChange(event.target.value)}
        onBlur={() => commit(draft)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            event.preventDefault();
            commit(draft);
          }
          if (event.key === "Backspace" && draft === "") field.removeLast();
        }}
        {...inputPart.pointerHandlers}
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

export function TagsInputSimpleBody() {
  const field = useTagsInputContext();
  return (
    <>
      {field.label != null ? <TagsInputLabel /> : null}
      <TagsInputShell />
      {field.hint != null ? <TagsInputHint /> : null}
      {field.error != null ? <TagsInputError /> : null}
    </>
  );
}

export function TagsInputCompoundBody({ children }: { children?: ReactNode }) {
  return children;
}

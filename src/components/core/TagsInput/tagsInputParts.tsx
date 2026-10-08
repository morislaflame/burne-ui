import { forwardRef, useRef, useState, type ReactNode } from "react";

import { Field } from "@/components/core/Field";
import { KitClose } from "@/components/core/utils/kitIcons";
import { ariaInvalidValue } from "@/components/core/utils/fieldInvalid";
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
  TagsInputControlProps,
  TagsInputErrorProps,
  TagsInputHintProps,
  TagsInputLabelProps,
} from "./tagsInputTypes";

function TagsInputChip({ value }: { value: string }) {
  const field = useTagsInputContext();
  const slotClassNames = useTagsInputClassNames();
  const tag = useTagsInputSlotMotion<HTMLSpanElement>("tag");
  const remove = useTagsInputSlotMotion<HTMLButtonElement>("remove");
  const locked = field.disabled || field.readOnly;

  return (
    <span
      ref={tag.setRef}
      className={tagsInputTagClass(field.size, field.variant, slotClassNames.tag)}
      {...tag.pointerHandlers}
    >
      <span className={tagsInputTagTextClass()}>{value}</span>
      <button
        ref={remove.setRef}
        type="button"
        className={tagsInputRemoveClass(slotClassNames.remove)}
        aria-label={tagsInputRemoveLabel(value)}
        disabled={locked}
        onClick={() => field.remove(value)}
        {...remove.pointerHandlers}
      >
        <KitClose aria-hidden />
      </button>
    </span>
  );
}

export const TagsInputControl = forwardRef<HTMLDivElement, TagsInputControlProps>(function TagsInputControl(
  {
    className,
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
  const inputRef = useRef<HTMLInputElement>(null);
  const inputPart = useTagsInputSlotMotion<HTMLInputElement>("input");
  const [draft, setDraft] = useState("");
  const shell = useTagsInputShellMotion({
    motion,
    forwardedRef: ref,
    onPointerOver,
    onPointerOut,
    onPointerDown: (event) => {
      onPointerDown?.(event);
      const target = event.target;
      if (!(target instanceof Element)) return;
      if (target.closest("button, input")) return;
      inputRef.current?.focus();
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
        status: field.status,
        disabled: field.disabled,
        motionClass: shell.motionClass,
        slotClass: slotClassNames.shell,
        className,
      })}
      {...rest}
      {...shell.pointerHandlers}
    >
      {field.values.map((value) => (
        <TagsInputChip key={value} value={value} />
      ))}
      <input
        ref={(node) => {
          inputRef.current = node;
          inputPart.setRef(node);
        }}
        id={field.inputId}
        className={tagsInputFieldClass(slotClassNames.input)}
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

TagsInputControl.displayName = "TagsInputControl";

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
      status={field.status}
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
      <TagsInputControl />
      {field.hint != null ? <TagsInputHint /> : null}
      {field.error != null ? <TagsInputError /> : null}
    </>
  );
}

export function TagsInputCompoundBody({ children }: { children?: ReactNode }) {
  return children;
}

import type {
  PointerEvent,
  PointerEventHandler,
  TextareaHTMLAttributes,
} from "react";
import { forwardRef, useCallback, useId, useRef } from "react";

import {
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import { useGlossFieldShellMotion } from "@/components/core/utils/glossInteractiveMotion";
import "../utils/glossInteractive.css";
import { useFieldShellHoverLift, FIELD_SHELL_FOCUS_CLASS, FIELD_SHELL_TRANSITION_CLASS, fieldShellHoverClass } from "@/components/core/utils/useFieldShellHoverLift";
import type { ComponentSize } from "@/components/core/utils/componentSize";
import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/controlSizeLayout";
import { joinFieldDescribedBy } from "@/components/core/Field/fieldA11y";
import { cn } from "@/utils/cn";

import { useOptionalTextAreaFieldContext } from "./textareaFieldContext";
import { useTextAreaResize } from "./useTextAreaResize";

export type TextAreaVariant = "default" | "outline" | "gloss";

export type TextAreaStatus = "default" | "danger" | "success" | "warning";

export type TextAreaSize = ComponentSize;

export type TextAreaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  "size"
> & {
  variant?: TextAreaVariant;
  size?: TextAreaSize;
  status?: TextAreaStatus;
  rows?: number;
  resizable?: boolean;
  className?: string;
  onPointerDown?: PointerEventHandler<HTMLDivElement>;
};

const VARIANT_SHELL: Record<Exclude<TextAreaVariant, "gloss">, string> = {
  default: "bg-surface",
  outline: "bg-transparent",
};

const STATUS_TINT_SHELL: Record<Exclude<TextAreaStatus, "default">, string> = {
  danger: "bg-surface-tint-danger",
  success: "bg-surface-tint-success",
  warning: "bg-surface-tint-warning",
};

const TEXTAREA_MIN_H: Record<TextAreaSize, string> = {
  small: "min-h-control-small",
  base: "min-h-control-base",
  mid: "min-h-control-mid",
  large: "min-h-control-large",
};

const TEXTAREA_PY_BY_PX: Record<string, string> = {
  "px-base": "py-xsmall",
  "px-plus": "py-small",
  "px-mid": "py-base",
  "px-large": "py-plus",
};

function textareaControlClass(size: TextAreaSize): string {
  const controlPad = CONTROL_SIZE_LAYOUT[size].controlPad;
  const pxToken = controlPad.match(/\b(px-[\w-]+)\b/)?.[1];
  const py = (pxToken && TEXTAREA_PY_BY_PX[pxToken]) ?? "py-small";
  return controlPad.replace(/\bh-full\b/, "min-h-0").replace(/\bpy-0\b/, py);
}

function TextAreaResizeGrip() {
  return (
    <span aria-hidden className="relative block size-3 shrink-0">
      <span className="absolute bottom-[2px] right-0 block h-px w-[9px] origin-bottom-right rotate-[135deg] bg-[color-mix(in_oklab,var(--color-border)_65%,var(--color-muted))]" />
      <span className="absolute bottom-[6px] right-0 block h-px w-[6px] origin-bottom-right rotate-[135deg] bg-[color-mix(in_oklab,var(--color-border)_65%,var(--color-muted))]" />
    </span>
  );
}

function TextAreaResizeHandle({
  disabled,
  onPointerDown,
}: {
  disabled?: boolean;
  onPointerDown: PointerEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      type="button"
      data-textarea-resize-handle
      aria-label="Изменить высоту"
      disabled={disabled}
      onPointerDown={onPointerDown}
      className={cn(
        "absolute bottom-0 right-0 z-[2] m-0 flex touch-none select-none appearance-none border-0 bg-transparent items-end justify-end p-xsmall",
        disabled ? "cursor-not-allowed opacity-45" : "cursor-ns-resize",
      )}
    >
      <TextAreaResizeGrip />
    </button>
  );
}

export const TextAreaControl = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  function TextAreaControl(
    {
      variant = "default",
      status: statusProp,
      size: sizeProp,
      rows = 1,
      resizable = true,
      placeholder,
      id: idProp,
      disabled,
      readOnly,
      className = "",
      onPointerDown,
      "aria-describedby": ariaDescribedByProp,
      ...rest
    },
    ref,
  ) {
    const fieldCtx = useOptionalTextAreaFieldContext();
    const genId = useId();
    const id = idProp ?? fieldCtx?.textareaId ?? genId;
    const status = statusProp ?? fieldCtx?.status ?? "default";
    const size = sizeProp ?? fieldCtx?.size ?? "base";
    const isRequired = fieldCtx?.isRequired ?? false;
    const hintConnected = fieldCtx?.hintConnected ?? false;
    const errorConnected = fieldCtx?.errorConnected ?? false;
    const hintId = fieldCtx?.hintId;
    const errorId = fieldCtx?.errorId;
    const ariaDescribedBy =
      ariaDescribedByProp ??
      joinFieldDescribedBy(
        hintConnected ? hintId : undefined,
        errorConnected ? errorId : undefined,
      );

    const shellRef = useRef<HTMLDivElement>(null);
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    const setShellRef = useCallback(
      (node: HTMLDivElement | null) => {
        shellRef.current = node;
        if (node && !resizable) node.style.removeProperty("height");
      },
      [resizable],
    );

    const setTextareaRef = useCallback(
      (node: HTMLTextAreaElement | null) => {
        textareaRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const blocked = Boolean(disabled || readOnly);

    const statusTinted =
      status === "danger" || status === "success" || status === "warning";

    const isGloss = variant === "gloss";

    const shellSurface = isGloss
      ? "gloss-control"
      : statusTinted
        ? cn(STATUS_TINT_SHELL[status], "border-token")
        : cn(
            variant === "outline" ? "bg-transparent border-token" : cn(VARIANT_SHELL[variant], "border-token"),
          );

    const standardShellHover = useFieldShellHoverLift(shellRef, !blocked && !isGloss);
    const glossShellMotion = useGlossFieldShellMotion(shellRef, !blocked && isGloss);

    const bindShellRef = useCallback(
      (node: HTMLDivElement | null) => {
        setShellRef(node);
        if (!blocked && isGloss) glossShellMotion.bindShellRef(node);
      },
      [blocked, glossShellMotion, isGloss, setShellRef],
    );

    const { onResizePointerDown } = useTextAreaResize(shellRef, resizable, blocked, size);

    const handleShellPointerDown = useCallback(
      (e: PointerEvent<HTMLDivElement>) => {
        onPointerDown?.(e);
        if (e.defaultPrevented || blocked) return;
        const target = e.target;
        if (target instanceof HTMLElement && target.closest("[data-textarea-resize-handle]")) {
          return;
        }
        const shell = shellRef.current;
        if (!shell || prefersReducedInteractiveHoverLift()) return;
        if (isGloss) {
          glossShellMotion.onShellPointerDown();
          return;
        }
        void animateInteractivePressSqueeze(shell);
      },
      [blocked, glossShellMotion, isGloss, onPointerDown],
    );

    return (
      <div
        ref={bindShellRef}
        data-slot="textarea-shell"
        onPointerDown={handleShellPointerDown}
        onPointerEnter={isGloss ? glossShellMotion.onShellPointerEnter : standardShellHover.onShellPointerEnter}
        onPointerLeave={isGloss ? glossShellMotion.onShellPointerLeave : standardShellHover.onShellPointerLeave}
        onFocusCapture={isGloss ? glossShellMotion.onShellFocusIn : undefined}
        onBlurCapture={isGloss ? glossShellMotion.onShellFocusOut : undefined}
        className={cn(
          "relative w-full overflow-hidden rounded-base border-1",
          isGloss && "relative",
          TEXTAREA_MIN_H[size],
          shellSurface,
          FIELD_SHELL_TRANSITION_CLASS,
          FIELD_SHELL_FOCUS_CLASS,
          isGloss ? glossShellMotion.shellHoverMotionClass : fieldShellHoverClass(!blocked, status),
          !isGloss && standardShellHover.shellHoverMotionClass,
          blocked ? "cursor-not-allowed opacity-55 shadow-token-sm" : "",
          className,
        )}
      >
        <textarea
          ref={setTextareaRef}
          id={id}
          rows={rows}
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          aria-required={isRequired || undefined}
          aria-invalid={status === "danger" ? true : undefined}
          aria-describedby={ariaDescribedBy}
          className={cn(
            "absolute inset-0 box-border block h-full w-full resize-none overflow-auto bg-transparent text-foreground outline-none placeholder:text-muted",
            resizable && "pr-mid",
            textareaControlClass(size),
          )}
          {...rest}
        />
        {resizable ? (
          <TextAreaResizeHandle disabled={blocked} onPointerDown={onResizePointerDown} />
        ) : null}
      </div>
    );
  },
);

TextAreaControl.displayName = "TextAreaControl";

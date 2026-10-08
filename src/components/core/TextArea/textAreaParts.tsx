import type { PointerEventHandler } from "react";
import { forwardRef, useId, useMemo, useRef } from "react";
 
import { Field } from "@/components/core/Field";
import { useSkinRegistryRevision, useSkinVariant } from "@/skins/skinContext";
import { joinFieldDescribedBy } from "@/components/core/Field/fieldA11y";
import { dataVariantProps } from "@/components/core/utils/dataContract";
import { ariaInvalidValue, useResolvedFieldInvalid, visualStatusForInvalid } from "@/components/core/utils/fieldInvalid";
import { mergeMotionSlotMaps, mergeMotionRootSiblings, useMotionPart } from "@/components/core/utils/slotMotion";
 
import { useBurneLabel } from "@/theme/BurneLabelsProvider";
 
import { textAreaResizeHandleAriaLabel } from "./textAreaA11y";
 
import {
  resolveTextAreaMotionDefaults,
  resolveTextAreaMotionParams,
  useTextAreaChromeSlot,
  useTextAreaShellAnimations,
} from "./textAreaAnimations";
import {
  TextAreaMotionProvider,
  useOptionalTextAreaFieldContext,
  useOptionalTextAreaMotionScope,
  useTextAreaClassNames,
  useTextAreaFieldContext,
} from "./textAreaContext";
import { TEXTAREA_RESIZE_GRIP_WRAP_CLASS, textareaControlClassNames, textareaResizeHandleClass, textareaShellClass, textareaShellSurfaceClass } from "./textAreaStyles";
import type {
  TextAreaErrorProps,
  TextAreaHintProps,
  TextAreaLabelProps,
  TextAreaControlProps,
  TextAreaPartMotion,
  TextAreaSimpleBodyProps,
} from "./textAreaTypes";
import { useTextAreaResize } from "./useTextAreaResize";
 
import { cn } from "@/utils/cn";
 
/** Two 1px diagonals: right edge → bottom edge, inside the corner box. */
function TextAreaResizeGrip() {
  return (
    <svg
      aria-hidden
      className={TEXTAREA_RESIZE_GRIP_WRAP_CLASS}
      width={10}
      height={10}
      viewBox="0 0 10 10"
      fill="none"
    >
      {/* Diagonals right→bottom; shorter line kept away from the corner so radius doesn’t hide it. */}
      <path d="M9.5 2.5 L2.5 9.5" stroke="currentColor" strokeWidth={1} />
      <path d="M9.5 5 L5 9.5" stroke="currentColor" strokeWidth={1} />
    </svg>
  );
}
 
function TextAreaResizeHandle({
  disabled,
  className,
  onPointerDown,
  onKeyDown,
}: {
  disabled?: boolean;
  className?: string;
  onPointerDown: PointerEventHandler<HTMLButtonElement>;
  onKeyDown: (e: React.KeyboardEvent<HTMLButtonElement>) => void;
}) {
  const resizeLabel = textAreaResizeHandleAriaLabel(useBurneLabel("resizeHeight"));
  const { setRef, pointerHandlers } = useMotionPart<HTMLButtonElement>({
    scope: useOptionalTextAreaMotionScope(),
    slot: "resizeHandle",
    pointerPhases: true,
    onPointerDown,
  });
  return (
    <button
      ref={setRef}
      type="button"
      data-textarea-resize-handle
      aria-label={resizeLabel}
      disabled={disabled}
      onKeyDown={onKeyDown}
      className={textareaResizeHandleClass({ disabled, slotClass: className })}
      {...pointerHandlers}
    >
      <TextAreaResizeGrip />
    </button>
  );
}
 
export const TextAreaControl = forwardRef<HTMLTextAreaElement, TextAreaControlProps>(
  function TextAreaControl(
    {
      variant: variantProp,
      status: statusProp,
      size: sizeProp,
      rows = 1,
      resizable = true,
      placeholder,
      id: idProp,
      disabled,
      readOnly,
      className,
      onPointerDown,
      "aria-describedby": ariaDescribedByProp,
      motion,
      motionController,
      motionState,
      motionPayload,
      playInitialState,
      ...rest
    },
    ref,
  ) {
    const variant = useSkinVariant(variantProp);
    const fieldCtx = useOptionalTextAreaFieldContext();
    const slotClassNames = useTextAreaClassNames();
    const genId = useId();
    const id = idProp ?? fieldCtx?.textareaId ?? genId;
    const isInvalid = useResolvedFieldInvalid({
      invalid: fieldCtx?.invalid,
      errorConnected: fieldCtx?.errorConnected ?? false,
    });
    const status = visualStatusForInvalid(statusProp ?? fieldCtx?.status, isInvalid, "default");
    const size = sizeProp ?? fieldCtx?.size ?? "base";
    const required = fieldCtx?.required ?? false;
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
    const pointerInsideRef = useRef(false);
    const blocked = Boolean(disabled || readOnly);
 
    const parentScope = useOptionalTextAreaMotionScope();
    const skinRevision = useSkinRegistryRevision();
    const motionDefaults = useMemo(() => {
      void skinRevision;
      return resolveTextAreaMotionDefaults({ variant, blocked });
    }, [blocked, skinRevision, variant]);
    const motionParams = useMemo(
      () => resolveTextAreaMotionParams({ variant, blocked, pointerInside: pointerInsideRef }),
      [blocked, variant],
    );
    const mergedSlots = mergeMotionSlotMaps(
      parentScope?.getRootMotion(),
      motion ? { shell: motion } : undefined,
    );
    const siblings = mergeMotionRootSiblings({
      events: parentScope?.getEvents(),
      states: parentScope?.getStates(),
    });
    const mergedMotion = { ...mergedSlots, ...siblings };
 
    return (
      <TextAreaMotionProvider
        motion={mergedMotion}
        defaults={motionDefaults}
        params={motionParams}
        controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}
      >
        <TextAreaControlSurface
          variant={variant}
          status={status}
          size={size}
          rows={rows}
          resizable={resizable}
          placeholder={placeholder}
          id={id}
          disabled={disabled}
          readOnly={readOnly}
          className={className}
          onPointerDown={onPointerDown}
          required={required}
          isInvalid={isInvalid}
          ariaDescribedBy={ariaDescribedBy}
          slotClassNames={slotClassNames}
          shellRef={shellRef}
          pointerInsideRef={pointerInsideRef}
          shellPartMotion={motion}
          blocked={blocked}
          forwardedRef={ref}
          rest={rest}
        />
      </TextAreaMotionProvider>
    );
  },
);
 
TextAreaControl.displayName = "TextAreaControl";
 
function TextAreaControlSurface({
  variant,
  status,
  size,
  rows,
  resizable,
  placeholder,
  id,
  disabled,
  readOnly,
  className,
  onPointerDown,
  required,
  isInvalid,
  ariaDescribedBy,
  slotClassNames,
  shellRef,
  pointerInsideRef,
  shellPartMotion,
  blocked,
  forwardedRef,
  rest,
}: {
  variant: NonNullable<TextAreaControlProps["variant"]>;
  status: NonNullable<TextAreaControlProps["status"]>;
  size: NonNullable<TextAreaControlProps["size"]>;
  rows: number;
  resizable: boolean;
  placeholder?: string;
  id: string;
  disabled?: boolean;
  readOnly?: boolean;
  className?: string;
  onPointerDown?: TextAreaControlProps["onPointerDown"];
  required: boolean;
  isInvalid: boolean;
  ariaDescribedBy?: string;
  slotClassNames: ReturnType<typeof useTextAreaClassNames>;
  shellRef: React.RefObject<HTMLDivElement | null>;
  pointerInsideRef: React.MutableRefObject<boolean>;
  shellPartMotion?: TextAreaPartMotion;
  blocked: boolean;
  forwardedRef: React.ForwardedRef<HTMLTextAreaElement>;
  rest: Omit<
    TextAreaControlProps,
    | "variant"
    | "status"
    | "size"
    | "rows"
    | "resizable"
    | "placeholder"
    | "id"
    | "disabled"
    | "readOnly"
    | "className"
    | "onPointerDown"
    | "aria-describedby"
    | "motion"
    | "motionController"
  >;
}) {
  const shellSurface = textareaShellSurfaceClass({ variant, status });
  const shellMotion = useTextAreaShellAnimations({
    shellRef,
    blocked,
    variant,
    resizable,
    motion: shellPartMotion,
    pointerInsideRef,
    onPointerDown,
  });
  const { onResizePointerDown, onResizeKeyDown } = useTextAreaResize(
    shellRef,
    resizable,
    blocked,
    size,
  );
  const { setRef, pointerHandlers } = useMotionPart<HTMLTextAreaElement>({
    scope: useOptionalTextAreaMotionScope(),
    slot: "control",
    forwardedRef,
    pointerPhases: true,
  });
 
  return (
    <div
      ref={shellMotion.bindShellRef}
      data-slot="textarea-shell"
      onPointerDown={shellMotion.shellPointerDown}
      onPointerUp={shellMotion.shellPointerUp}
      onPointerEnter={shellMotion.shellPointerEnter}
      onPointerLeave={shellMotion.shellPointerLeave}
      className={textareaShellClass({
        variant,
        status,
        blocked,
        size,
        shellSurface,
        shellHoverMotionClass: shellMotion.shellHoverMotionClass,
        slotClass: slotClassNames.shell,
        className,
      })}
      {...dataVariantProps({ size, variant, status })}
    >
      <textarea
        ref={setRef}
        id={id}
        rows={rows}
        disabled={disabled}
        readOnly={readOnly}
        placeholder={placeholder}
        className={textareaControlClassNames({
          size,
          resizable,
          slotClass: slotClassNames.control,
        })}
        {...rest}
        {...pointerHandlers}
        aria-required={required || undefined}
        aria-invalid={ariaInvalidValue(isInvalid)}
        aria-describedby={ariaDescribedBy}
        data-invalid={isInvalid ? "" : undefined}
        data-required={required ? "" : undefined}
      />
      {resizable ? (
        <TextAreaResizeHandle
          disabled={blocked}
          className={slotClassNames.resizeHandle}
          onPointerDown={onResizePointerDown}
          onKeyDown={onResizeKeyDown}
        />
      ) : null}
    </div>
  );
}
 
export const TextAreaLabel = forwardRef<HTMLElement, TextAreaLabelProps>(
  function TextAreaLabel(
    {
      className,
      classNames,
      motion,
      onPointerOver,
      onPointerOut,
      onPointerDown,
      onPointerUp,
      ...rest
    },
    ref,
  ) {
    const slotClassNames = useTextAreaClassNames();
    const part = useTextAreaChromeSlot("label", {
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
        className={className}
        classNames={{
          ...classNames,
          root: cn(slotClassNames.label, classNames?.root),
        }}
        {...rest}
        {...part.pointerHandlers}
      />
    );
  },
);
 
TextAreaLabel.displayName = "TextAreaLabel";
 
export const TextAreaHint = forwardRef<HTMLElement, TextAreaHintProps>(
  function TextAreaHint(
    {
      children,
      status,
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
    const field = useTextAreaFieldContext();
    const slotClassNames = useTextAreaClassNames();
    const hintStatus = status ?? field.status;
    const part = useTextAreaChromeSlot("hint", {
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
        status={hintStatus}
        className={cn(slotClassNames.hint, className)}
        {...rest}
        {...part.pointerHandlers}
      >
        {children}
      </Field.Hint>
    );
  },
);
 
TextAreaHint.displayName = "TextAreaHint";
 
export const TextAreaError = forwardRef<HTMLElement, TextAreaErrorProps>(
  function TextAreaError(
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
    const field = useTextAreaFieldContext();
    const slotClassNames = useTextAreaClassNames();
    const part = useTextAreaChromeSlot("error", {
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
        {children}
      </Field.Error>
    );
  },
);
 
TextAreaError.displayName = "TextAreaError";
 
export function TextAreaSimpleBody({
  label,
  hint,
  error,
  textareaId,
  labelId,
  size,
  status,
  controlProps,
}: TextAreaSimpleBodyProps) {
  const slotClassNames = useTextAreaClassNames();
 
  return (
    <>
      {label != null ? (
        <TextAreaLabel id={labelId} classNames={{ root: slotClassNames.label }}>
          {label}
        </TextAreaLabel>
      ) : null}
      <TextAreaControl id={textareaId} size={size} status={status} {...controlProps} />
      {hint != null ? <TextAreaHint>{hint}</TextAreaHint> : null}
      {error != null ? <TextAreaError>{error}</TextAreaError> : null}
    </>
  );
}
 
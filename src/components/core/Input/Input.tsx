import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import "../utils/glossInteractive.css";
import { useGlossFieldShellMotion } from "@/components/core/utils/glossInteractiveMotion";
import type {
  ChangeEvent,
  InputHTMLAttributes,
  MouseEvent,
  PointerEvent,
  PointerEventHandler,
  ReactNode,
} from "react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import { useFieldShellHoverLift, FIELD_SHELL_FOCUS_CLASS, FIELD_SHELL_TRANSITION_CLASS, fieldShellHoverClass } from "@/components/core/utils/useFieldShellHoverLift";
import { motionInteractive } from "@/components/core/utils/motionConfig";
import { Text } from "@/components/core/Text";
import type { ButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupSegment";
import {
  buttonGroupOverlapBorderClasses,
  buttonGroupRoundingClasses,
} from "@/components/composite/ButtonGroup/buttonGroupSegment";
import { useOptionalButtonGroupLayout, useOptionalButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupContext";
import { hoverVariant, TEXT_COLOR_TRANSITION } from "@/components/core/utils/hoverVariant";
import { cn } from "@/utils/cn";
import { IoClose, IoFolderOpen, IoEye, IoEyeOff } from "react-icons/io5";

import { useOptionalInputFieldContext } from "./inputFieldContext";
import { joinFieldDescribedBy } from "@/components/core/Field/fieldA11y";
import type { ButtonSize } from "@/components/core/Button";
import type { ComponentSize } from "@/components/core/utils/componentSize";
import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/controlSizeLayout";

function inputSizeFromButtonSize(bs: ButtonSize): InputSize {
  return bs;
}

export type InputVariant = "default" | "outline" | "gloss";

/** Валидация / обратная связь: бордер оболочки и цвет примечания. */
export type InputStatus = "default" | "danger" | "success" | "warning";

/** Совпадает с размерами `Button`: `small` · `base` · `mid` · `large`. */
export type InputSize = ComponentSize;

export type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "type" | "prefix" | "onPointerDown"
> & {
  /** Визуал заливки. */
  variant?: InputVariant;
  /**
   * Высота и отступы поля — как у `Button` того же размера. По умолчанию `base`.
   * `className` применяется к оболочке поля (`data-slot="input-shell"`).
   */
  size?: InputSize;
  /**
   * Склейка в `ButtonGroup`: без скруглений на общей стороне с соседом.
   * Задаётся из `<ButtonGroup>`.
   */
  groupSegment?: ButtonGroupSegment;
  /** Состояние поля */
  status?: InputStatus;
  /** Тип значения: текст, число, пароль или файл (с превью для изображений). */
  inputType?: "text" | "number" | "password" | "file";
  /** Слот слева внутри оболочки, отделён вертикальной чертой. */
  prefix?: ReactNode;
  /** Слот справа внутри оболочки, отделён вертикальной чертой. */
  suffix?: ReactNode;
  /**
   * Нажатие на оболочку поля (включая область префикса/суффикса).
   * Вызывается до анимации сжатия; предотвратите по умолчанию, чтобы отменить squeeze.
   */
  onPointerDown?: PointerEventHandler<HTMLDivElement>;
};

const VARIANT_SHELL: Record<Exclude<InputVariant, "gloss">, string> = {
  default: "bg-surface",
  outline: "bg-transparent",
};

/** Как `Alert`: тонированный фон, бордер не цвет статуса. */
const STATUS_TINT_SHELL: Record<
  Exclude<InputStatus, "default">,
  string
> = {
  danger: "bg-surface-tint-danger",
  success: "bg-surface-tint-success",
  warning: "bg-surface-tint-warning",
};

const STATUS_TINT_AFFIX: Record<
  Exclude<InputStatus, "default">,
  string
> = {
  danger: "bg-surface-tint-danger",
  success: "bg-surface-tint-success",
  warning: "bg-surface-tint-warning",
};


const AFFIX_SURFACE = "bg-primary-tint";

const AFFIX_PADDING: Record<InputSize, string> = {
  small: `${CONTROL_SIZE_LAYOUT.small.affixPadX} ${CONTROL_SIZE_LAYOUT.small.affixText}`,
  base: `${CONTROL_SIZE_LAYOUT.base.affixPadX} ${CONTROL_SIZE_LAYOUT.base.affixText}`,
  mid: `${CONTROL_SIZE_LAYOUT.mid.affixPadX} ${CONTROL_SIZE_LAYOUT.mid.affixText}`,
  large: `${CONTROL_SIZE_LAYOUT.large.affixPadX} ${CONTROL_SIZE_LAYOUT.large.affixText}`,
};

const INPUT_CONTROL: Record<InputSize, string> = {
  small: CONTROL_SIZE_LAYOUT.small.controlPad,
  base: CONTROL_SIZE_LAYOUT.base.controlPad,
  mid: CONTROL_SIZE_LAYOUT.mid.controlPad,
  large: CONTROL_SIZE_LAYOUT.large.controlPad,
};

const INPUT_SHELL_H: Record<InputSize, string> = {
  small: CONTROL_SIZE_LAYOUT.small.h,
  base: CONTROL_SIZE_LAYOUT.base.h,
  mid: CONTROL_SIZE_LAYOUT.mid.h,
  large: CONTROL_SIZE_LAYOUT.large.h,
};

const PASSWORD_TOGGLE_CONTROL: Record<
  InputSize,
  { box: string; icon: string; pad: string }
> = {
  small: {
    box: CONTROL_SIZE_LAYOUT.small.toggleBox,
    icon: CONTROL_SIZE_LAYOUT.small.toggleIcon,
    pad: CONTROL_SIZE_LAYOUT.small.togglePad,
  },
  base: {
    box: CONTROL_SIZE_LAYOUT.base.toggleBox,
    icon: CONTROL_SIZE_LAYOUT.base.toggleIcon,
    pad: CONTROL_SIZE_LAYOUT.base.togglePad,
  },
  mid: {
    box: CONTROL_SIZE_LAYOUT.mid.toggleBox,
    icon: CONTROL_SIZE_LAYOUT.mid.toggleIcon,
    pad: CONTROL_SIZE_LAYOUT.mid.togglePad,
  },
  large: {
    box: CONTROL_SIZE_LAYOUT.large.toggleBox,
    icon: CONTROL_SIZE_LAYOUT.large.toggleIcon,
    pad: CONTROL_SIZE_LAYOUT.large.togglePad,
  },
};

function AffixSlot({
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
  const edge =
    side === "prefix"
      ? "border-r-token"
      : "border-l-token";
  const surface =
    status === "default"
      ? AFFIX_SURFACE
      : STATUS_TINT_AFFIX[status];
  return (
    <span
      className={cn(
        "flex h-full shrink-0 items-center text-muted",
        AFFIX_PADDING[controlSize],
        surface,
        edge,
      )}
    >
      {children}
    </span>
  );
}

type PickedFileEntry = { file: File; previewUrl: string | null };

function PasswordVisibilityAffix({
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
  const surface =
    status === "default"
      ? AFFIX_SURFACE
      : STATUS_TINT_AFFIX[status];
  const pwd = PASSWORD_TOGGLE_CONTROL[controlSize];

  return (
    <span
      className={cn(
        "flex shrink-0 items-stretch border-l-token",
        surface,
      )}
    >
      <button
        type="button"
        disabled={disabled}
        aria-label={visible ? "Скрыть пароль" : "Показать пароль"}
        aria-pressed={visible}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          onToggle();
        }}
        onPointerDown={(e) => e.stopPropagation()}
        className={cn(
          "relative z-10 flex items-center justify-center text-muted outline-none",
          TEXT_COLOR_TRANSITION,
          pwd.box,
          pwd.pad,
          "hover:text-foreground",
          "focus-ring-inset",
          disabled ? "cursor-not-allowed opacity-45" : "cursor-pointer",
        )}
      >
        {visible ? (
          <IoEyeOff className={cn("shrink-0", pwd.icon)} aria-hidden />
        ) : (
          <IoEye className={cn("shrink-0", pwd.icon)} aria-hidden />
        )}
      </button>
    </span>
  );
}

function FileGlyph({ className = "" }: { className?: string }) {
  return (
    <span
      className={cn(
        "flex size-9 shrink-0 items-center justify-center rounded-base bg-surface text-muted border-token",
        className,
      )}
      aria-hidden
    >
      <IoFolderOpen className="icon-mid shrink-0" aria-hidden />
    </span>
  );
}

function assignInputFiles(input: HTMLInputElement, files: File[]) {
  const dt = new DataTransfer();
  files.forEach((f) => dt.items.add(f));
  input.files = dt.files;
}

function animateFileRowExit(rowEl: HTMLElement): Promise<void> {
  killMotion(rowEl);
  return new Promise((resolve) => {
    gsap.to(rowEl, {
      scale: 0.94,
      y: "-0.5rem",
      autoAlpha: 0,
      ...motionInteractive(),
      overwrite: "auto",
      onComplete: () => {
        killMotion(rowEl);
        resolve();
      },
    });
  });
}

function FileRemoveButton({
  disabled,
  title,
  onRemove,
}: {
  disabled?: boolean;
  title: string;
  onRemove: (e: MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      title={title}
      aria-label={title}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        onRemove(e);
      }}
      onPointerDown={(e) => e.stopPropagation()}
      className={cn(
        "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-base text-danger outline-none",
        TEXT_COLOR_TRANSITION,
        hoverVariant("danger"),
        "focus-ring",
        disabled ? "pointer-events-none opacity-40" : "",
      )}
    >
      <IoClose className="icon-mid shrink-0" aria-hidden />
    </button>
  );
}

export const InputControl = forwardRef<HTMLInputElement, InputProps>(
  function InputControl(
    {
      variant = "default",
      status: statusProp,
      size: sizeProp,
      inputType = "text",
      placeholder,
      prefix,
      suffix,
      id: idProp,
      disabled,
      readOnly,
      className = "",
      groupSegment: groupSegmentProp,
      onPointerDown,
      onChange,
      "aria-describedby": ariaDescribedByProp,
      ...rest
    },
    ref,
  ) {
    const fieldCtx = useOptionalInputFieldContext();
    const layoutCtx = useOptionalButtonGroupLayout();
    const groupCtx = useOptionalButtonGroupSegment();
    const genId = useId();
    const id = idProp ?? fieldCtx?.inputId ?? genId;
    const status = statusProp ?? fieldCtx?.status ?? "default";
    const size = sizeProp ?? fieldCtx?.size ?? inputSizeFromButtonSize(groupCtx?.buttonSize ?? "base");
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
    const groupSegment = layoutCtx?.segmented
      ? undefined
      : (groupSegmentProp ?? groupCtx?.segment);
    const shellRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    const setInputRef = useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const blocked = Boolean(disabled || readOnly);

    const statusTinted =
      status === "danger" ||
      status === "success" ||
      status === "warning";

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

    const setShellRef = useCallback(
      (node: HTMLDivElement | null) => {
        shellRef.current = node;
        if (!blocked && isGloss) glossShellMotion.bindShellRef(node);
      },
      [blocked, glossShellMotion, isGloss],
    );

    const handleShellPointerDown = useCallback(
      (e: PointerEvent<HTMLDivElement>) => {
        onPointerDown?.(e);
        if (e.defaultPrevented || blocked || isGloss) return;
        const shell = shellRef.current;
        if (!shell || prefersReducedInteractiveHoverLift()) return;
        void animateInteractivePressSqueeze(shell);
      },
      [blocked, isGloss, onPointerDown],
    );

    const isFile = inputType === "file";
    const isPassword = inputType === "password";
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [pickedFiles, setPickedFiles] = useState<File[]>([]);

    useEffect(() => {
      if (!isPassword) setPasswordVisible(false);
    }, [isPassword]);

    const fileEntries: PickedFileEntry[] = useMemo(
      () =>
        pickedFiles.map((file) => ({
          file,
          previewUrl: file.type.startsWith("image/")
            ? URL.createObjectURL(file)
            : null,
        })),
      [pickedFiles],
    );

    useEffect(() => {
      const urls = fileEntries
        .map((e) => e.previewUrl)
        .filter((u): u is string => u != null);
      return () => {
        for (const u of urls) URL.revokeObjectURL(u);
      };
    }, [fileEntries]);

    useEffect(() => {
      if (!isFile) return;
      const el = inputRef.current;
      const form = el?.form;
      if (!form) return;
      const onFormReset = () => setPickedFiles([]);
      form.addEventListener("reset", onFormReset);
      return () => form.removeEventListener("reset", onFormReset);
    }, [isFile]);

    const handleFileChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        const list = e.target.files;
        setPickedFiles(list ? Array.from(list) : []);
        onChange?.(e);
      },
      [onChange],
    );

    const removePickedFile = useCallback(
      (file: File, rowEl: HTMLElement | null) => {
        if (blocked) return;

        const commit = () => {
          setPickedFiles((prev) => {
            const next = prev.filter((f) => f !== file);
            const input = inputRef.current;
            if (input) assignInputFiles(input, next);
            if (input) {
              onChange?.({
                target: input,
                currentTarget: input,
              } as ChangeEvent<HTMLInputElement>);
            }
            return next;
          });
        };

        if (!rowEl || prefersReducedInteractiveHoverLift()) {
          commit();
          return;
        }

        void animateFileRowExit(rowEl).then(commit);
      },
      [blocked, onChange],
    );

    const onFileRowRemoveClick =
      (file: File) => (e: MouseEvent<HTMLButtonElement>) => {
        const row = e.currentTarget.closest("[data-file-row]");
        removePickedFile(file, row instanceof HTMLElement ? row : null);
      };

    const multipleFiles = pickedFiles.length > 1;
    const fileListEmpty = isFile && pickedFiles.length === 0;

    const shellFileEmptySurface = fileListEmpty
      ? cn(
          isGloss
            ? "gloss-control"
            : statusTinted
              ? STATUS_TINT_SHELL[status]
              : VARIANT_SHELL[variant],
          isGloss ? "" : "border-2 border-dashed border-token",
        )
      : null;

    const showAffixes = !isFile;

    const roundingShell =
      groupSegment != null
        ? cn(
            buttonGroupRoundingClasses(groupSegment),
            buttonGroupOverlapBorderClasses(groupSegment),
            "relative z-0 focus-within:z-[2]",
          )
        : "rounded-base";

    const shellHClass = fileListEmpty ? "" : INPUT_SHELL_H[size];

    return (
      <div
        ref={setShellRef}
        data-slot="input-shell"
        role="presentation"
        onPointerDown={
          isGloss && !blocked
            ? glossShellMotion.onShellPointerDown
            : handleShellPointerDown
        }
        onPointerEnter={
          isGloss && !blocked
            ? glossShellMotion.onShellPointerEnter
            : standardShellHover.onShellPointerEnter
        }
        onPointerLeave={
          isGloss && !blocked
            ? glossShellMotion.onShellPointerLeave
            : standardShellHover.onShellPointerLeave
        }
        onFocusCapture={
          isGloss && !blocked ? glossShellMotion.onShellFocusIn : undefined
        }
        onBlurCapture={
          isGloss && !blocked ? glossShellMotion.onShellFocusOut : undefined
        }
        {...(blocked && isGloss ? { "data-gloss-disabled": "" } : {})}
        className={cn(
          "flex items-stretch overflow-hidden",
          isGloss && "relative",
          groupSegment?.orientation === "horizontal" ? "min-w-0 flex-1" : "w-full",
          fileListEmpty ? "min-h-[7.25rem]" : cn(isGloss ? "" : "border-1", shellHClass),
          roundingShell,
          shellFileEmptySurface ?? shellSurface,
          FIELD_SHELL_TRANSITION_CLASS,
          FIELD_SHELL_FOCUS_CLASS,
          isGloss ? "" : fieldShellHoverClass(!blocked, status),
          isGloss
            ? glossShellMotion.shellHoverMotionClass
            : standardShellHover.shellHoverMotionClass,
          blocked ? "cursor-not-allowed opacity-55 shadow-token-sm" : "",
          className,
        )}
      >
          {showAffixes && prefix != null ? (
            <AffixSlot side="prefix" status={status} controlSize={size}>
              {prefix}
            </AffixSlot>
          ) : null}
          {isFile ? (
            <div
              className={
                fileListEmpty
                  ? "relative flex min-h-[6.5rem] min-w-0 flex-1 flex-col items-center justify-center gap-plus px-large py-xlarge"
                  : cn(
                      "relative min-w-0 flex-1 px-large py-base",
                      multipleFiles
                        ? "flex flex-col gap-base"
                        : cn("flex h-full items-center gap-plus"),
                    )
              }
            >
              {fileListEmpty ? (
                <>
                  <IoFolderOpen
                    className="pointer-events-none size-12 shrink-0 text-muted"
                    aria-hidden
                  />
                  <Text
                    as="span"
                    variant="base"
                    className="pointer-events-none max-w-[18rem] text-center text-muted"
                  >
                    {placeholder ?? "Выберите файл"}
                  </Text>
                </>
              ) : multipleFiles ? (
                fileEntries.map(({ file, previewUrl }) => (
                  <div
                    key={`${file.name}-${file.size}-${file.lastModified}`}
                    data-file-row=""
                    className="flex min-w-0 items-center gap-base"
                  >
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt=""
                        className="size-9 shrink-0 rounded-base border-token object-cover"
                      />
                    ) : (
                      <FileGlyph />
                    )}
                    <Text
                      as="span"
                      variant="base"
                      className="min-w-0 flex-1 truncate"
                    >
                      {file.name}
                    </Text>
                    {!blocked ? (
                      <FileRemoveButton
                        title="Удалить файл"
                        onRemove={onFileRowRemoveClick(file)}
                      />
                    ) : null}
                  </div>
                ))
              ) : (
                <div
                  data-file-row=""
                  className={cn(
                    "flex h-full min-w-0 flex-1 items-center gap-base",
                  )}
                >
                  {fileEntries[0]!.previewUrl ? (
                    <img
                      src={fileEntries[0]!.previewUrl}
                      alt=""
                      className="size-9 shrink-0 rounded-base border-token object-cover"
                    />
                  ) : (
                    <FileGlyph />
                  )}
                  <Text
                    as="span"
                    variant="base"
                    className="min-w-0 flex-1 truncate"
                  >
                    {fileEntries[0]!.file.name}
                  </Text>
                  {!blocked ? (
                    <FileRemoveButton
                      title="Удалить файл"
                      onRemove={onFileRowRemoveClick(fileEntries[0]!.file)}
                    />
                  ) : null}
                </div>
              )}
              <input
                ref={setInputRef}
                id={id}
                type="file"
                disabled={disabled}
                readOnly={readOnly}
                onChange={handleFileChange}
                aria-required={isRequired || undefined}
                aria-invalid={status === "danger" ? true : undefined}
                aria-describedby={ariaDescribedBy}
                className="absolute inset-0 cursor-pointer opacity-0 disabled:cursor-not-allowed"
                {...rest}
              />
            </div>
          ) : (
            <input
              ref={setInputRef}
              id={id}
              type={isPassword ? (passwordVisible ? "text" : "password") : inputType}
              disabled={disabled}
              readOnly={readOnly}
              placeholder={placeholder}
              onChange={onChange}
              aria-required={isRequired || undefined}
              aria-invalid={status === "danger" ? true : undefined}
              aria-describedby={ariaDescribedBy}
              className={cn(
                "min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted",
                INPUT_CONTROL[size],
              )}
              {...rest}
            />
          )}
          {showAffixes && suffix != null ? (
            <AffixSlot side="suffix" status={status} controlSize={size}>
              {suffix}
            </AffixSlot>
          ) : null}
          {showAffixes && isPassword ? (
            <PasswordVisibilityAffix
              status={status}
              controlSize={size}
              visible={passwordVisible}
              disabled={disabled}
              onToggle={() => setPasswordVisible((v) => !v)}
            />
          ) : null}
      </div>
    );
  },
);

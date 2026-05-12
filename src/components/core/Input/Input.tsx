import { animate, remove as removeAnime } from "animejs";
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
import {
  MOTION_INTERACTIVE_EASE,
  MOTION_INTERACTIVE_MS,
} from "@/components/core/utils/motionTokens";
import { Text } from "@/components/core/Text";
import type { ButtonGroupSegment } from "@/components/core/utils/buttonGroupSegment";
import {
  buttonGroupOverlapBorderClasses,
  buttonGroupRoundingClasses,
} from "@/components/core/utils/buttonGroupSegment";
import { cn } from "@/utils/cn";
import { IoClose, IoFolderOpen, IoEye, IoEyeOff } from "react-icons/io5";

export type InputVariant = "default" | "outline";

/** Валидация / обратная связь: бордер оболочки и цвет примечания. */
export type InputStatus = "default" | "danger" | "success" | "warning";

/** Совпадает с размерами `Button` по высоте (`base`, `large`, `xlarge`). Без `small`. */
export type InputSize = "base" | "large" | "xlarge";

export type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "type" | "prefix" | "onPointerDown"
> & {
  /** Визуал заливки. */
  variant?: InputVariant;
  /**
   * Высота и отступы поля — как у `Button` того же размера. По умолчанию `base` (`min-h-8`, `px-plus py-small`).
   */
  size?: InputSize;
  /**
   * Склейка в `ButtonGroup`: без скруглений на общей стороне с соседом.
   * Задаётся из `<ButtonGroup>`.
   */
  groupSegment?: ButtonGroupSegment;
  /** Состояние поля */
  status?: InputStatus;
  /** Подпись над полем. */
  label?: string;
  /** Примечание под полем (опционально). */
  hint?: string;
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

const VARIANT_SHELL: Record<InputVariant, string> = {
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

const STATUS_TINT_FOCUS_BORDER: Record<
  Exclude<InputStatus, "default">,
  string
> = {
  danger: "focus-within:border-danger",
  success: "focus-within:border-success",
  warning: "focus-within:border-warning",
};

/** Слегка насыщеннее оболочки, чтобы префикс/суффикс читался на тоне. */
const STATUS_TINT_AFFIX: Record<
  Exclude<InputStatus, "default">,
  string
> = {
  danger: "bg-surface-tint-danger-strong",
  success: "bg-surface-tint-success-strong",
  warning: "bg-surface-tint-warning-strong",
};

const STATUS_HINT: Record<InputStatus, string> = {
  default: "text-muted",
  danger: "text-danger",
  success: "text-success",
  warning: "text-warning",
};

const AFFIX_SURFACE: Record<InputVariant, string> = {
  default:
    "bg-[color-mix(in_oklab,var(--color-border)_32%,var(--color-surface))]",
  outline:
    "bg-[color-mix(in_oklab,var(--color-border)_22%,transparent)]",
};

const AFFIX_PADDING: Record<InputSize, string> = {
  base: "px-plus text-base leading-[1.2]",
  large: "px-mid text-mid leading-[1.2]",
  xlarge: "px-large text-mid leading-[1.2]",
};

const INPUT_CONTROL: Record<InputSize, string> = {
  base: "px-plus py-small text-base leading-[1.2]",
  large: "px-mid py-base text-mid leading-[1.2]",
  xlarge: "px-large py-base text-mid leading-[1.2]",
};

const INPUT_SHELL_MIN: Record<InputSize, string> = {
  base: "min-h-8",
  large: "min-h-10",
  xlarge: "min-h-12",
};

const PASSWORD_TOGGLE_CONTROL: Record<
  InputSize,
  { box: string; icon: string; pad: string }
> = {
  base: {
    box: "min-h-8 min-w-8",
    icon: "icon-base",
    pad: "px-small",
  },
  large: {
    box: "min-h-10 min-w-10",
    icon: "icon-large",
    pad: "px-base",
  },
  xlarge: {
    box: "min-h-12 min-w-12",
    icon: "icon-large",
    pad: "px-plus",
  },
};

function AffixSlot({
  side,
  variant,
  status,
  controlSize,
  children,
}: {
  side: "prefix" | "suffix";
  variant: InputVariant;
  status: InputStatus;
  controlSize: InputSize;
  children: ReactNode;
}) {
  const edge =
    side === "prefix"
      ? "border-r border-base"
      : "border-l border-base";
  const surface =
    status === "default"
      ? AFFIX_SURFACE[variant]
      : STATUS_TINT_AFFIX[status];
  return (
    <span
      className={cn(
        "flex shrink-0 items-center text-muted",
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
  variant,
  status,
  controlSize,
  visible,
  disabled,
  onToggle,
}: {
  variant: InputVariant;
  status: InputStatus;
  controlSize: InputSize;
  visible: boolean;
  disabled?: boolean;
  onToggle: () => void;
}) {
  const surface =
    status === "default"
      ? AFFIX_SURFACE[variant]
      : STATUS_TINT_AFFIX[status];
  const pwd = PASSWORD_TOGGLE_CONTROL[controlSize];

  return (
    <span
      className={cn(
        "flex shrink-0 items-stretch border-l border-base",
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
          "relative z-10 flex items-center justify-center text-muted outline-none transition-colors",
          pwd.box,
          pwd.pad,
          "hover:text-foreground",
          "focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent",
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
        "flex size-9 shrink-0 items-center justify-center rounded-base bg-surface text-muted border border-base",
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
  removeAnime(rowEl);
  const anim = animate(rowEl, {
    scale: [1, 0.94],
    translateY: [0, "-0.5rem"],
    opacity: [1, 0],
    duration: MOTION_INTERACTIVE_MS,
    ease: MOTION_INTERACTIVE_EASE,
  });
  return Promise.resolve(anim).then(() => {
    removeAnime(rowEl);
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
        "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-base text-danger outline-none transition-colors",
        "hover:bg-[color-mix(in_oklab,var(--color-danger)_14%,transparent)]",
        "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-surface",
        disabled ? "pointer-events-none opacity-40" : "",
      )}
    >
      <IoClose className="icon-mid shrink-0" aria-hidden />
    </button>
  );
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      variant = "default",
      status = "default",
      size = "base",
      label,
      hint,
      inputType = "text",
      placeholder,
      prefix,
      suffix,
      id: idProp,
      disabled,
      readOnly,
      className = "",
      groupSegment,
      onPointerDown,
      onChange,
      ...rest
    },
    ref,
  ) {
    const genId = useId();
    const id = idProp ?? genId;
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

    const shellSurface = statusTinted
      ? cn(
          STATUS_TINT_SHELL[status],
          "border-transparent",
          STATUS_TINT_FOCUS_BORDER[status],
        )
      : cn(
          variant === "outline" ? "surface-outline" : VARIANT_SHELL[variant],
          variant === "outline"
            ? "focus-within:border-accent"
            : "border-base focus-within:border-accent",
        );

    const handleShellPointerDown = useCallback(
      (e: PointerEvent<HTMLDivElement>) => {
        onPointerDown?.(e);
        if (e.defaultPrevented || blocked) return;
        const shell = shellRef.current;
        if (!shell || prefersReducedInteractiveHoverLift()) return;
        void animateInteractivePressSqueeze(shell);
      },
      [blocked, onPointerDown],
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
          statusTinted ? STATUS_TINT_SHELL[status] : VARIANT_SHELL[variant],
          "border-2 border-dashed",
          statusTinted
            ? status === "danger"
              ? "border-danger/50 focus-within:border-danger"
              : status === "success"
                ? "border-success/50 focus-within:border-success"
                : "border-warning/50 focus-within:border-warning"
            : "border-base focus-within:border-accent",
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

    const shellMinClass = fileListEmpty ? "" : INPUT_SHELL_MIN[size];

    return (
      <div
        className={cn(
          "flex w-full flex-col gap-small",
          groupSegment?.orientation === "horizontal" ? "min-w-0 flex-1" : "",
          className,
        )}
      >
        {label ? (
          <label htmlFor={id} className="inline-flex">
            <Text as="span" variant="base" className="font-medium leading-snug">
              {label}
            </Text>
          </label>
        ) : null}
        <div
          ref={shellRef}
          data-slot="input-shell"
          role="presentation"
          onPointerDown={handleShellPointerDown}
          className={cn(
            "flex items-stretch overflow-hidden transition-[border-color,background-color] duration-200 ease-out",
            fileListEmpty ? "min-h-[7.25rem]" : cn("border-1", shellMinClass),
            roundingShell,
            shellFileEmptySurface ?? shellSurface,
            blocked ? "cursor-not-allowed opacity-55" : "",
          )}
        >
          {showAffixes && prefix != null ? (
            <AffixSlot
              side="prefix"
              variant={variant}
              status={status}
              controlSize={size}
            >
              {prefix}
            </AffixSlot>
          ) : null}
          {isFile ? (
            <div
              className={
                fileListEmpty
                  ? "relative flex min-h-[6.5rem] min-w-0 flex-1 flex-col items-center justify-center gap-plus px-mid py-xlarge"
                  : cn(
                      "relative min-w-0 flex-1 px-plus py-base",
                      multipleFiles
                        ? "flex flex-col gap-base"
                        : cn("flex items-center gap-plus", INPUT_SHELL_MIN[size]),
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
                    className="pointer-events-none max-w-[18rem] text-center leading-snug text-muted"
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
                        className="size-9 shrink-0 rounded-base border border-base object-cover"
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
                    "flex min-w-0 flex-1 items-center gap-base",
                    INPUT_SHELL_MIN[size],
                  )}
                >
                  {fileEntries[0]!.previewUrl ? (
                    <img
                      src={fileEntries[0]!.previewUrl}
                      alt=""
                      className="size-9 shrink-0 rounded-base border border-base object-cover"
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
              className={cn(
                "min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted",
                INPUT_CONTROL[size],
              )}
              {...rest}
            />
          )}
          {showAffixes && suffix != null ? (
            <AffixSlot
              side="suffix"
              variant={variant}
              status={status}
              controlSize={size}
            >
              {suffix}
            </AffixSlot>
          ) : null}
          {showAffixes && isPassword ? (
            <PasswordVisibilityAffix
              variant={variant}
              status={status}
              controlSize={size}
              visible={passwordVisible}
              disabled={disabled}
              onToggle={() => setPasswordVisible((v) => !v)}
            />
          ) : null}
        </div>
        {hint ? (
          <Text
            as="p"
            variant="base"
            className={cn("leading-snug", STATUS_HINT[status])}
          >
            {hint}
          </Text>
        ) : null}
      </div>
    );
  }
);

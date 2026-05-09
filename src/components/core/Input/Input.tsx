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
} from "../utils/hoverInteractiveLift";
import {
  MOTION_INTERACTIVE_EASE,
  MOTION_INTERACTIVE_MS,
} from "../utils/motionTokens";

export type InputVariant = "default" | "outline";

/** Валидация / обратная связь: бордер оболочки и цвет примечания. */
export type InputStatus = "default" | "destructive" | "success" | "warning";

export type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "type" | "prefix" | "onPointerDown"
> & {
  /** Визуал заливки. */
  variant?: InputVariant;
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
  default: "bg-b-surface shadow-sm",
  outline: "bg-transparent shadow-none",
};

/** Как `Alert`: тонированный фон, бордер не цвет статуса. */
const STATUS_TINT_SHELL: Record<
  Exclude<InputStatus, "default">,
  string
> = {
  destructive:
    "bg-[color-mix(in_oklab,var(--b-color-destructive)_16%,var(--b-color-surface))]",
  success:
    "bg-[color-mix(in_oklab,#22c55e_16%,var(--b-color-surface))]",
  warning:
    "bg-[color-mix(in_oklab,#f59e0b_16%,var(--b-color-surface))]",
};

/** Слегка насыщеннее оболочки, чтобы префикс/суффикс читался на тоне. */
const STATUS_TINT_AFFIX: Record<
  Exclude<InputStatus, "default">,
  string
> = {
  destructive:
    "bg-[color-mix(in_oklab,var(--b-color-destructive)_22%,var(--b-color-surface))]",
  success:
    "bg-[color-mix(in_oklab,#22c55e_22%,var(--b-color-surface))]",
  warning:
    "bg-[color-mix(in_oklab,#f59e0b_22%,var(--b-color-surface))]",
};

const STATUS_HINT: Record<InputStatus, string> = {
  default: "text-b-muted",
  destructive: "text-b-destructive",
  success: "text-[#22c55e]",
  warning: "text-[#f59e0b]",
};

const AFFIX_SURFACE: Record<InputVariant, string> = {
  default:
    "bg-[color-mix(in_oklab,var(--b-color-border)_32%,var(--b-color-surface))]",
  outline:
    "bg-[color-mix(in_oklab,var(--b-color-border)_22%,transparent)]",
};

function AffixSlot({
  side,
  variant,
  status,
  children,
}: {
  side: "prefix" | "suffix";
  variant: InputVariant;
  status: InputStatus;
  children: ReactNode;
}) {
  const edge =
    side === "prefix"
      ? "border-r border-b-border"
      : "border-l border-b-border";
  const surface =
    status === "default"
      ? AFFIX_SURFACE[variant]
      : STATUS_TINT_AFFIX[status];
  return (
    <span
      className={[
        "flex shrink-0 items-center px-3 text-sm text-b-muted",
        surface,
        edge,
      ].join(" ")}
    >
      {children}
    </span>
  );
}

type PickedFileEntry = { file: File; previewUrl: string | null };

function FileGlyph({ className = "" }: { className?: string }) {
  return (
    <span
      className={[
        "flex size-9 shrink-0 items-center justify-center rounded-md bg-b-surface text-b-muted border border-b-border",
        className,
      ].join(" ")}
      aria-hidden
    >
      <svg
        className="size-[1.125rem]"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
        <polyline points="14 2 14 8 20 8" />
      </svg>
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
    translateX: [0, "100%"],
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
      className={[
        "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-md text-b-destructive outline-none transition-colors",
        "hover:bg-[color-mix(in_oklab,var(--b-color-destructive)_14%,transparent)]",
        "focus-visible:ring-2 focus-visible:ring-b-accent focus-visible:ring-offset-2 focus-visible:ring-offset-b-surface",
        disabled ? "pointer-events-none opacity-40" : "",
      ].join(" ")}
    >
      <svg
        className="size-4"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        aria-hidden
      >
        <path d="M18 6L6 18M6 6l12 12" />
      </svg>
    </button>
  );
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  function Input(
    {
      variant = "default",
      status = "default",
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
      status === "destructive" ||
      status === "success" ||
      status === "warning";

    const shellSurface = statusTinted
      ? [
          STATUS_TINT_SHELL[status],
          "border-transparent focus-within:border-b-accent",
          variant === "default" ? "shadow-sm" : "shadow-none",
        ].join(" ")
      : [
          VARIANT_SHELL[variant],
          "border-b-border focus-within:border-b-accent",
        ].join(" ");

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
    const [pickedFiles, setPickedFiles] = useState<File[]>([]);

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

    const showAffixes = !isFile;

    return (
      <div className={["flex w-full flex-col gap-1.5", className].join(" ")}>
        {label ? (
          <label
            htmlFor={id}
            className="text-sm font-medium leading-snug text-b-text"
          >
            {label}
          </label>
        ) : null}
        <div
          ref={shellRef}
          role="presentation"
          onPointerDown={handleShellPointerDown}
          className={[
            "flex min-h-10 items-stretch overflow-hidden rounded-lg border-2 transition-[border-color,background-color] duration-200 ease-out",
            shellSurface,
            blocked ? "cursor-not-allowed opacity-55" : "",
          ].join(" ")}
        >
          {showAffixes && prefix != null ? (
            <AffixSlot side="prefix" variant={variant} status={status}>
              {prefix}
            </AffixSlot>
          ) : null}
          {isFile ? (
            <div
              className={[
                "relative min-w-0 flex-1 px-3 py-2",
                multipleFiles
                  ? "flex flex-col gap-2"
                  : "flex min-h-10 items-center gap-3",
              ].join(" ")}
            >
              {pickedFiles.length === 0 ? (
                <span className="text-sm text-b-muted">
                  {placeholder ?? "Выберите файл"}
                </span>
              ) : multipleFiles ? (
                fileEntries.map(({ file, previewUrl }) => (
                  <div
                    key={`${file.name}-${file.size}-${file.lastModified}`}
                    data-file-row=""
                    className="flex min-w-0 items-center gap-2"
                  >
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt=""
                        className="size-9 shrink-0 rounded-md object-cover ring-1 ring-b-border"
                      />
                    ) : (
                      <FileGlyph />
                    )}
                    <span className="min-w-0 flex-1 truncate text-sm text-b-text">
                      {file.name}
                    </span>
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
                  className="flex min-h-10 min-w-0 flex-1 items-center gap-2"
                >
                  {fileEntries[0]!.previewUrl ? (
                    <img
                      src={fileEntries[0]!.previewUrl}
                      alt=""
                      className="size-9 shrink-0 rounded-md object-cover ring-1 ring-b-border"
                    />
                  ) : (
                    <FileGlyph />
                  )}
                  <span className="min-w-0 flex-1 truncate text-sm text-b-text">
                    {fileEntries[0]!.file.name}
                  </span>
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
              type={inputType}
              disabled={disabled}
              readOnly={readOnly}
              placeholder={placeholder}
              onChange={onChange}
              className="min-w-0 flex-1 bg-transparent px-3 py-2 text-sm text-b-text outline-none placeholder:text-b-muted"
              {...rest}
            />
          )}
          {showAffixes && suffix != null ? (
            <AffixSlot side="suffix" variant={variant} status={status}>
              {suffix}
            </AffixSlot>
          ) : null}
        </div>
        {hint ? (
          <p
            className={["text-xs leading-normal", STATUS_HINT[status]].join(
              " ",
            )}
          >
            {hint}
          </p>
        ) : null}
      </div>
    );
  },
);

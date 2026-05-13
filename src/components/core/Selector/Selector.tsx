import { animate, remove } from "animejs";
import type {
  ChangeEvent,
  KeyboardEvent as ReactKeyboardEvent,
  MutableRefObject,
  PointerEvent as ReactPointerEvent,
  ReactNode,
  Ref,
} from "react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { IoChevronDown } from "react-icons/io5";

import type { InputSize, InputStatus, InputVariant } from "@/components/core/Input";
import {
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import {
  MOTION_INTERACTIVE_EASE,
  MOTION_TOOLTIP_MS,
} from "@/components/core/utils/motionTokens";
import { Text } from "@/components/core/Text";
import { cn } from "@/utils/cn";

function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const r of refs) {
      if (r == null) continue;
      if (typeof r === "function") r(node);
      else (r as MutableRefObject<T | null>).current = node;
    }
  };
}

function inheritThemePortalProps(triggerEl: HTMLElement | null): {
  "data-theme"?: "light";
} {
  if (!triggerEl) return {};
  const inherited = triggerEl.closest("[data-theme]")?.getAttribute("data-theme");
  return inherited === "light" ? { "data-theme": "light" as const } : {};
}

export type SelectorOption = {
  value: string;
  /** В триггере после выбора и первая строка в списке. */
  label: ReactNode;
  /** Только в списке под подписью. */
  description?: ReactNode;
  /** Справа в строке списка. */
  icon?: ReactNode;
  disabled?: boolean;
  /**
   * Строка для поиска при `label` не из plain text.
   * Если не задано — в фильтр попадают `value` и текстовые части `label` / `description`.
   */
  filterText?: string;
};

function selectorOptionSearchHaystack(opt: SelectorOption): string {
  const parts: string[] = [opt.value];
  if (opt.filterText) parts.push(opt.filterText);
  if (typeof opt.label === "string") parts.push(opt.label);
  if (typeof opt.description === "string") parts.push(opt.description);
  return parts.join(" ").toLowerCase();
}

function selectorOptionMatchesFilter(opt: SelectorOption, query: string): boolean {
  const t = query.trim().toLowerCase();
  if (!t) return true;
  return selectorOptionSearchHaystack(opt).includes(t);
}

const VARIANT_SHELL: Record<InputVariant, string> = {
  default: "bg-surface",
  outline: "bg-transparent",
};

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

const STATUS_HINT: Record<InputStatus, string> = {
  default: "text-muted",
  danger: "text-danger",
  success: "text-success",
  warning: "text-warning",
};

const INPUT_SHELL_MIN: Record<InputSize, string> = {
  base: "min-h-8",
  large: "min-h-10",
  xlarge: "min-h-12",
};

const INPUT_CONTROL: Record<InputSize, string> = {
  base: "px-plus py-small text-base leading-[1.2]",
  large: "px-mid py-base text-mid leading-[1.2]",
  xlarge: "px-large py-base text-mid leading-[1.2]",
};

const CHEVRON_ICON: Record<InputSize, string> = {
  base: "icon-base",
  large: "icon-large",
  xlarge: "icon-large",
};

export type SelectorProps = {
  /** Варианты списка. */
  options: SelectorOption[];
  /** Управляемое значение (`value` пункта). */
  value?: string;
  /** Неконтролируемое начальное значение. */
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  /** Визуал оболочки как у `Input`. */
  variant?: InputVariant;
  size?: InputSize;
  status?: InputStatus;
  disabled?: boolean;
  /** Подпись над полем. */
  label?: string;
  isRequired?: boolean;
  /** Текст при отсутствии выбора и подсказка в поле при открытом списке. */
  placeholder?: string;
  /** Примечание под полем. */
  hint?: string;
  /**
   * Максимальная высота области прокрутки списка (CSS `max-height`).
   * По умолчанию как у `Dropdown.Content`: `min(24rem, 70vh)`.
   */
  menuMaxHeight?: string;
  className?: string;
  id?: string;
  /** `id` списка для `aria-controls` (иначе генерируется). */
  listId?: string;
};

export const Selector = forwardRef<HTMLInputElement, SelectorProps>(
  function Selector(
    {
      options,
      value: valueProp,
      defaultValue,
      onValueChange,
      variant = "default",
      size = "base",
      status = "default",
      disabled = false,
      label,
      isRequired = false,
      placeholder = "Выберите значение",
      hint,
      menuMaxHeight = "min(24rem, 70vh)",
      className = "",
      id: idProp,
      listId: listIdProp,
    },
    ref,
  ) {
    const genId = useId();
    const triggerId = idProp ?? genId;
    const listId = listIdProp ?? `${triggerId}-listbox`;

    const isControlled = valueProp !== undefined;
    const [internalValue, setInternalValue] = useState(defaultValue ?? "");
    const value = isControlled ? (valueProp ?? "") : internalValue;

    const setValue = useCallback(
      (next: string) => {
        if (!isControlled) setInternalValue(next);
        onValueChange?.(next);
      },
      [isControlled, onValueChange],
    );

    const [open, setOpen] = useState(false);
    const [portalMounted, setPortalMounted] = useState(false);
    const [pos, setPos] = useState({ top: 0, left: 0, minW: 0 });
    const [filterQuery, setFilterQuery] = useState("");
    const [activeFilteredIndex, setActiveFilteredIndex] = useState(0);

    const triggerRef = useRef<HTMLDivElement | null>(null);
    const shellRef = useRef<HTMLDivElement | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const listRef = useRef<HTMLDivElement | null>(null);
    const openingRef = useRef(false);
    const queuedFilterCharRef = useRef<string | null>(null);

    const setWrapperRef = useCallback((node: HTMLDivElement | null) => {
      shellRef.current = node;
      triggerRef.current = node;
    }, []);

    const setInputRef = useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const selectedIndex = useMemo(
      () => options.findIndex((o) => o.value === value),
      [options, value],
    );

    const selectedOption =
      selectedIndex >= 0 ? options[selectedIndex] : undefined;

    const selectedDisplayString = useMemo(() => {
      if (!selectedOption) return "";
      if (typeof selectedOption.label === "string") return selectedOption.label;
      if (selectedOption.filterText) return selectedOption.filterText;
      return selectedOption.value;
    }, [selectedOption]);

    const filteredOriginalIndices = useMemo(() => {
      return options
        .map((o, i) => ({ o, i }))
        .filter(({ o }) => selectorOptionMatchesFilter(o, filterQuery))
        .map(({ i }) => i);
    }, [options, filterQuery]);

    const activeOriginalIndex =
      filteredOriginalIndices[activeFilteredIndex] ?? filteredOriginalIndices[0] ?? -1;

    const statusTinted =
      status === "danger" || status === "success" || status === "warning";

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

    const updatePosition = useCallback(() => {
      const t = triggerRef.current;
      if (!t) return;
      const r = t.getBoundingClientRect();
      setPos({
        top: r.bottom + 6,
        left: r.left,
        minW: r.width,
      });
    }, []);

    useLayoutEffect(() => {
      if (open) setPortalMounted(true);
    }, [open]);

    useLayoutEffect(() => {
      if (!open) return;
      updatePosition();
    }, [open, updatePosition, filterQuery]);

    useLayoutEffect(() => {
      if (!open) return;
      setActiveFilteredIndex((j) => {
        const fi = filteredOriginalIndices;
        if (fi.length === 0) return 0;
        return Math.min(j, fi.length - 1);
      });
    }, [filteredOriginalIndices, open]);

    useEffect(() => {
      if (!open) return;
      const onScroll = () => updatePosition();
      window.addEventListener("scroll", onScroll, true);
      window.addEventListener("resize", onScroll);
      return () => {
        window.removeEventListener("scroll", onScroll, true);
        window.removeEventListener("resize", onScroll);
      };
    }, [open, updatePosition]);

    useEffect(() => {
      if (!open) return;
      const onPointerDown = (e: Event) => {
        const target = (e as globalThis.PointerEvent).target as Node;
        if (triggerRef.current?.contains(target)) return;
        if (listRef.current?.contains(target)) return;
        setOpen(false);
      };
      document.addEventListener("pointerdown", onPointerDown, true);
      return () =>
        document.removeEventListener("pointerdown", onPointerDown, true);
    }, [open]);

    useEffect(() => {
      if (!open) return;
      const onKey = (e: Event) => {
        const ke = e as globalThis.KeyboardEvent;
        if (ke.key === "Escape") {
          ke.preventDefault();
          setOpen(false);
          inputRef.current?.focus();
        }
      };
      document.addEventListener("keydown", onKey);
      return () => document.removeEventListener("keydown", onKey);
    }, [open]);

    useLayoutEffect(() => {
      if (!portalMounted) return undefined;
      const el = listRef.current;
      if (!el) return undefined;

      const reduced = prefersReducedInteractiveHoverLift();
      let cancelled = false;

      if (reduced) {
        remove(el);
        if (open) el.style.opacity = "";
        else setPortalMounted(false);
        return () => {
          cancelled = true;
        };
      }

      remove(el);

      if (open) {
        el.style.opacity = "0";
        animate(el, {
          opacity: [0, 1],
          duration: MOTION_TOOLTIP_MS,
          ease: MOTION_INTERACTIVE_EASE,
        });
        return () => {
          cancelled = true;
          remove(el);
        };
      }

      const startOpacity = Number.parseFloat(getComputedStyle(el).opacity);
      const from =
        Number.isFinite(startOpacity) && startOpacity > 0 ? startOpacity : 1;
      const anim = animate(el, {
        opacity: [from, 0],
        duration: MOTION_TOOLTIP_MS,
        ease: MOTION_INTERACTIVE_EASE,
      });
      void Promise.resolve(anim).then(() => {
        if (!cancelled) setPortalMounted(false);
      });
      return () => {
        cancelled = true;
        remove(el);
      };
    }, [open, portalMounted]);

    useLayoutEffect(() => {
      if (!open || !portalMounted || activeOriginalIndex < 0) return;
      const id = `${listId}-opt-${activeOriginalIndex}`;
      document.getElementById(id)?.scrollIntoView({ block: "nearest" });
    }, [open, portalMounted, activeOriginalIndex, listId]);

    const bumpActiveFiltered = useCallback(
      (delta: number) => {
        const fi = filteredOriginalIndices;
        if (fi.length === 0) return;
        let j = activeFilteredIndex;
        for (let step = 0; step < fi.length; step += 1) {
          j = (j + delta + fi.length) % fi.length;
          const orig = fi[j];
          if (orig !== undefined && !options[orig]?.disabled) {
            setActiveFilteredIndex(j);
            return;
          }
        }
      },
      [activeFilteredIndex, filteredOriginalIndices, options],
    );

    const selectOriginalIndex = useCallback(
      (origIndex: number) => {
        const opt = options[origIndex];
        if (!opt || opt.disabled) return;
        setValue(opt.value);
        setOpen(false);
        setFilterQuery("");
        inputRef.current?.focus();
      },
      [options, setValue],
    );

    const finishOpen = useCallback(() => {
      const append = queuedFilterCharRef.current;
      queuedFilterCharRef.current = null;
      const nextQ = append ?? "";
      setFilterQuery(nextQ);

      const fi = options
        .map((o, i) => ({ o, i }))
        .filter(({ o }) => selectorOptionMatchesFilter(o, nextQ))
        .map(({ i }) => i);

      let nextActive = 0;
      if (fi.length > 0 && selectedIndex >= 0) {
        const p = fi.indexOf(selectedIndex);
        if (p >= 0) nextActive = p;
      }
      setActiveFilteredIndex(nextActive);

      requestAnimationFrame(() => {
        const el = inputRef.current;
        if (!el) return;
        el.focus();
        const len = nextQ.length;
        el.setSelectionRange(len, len);
      });
    }, [options, selectedIndex]);

    const openAfterSqueeze = useCallback(() => {
      if (disabled || openingRef.current) return;
      openingRef.current = true;
      const el = shellRef.current;
      if (!el) {
        openingRef.current = false;
        return;
      }
      if (prefersReducedInteractiveHoverLift()) {
        openingRef.current = false;
        setOpen(true);
        finishOpen();
        return;
      }
      void animateInteractivePressSqueeze(el).then(() => {
        openingRef.current = false;
        if (disabled) return;
        setOpen(true);
        finishOpen();
      });
    }, [disabled, finishOpen]);

    const handleShellPointerDown = useCallback(
      (e: ReactPointerEvent<HTMLDivElement>) => {
        if (disabled) return;
        if (open) return;
        if (e.button !== 0) return;
        openAfterSqueeze();
      },
      [disabled, open, openAfterSqueeze],
    );

    const handleChevronPointerDown = useCallback(
      (e: ReactPointerEvent<HTMLButtonElement>) => {
        e.stopPropagation();
        if (disabled) return;
        if (open) {
          setOpen(false);
          setFilterQuery("");
          return;
        }
        if (e.button !== 0) return;
        openAfterSqueeze();
      },
      [disabled, open, openAfterSqueeze],
    );

    const handleInputChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        if (!open) return;
        setFilterQuery(e.target.value);
      },
      [open],
    );

    const handleInputKeyDown = useCallback(
      (e: ReactKeyboardEvent<HTMLInputElement>) => {
        if (disabled) return;

        if (e.nativeEvent.isComposing) return;

        if (!open) {
          if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();
            openAfterSqueeze();
            return;
          }
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            openAfterSqueeze();
            return;
          }
          if (
            e.key.length === 1 &&
            !e.ctrlKey &&
            !e.metaKey &&
            !e.altKey &&
            e.key !== "Tab"
          ) {
            e.preventDefault();
            queuedFilterCharRef.current = e.key;
            openAfterSqueeze();
            return;
          }
          return;
        }

        if (e.key === "ArrowDown") {
          e.preventDefault();
          bumpActiveFiltered(1);
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          bumpActiveFiltered(-1);
          return;
        }
        if (e.key === "Enter") {
          e.preventDefault();
          if (activeOriginalIndex >= 0) selectOriginalIndex(activeOriginalIndex);
          return;
        }
        if (e.key === "Home") {
          e.preventDefault();
          const fi = filteredOriginalIndices;
          for (let j = 0; j < fi.length; j += 1) {
            const o = fi[j];
            if (o !== undefined && !options[o]?.disabled) {
              setActiveFilteredIndex(j);
              break;
            }
          }
          return;
        }
        if (e.key === "End") {
          e.preventDefault();
          const fi = filteredOriginalIndices;
          for (let j = fi.length - 1; j >= 0; j -= 1) {
            const o = fi[j];
            if (o !== undefined && !options[o]?.disabled) {
              setActiveFilteredIndex(j);
              break;
            }
          }
        }
      },
      [
        disabled,
        open,
        openAfterSqueeze,
        bumpActiveFiltered,
        activeOriginalIndex,
        selectOriginalIndex,
        filteredOriginalIndices,
        options,
      ],
    );

    useEffect(() => {
      if (open) return;
      setFilterQuery("");
    }, [open]);

    const portalTheme = inheritThemePortalProps(triggerRef.current);

    const inputValue = open ? filterQuery : selectedDisplayString;

    const listbox =
      portalMounted && typeof document !== "undefined"
        ? createPortal(
            <div
              ref={listRef}
              {...portalTheme}
              id={listId}
              role="listbox"
              className={cn(
                "fixed z-[100] flex flex-col overflow-hidden rounded-mid border border-base bg-surface shadow-token-md outline-none",
                "will-change-[opacity] motion-reduce:transition-none",
                !open && portalMounted && "pointer-events-none",
              )}
              style={{
                top: pos.top,
                left: pos.left,
                minWidth: Math.max(pos.minW, 12 * 16),
              }}
            >
              <div
                className="flex min-h-0 flex-col gap-xsmall overflow-y-auto overflow-x-hidden p-base"
                style={{ maxHeight: menuMaxHeight }}
              >
                {filteredOriginalIndices.length === 0 ? (
                  <Text
                    as="p"
                    variant="base"
                    className="px-base py-small text-center text-muted"
                  >
                    Нет совпадений
                  </Text>
                ) : (
                  filteredOriginalIndices.map((origIndex) => {
                    const opt = options[origIndex]!;
                    const selected = opt.value === value;
                    const isActive = origIndex === activeOriginalIndex;
                    return (
                      <button
                        key={opt.value}
                        type="button"
                        id={`${listId}-opt-${origIndex}`}
                        role="option"
                        aria-selected={selected}
                        disabled={opt.disabled}
                        tabIndex={-1}
                        className={cn(
                          "flex w-full min-w-0 items-center gap-base rounded-mid px-base py-small text-left outline-none",
                          "button-idle-surface-transition motion-reduce:transition-none",
                          !opt.disabled &&
                            "cursor-pointer text-foreground hover:bg-accent-fill-hover focus-visible:bg-accent-fill-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
                          opt.disabled &&
                            "cursor-not-allowed bg-transparent text-muted opacity-45 hover:bg-transparent",
                          isActive && !opt.disabled && "bg-accent-fill-hover",
                        )}
                        onClick={() => selectOriginalIndex(origIndex)}
                        onPointerEnter={() => {
                          if (!opt.disabled) {
                            const j = filteredOriginalIndices.indexOf(origIndex);
                            if (j >= 0) setActiveFilteredIndex(j);
                          }
                        }}
                      >
                        <span className="min-w-0 flex-1 text-left">
                          <Text
                            as="span"
                            variant="base"
                            inheritColor
                            className="block font-medium leading-snug"
                          >
                            {opt.label}
                          </Text>
                          {opt.description != null ? (
                            <Text
                              as="span"
                              variant="tools"
                              className="mt-xsmall block text-muted"
                            >
                              {opt.description}
                            </Text>
                          ) : null}
                        </span>
                        {opt.icon != null ? (
                          <span
                            className={cn(
                              "flex shrink-0 items-center text-muted [&_svg]:shrink-0",
                              CHEVRON_ICON[size],
                            )}
                          >
                            {opt.icon}
                          </span>
                        ) : null}
                      </button>
                    );
                  })
                )}
              </div>
            </div>,
            document.body,
          )
        : null;

    return (
      <div className={cn("flex w-full flex-col gap-small", className)}>
        {label ? (
          <label
            htmlFor={triggerId}
            className="inline-flex flex-wrap items-baseline gap-x-xsmall gap-y-0"
          >
            <Text as="span" variant="base" className="font-medium leading-snug">
              {label}
            </Text>
            {isRequired ? (
              <span className="text-danger leading-none" aria-hidden>
                *
              </span>
            ) : null}
          </label>
        ) : null}
        <div
          ref={setWrapperRef}
          role="presentation"
          onPointerDown={handleShellPointerDown}
          className={cn(
            "relative z-0 flex w-full min-w-0 items-stretch border-1 text-left outline-none",
            "overflow-hidden rounded-base transition-[border-color,background-color] duration-200 ease-out motion-reduce:transition-none",
            "focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent",
            INPUT_SHELL_MIN[size],
            shellSurface,
            disabled ? "cursor-not-allowed opacity-55" : "cursor-pointer",
          )}
        >
          <input
            ref={mergeRefs(setInputRef)}
            id={triggerId}
            type="text"
            role="combobox"
            aria-expanded={open}
            aria-controls={listId}
            aria-haspopup="listbox"
            aria-autocomplete="list"
            aria-activedescendant={
              open &&
              activeOriginalIndex >= 0 &&
              options[activeOriginalIndex] &&
              !options[activeOriginalIndex]?.disabled
                ? `${listId}-opt-${activeOriginalIndex}`
                : undefined
            }
            aria-required={isRequired || undefined}
            disabled={disabled}
            readOnly={!open}
            autoComplete="off"
            placeholder={placeholder}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleInputKeyDown}
            className={cn(
              "min-w-0 flex-1 bg-transparent text-foreground outline-none placeholder:text-muted",
              INPUT_CONTROL[size],
              !open && !selectedOption && "text-muted",
            )}
          />
          <button
            type="button"
            tabIndex={-1}
            disabled={disabled}
            aria-label={open ? "Закрыть список" : "Открыть список"}
            className={cn(
              "flex shrink-0 items-center justify-center self-stretch border-l border-base px-small outline-none",
              "text-muted transition-transform duration-200 ease-out motion-reduce:transition-none",
              "hover:text-foreground focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
              open && "rotate-180",
              disabled && "pointer-events-none",
            )}
            onPointerDown={handleChevronPointerDown}
          >
            <IoChevronDown className={CHEVRON_ICON[size]} aria-hidden />
          </button>
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
        {listbox}
      </div>
    );
  },
);

Selector.displayName = "Selector";

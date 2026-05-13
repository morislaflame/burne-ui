import { animate, remove } from "animejs";
import type {
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
  danger: "focus:border-danger",
  success: "focus:border-success",
  warning: "focus:border-warning",
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

export type SelectorOption = {
  value: string;
  /** В триггере после выбора и первая строка в списке. */
  label: ReactNode;
  /** Только в списке под подписью. */
  description?: ReactNode;
  /** Справа в строке списка. */
  icon?: ReactNode;
  disabled?: boolean;
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
  /** Текст при отсутствии выбора. */
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

export const Selector = forwardRef<HTMLButtonElement, SelectorProps>(
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
    const [activeIndex, setActiveIndex] = useState(0);

    const triggerRef = useRef<HTMLButtonElement | null>(null);
    const shellRef = useRef<HTMLButtonElement | null>(null);
    const listRef = useRef<HTMLDivElement | null>(null);
    const openingRef = useRef(false);

    const setTriggerRefs = useCallback(
      (node: HTMLButtonElement | null) => {
        shellRef.current = node;
        triggerRef.current = node;
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
            ? "focus:border-accent"
            : "border-base focus:border-accent",
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
      const idx = selectedIndex >= 0 ? selectedIndex : 0;
      const firstEnabled = options.findIndex((o) => !o.disabled);
      setActiveIndex(firstEnabled >= 0 ? (selectedIndex >= 0 ? selectedIndex : firstEnabled) : idx);
    }, [open, options, selectedIndex]);

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
        if ((e as globalThis.KeyboardEvent).key === "Escape") {
          e.preventDefault();
          setOpen(false);
          triggerRef.current?.focus();
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
      if (!open || !portalMounted) return;
      const id = `${listId}-opt-${activeIndex}`;
      document.getElementById(id)?.scrollIntoView({ block: "nearest" });
    }, [open, portalMounted, activeIndex, listId]);

    const bumpActive = useCallback(
      (delta: number) => {
        if (options.length === 0) return;
        let i = activeIndex;
        for (let step = 0; step < options.length; step += 1) {
          i = (i + delta + options.length) % options.length;
          if (!options[i]?.disabled) {
            setActiveIndex(i);
            return;
          }
        }
      },
      [activeIndex, options],
    );

    const selectIndex = useCallback(
      (index: number) => {
        const opt = options[index];
        if (!opt || opt.disabled) return;
        setValue(opt.value);
        setOpen(false);
        triggerRef.current?.focus();
      },
      [options, setValue],
    );

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
        return;
      }
      void animateInteractivePressSqueeze(el).then(() => {
        openingRef.current = false;
        if (disabled) return;
        setOpen(true);
      });
    }, [disabled]);

    const handleTriggerPointerDown = useCallback(
      (e: ReactPointerEvent<HTMLButtonElement>) => {
        if (disabled) return;
        if (open) {
          setOpen(false);
          return;
        }
        if (e.button !== 0) return;
        openAfterSqueeze();
      },
      [disabled, open, openAfterSqueeze],
    );

    const handleTriggerKeyDown = useCallback(
      (e: ReactKeyboardEvent<HTMLButtonElement>) => {
        if (disabled) return;
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          e.preventDefault();
          if (!open) openAfterSqueeze();
          else bumpActive(e.key === "ArrowDown" ? 1 : -1);
          return;
        }
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (open) selectIndex(activeIndex);
          else openAfterSqueeze();
          return;
        }
        if (open && e.key === "Home") {
          e.preventDefault();
          const i = options.findIndex((o) => !o.disabled);
          if (i >= 0) setActiveIndex(i);
          return;
        }
        if (open && e.key === "End") {
          e.preventDefault();
          for (let i = options.length - 1; i >= 0; i -= 1) {
            if (!options[i]?.disabled) {
              setActiveIndex(i);
              break;
            }
          }
        }
      },
      [disabled, open, openAfterSqueeze, bumpActive, activeIndex, selectIndex, options],
    );

    const portalTheme = inheritThemePortalProps(triggerRef.current);

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
                {options.map((opt, index) => {
                  const selected = opt.value === value;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      id={`${listId}-opt-${index}`}
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
                        activeIndex === index &&
                          !opt.disabled &&
                          "bg-accent-fill-hover",
                      )}
                      onClick={() => selectIndex(index)}
                      onPointerEnter={() => {
                        if (!opt.disabled) setActiveIndex(index);
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
                })}
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
        <button
          ref={mergeRefs(setTriggerRefs)}
          id={triggerId}
          type="button"
          role="combobox"
          aria-expanded={open}
          aria-controls={listId}
          aria-haspopup="listbox"
          aria-activedescendant={
            open &&
            options[activeIndex] &&
            !options[activeIndex]?.disabled
              ? `${listId}-opt-${activeIndex}`
              : undefined
          }
          aria-required={isRequired || undefined}
          disabled={disabled}
          className={cn(
            "relative z-0 flex w-full min-w-0 items-center border-1 text-left outline-none",
            "overflow-hidden rounded-base transition-[border-color,background-color] duration-200 ease-out motion-reduce:transition-none",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
            INPUT_SHELL_MIN[size],
            shellSurface,
            INPUT_CONTROL[size],
            disabled ? "cursor-not-allowed opacity-55" : "cursor-pointer",
          )}
          onPointerDown={handleTriggerPointerDown}
          onKeyDown={handleTriggerKeyDown}
        >
          <span className="min-w-0 flex-1 truncate">
            {selectedOption ? (
              <Text
                as="span"
                variant="base"
                className="block truncate font-medium leading-snug text-foreground"
              >
                {selectedOption.label}
              </Text>
            ) : (
              <Text
                as="span"
                variant="base"
                className="block truncate leading-snug text-muted"
              >
                {placeholder}
              </Text>
            )}
          </span>
          <span
            className={cn(
              "ml-base flex shrink-0 items-center text-muted transition-transform duration-200 ease-out motion-reduce:transition-none",
              open && "rotate-180",
            )}
            aria-hidden
          >
            <IoChevronDown className={CHEVRON_ICON[size]} />
          </span>
        </button>
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

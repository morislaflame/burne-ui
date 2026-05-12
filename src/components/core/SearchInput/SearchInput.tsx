import { animate, remove as removeAnime } from "animejs";
import type {
  ChangeEvent,
  FocusEvent,
  InputHTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
} from "react";
import {
  forwardRef,
  useCallback,
  useEffect,
  useId,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { IoClose, IoSearch } from "react-icons/io5";

import {
  animateInteractiveHoverLift,
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
  SHADOW_SM,
} from "@/components/core/utils/hoverInteractiveLift";
import {
  MOTION_INTERACTIVE_EASE,
  MOTION_INTERACTIVE_MS,
} from "@/components/core/utils/motionTokens";
import { Ripple } from "@/components/core/Ripple";
import { cn } from "@/utils/cn";

export type SearchInputSize = "base" | "large";

const GHOST_CLEAR_HOVER =
  "hover:bg-accent-fill-hover";

const SIZE_LAYOUT: Record<
  SearchInputSize,
  {
    dim: number;
    defaultExpandedW: number;
    iconBox: number;
    padX: number;
    radiusExpanded: number;
    iconClass: string;
    inputClass: string;
    clearTap: number;
    clearIconClass: string;
    textGapClear: number;
  }
> = {
  /** Как `Button size="base"`: высота 32px (`min-h-8`), иконка `icon-base`. */
  base: {
    dim: 32,
    defaultExpandedW: 280,
    iconBox: 16,
    padX: 12,
    radiusExpanded: 8,
    iconClass: "icon-small",
    inputClass: "text-base",
    clearTap: 24,
    clearIconClass: "icon-base",
    textGapClear: 6,
  },
  large: {
    dim: 52,
    defaultExpandedW: 340,
    iconBox: 26,
    padX: 14,
    radiusExpanded: 12,
    iconClass: "icon-large",
    inputClass: "text-[1rem]",
    clearTap: 36,
    clearIconClass: "icon-large",
    textGapClear: 8,
  },
};

export type SearchInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "type"
> & {
  /**
   * Высота в свёрнутом виде и габариты иконки / поля.
   * Только `base` и `large`: `base` = как `Button size="base"` (32px).
   * По умолчанию `base`.
   */
  size?: SearchInputSize;
  /** Ширина в развёрнутом виде (px). */
  expandedWidth?: number;
  /** Начать развёрнутым. */
  defaultExpanded?: boolean;
  /** Контролируемое раскрытие. */
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  /**
   * Свернуть при потере фокуса, если значение пустое.
   * По умолчанию true.
   */
  collapseOnBlur?: boolean;
  /**
   * Текущая строка после ввода (удобно для поиска; дублирует `onChange`).
   */
  onValueChange?: (value: string) => void;
  /** Converge-ripple на оболочке (реализация — `<Ripple />` внутри). @default false */
  ripple?: boolean;
};

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(
    {
      className = "",
      size: sizeProp = "base",
      expandedWidth,
      defaultExpanded = false,
      expanded: expandedProp,
      onExpandedChange,
      collapseOnBlur = true,
      disabled,
      readOnly,
      placeholder = "Поиск…",
      value: valueProp,
      defaultValue,
      onChange,
      onBlur,
      onKeyDown,
      id: idProp,
      "aria-label": ariaLabelProp,
      onValueChange,
      ripple = false,
      ...rest
    },
    ref,
  ) {
    const genId = useId();
    const inputId = idProp ?? genId;
    const isExpandedControlled = expandedProp !== undefined;
    const [internalExpanded, setInternalExpanded] = useState(defaultExpanded);
    const expanded = isExpandedControlled ? expandedProp! : internalExpanded;

    const setExpanded = useCallback(
      (next: boolean) => {
        if (!isExpandedControlled) setInternalExpanded(next);
        onExpandedChange?.(next);
      },
      [isExpandedControlled, onExpandedChange],
    );

    const rootRef = useRef<HTMLDivElement>(null);
    const iconRef = useRef<HTMLSpanElement>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);
    const squeezePromiseRef = useRef<Promise<void> | null>(null);
    const layoutReadyRef = useRef(false);

    const isValueControlled = valueProp !== undefined;
    const [hasQuery, setHasQuery] = useState(
      () =>
        (defaultValue != null && String(defaultValue).trim().length > 0) ||
        (valueProp != null && String(valueProp).trim().length > 0),
    );

    useEffect(() => {
      if (isValueControlled) {
        setHasQuery(String(valueProp ?? "").trim().length > 0);
      }
    }, [isValueControlled, valueProp]);

    const setInputRef = useCallback(
      (node: HTMLInputElement | null) => {
        inputRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const blocked = Boolean(disabled || readOnly);

    const handleInputChange = useCallback(
      (e: ChangeEvent<HTMLInputElement>) => {
        onChange?.(e);
        onValueChange?.(e.target.value);
        if (!isValueControlled) {
          setHasQuery(e.target.value.trim().length > 0);
        }
      },
      [isValueControlled, onChange, onValueChange],
    );

    const handleClearClick = useCallback(
      (e: MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (blocked) return;
        const el = inputRef.current;
        if (!el) return;
        if (!isValueControlled) {
          setHasQuery(false);
        }
        const nativeSet = Object.getOwnPropertyDescriptor(
          HTMLInputElement.prototype,
          "value",
        )?.set;
        nativeSet?.call(el, "");
        el.dispatchEvent(new Event("input", { bubbles: true }));
        onChange?.({
          target: el,
          currentTarget: el,
        } as ChangeEvent<HTMLInputElement>);
        onValueChange?.("");
        requestAnimationFrame(() => el.focus());
      },
      [blocked, isValueControlled, onChange, onValueChange],
    );

    const layout = SIZE_LAYOUT[sizeProp];
    const targetW = expandedWidth ?? layout.defaultExpandedW;
    const dim = layout.dim;
    const iconTxCollapsed = (dim - layout.iconBox) / 2;
    const iconTxExpanded = layout.padX;

    const applyShellMetrics = useCallback(
      (open: boolean) => {
        const el = rootRef.current;
        const iconEl = iconRef.current;
        if (!el || !iconEl) return;
        const w = open ? targetW : dim;
        const r = open ? layout.radiusExpanded : dim / 2;
        el.style.width = `${w}px`;
        el.style.height = `${dim}px`;
        el.style.borderRadius = `${r}px`;
        iconEl.style.left = `${open ? iconTxExpanded : iconTxCollapsed}px`;
      },
      [
        dim,
        iconTxCollapsed,
        iconTxExpanded,
        layout.radiusExpanded,
        targetW,
      ],
    );

    const runExpandMotion = useCallback(
      (open: boolean) => {
        const el = rootRef.current;
        const iconEl = iconRef.current;
        if (!el || !iconEl) return;

        if (prefersReducedInteractiveHoverLift()) {
          applyShellMetrics(open);
          return;
        }

        removeAnime(el);
        removeAnime(iconEl);

        animate(el, {
          width: open ? targetW : dim,
          height: dim,
          borderRadius: open ? layout.radiusExpanded : dim / 2,
          duration: MOTION_INTERACTIVE_MS,
          ease: MOTION_INTERACTIVE_EASE,
        });

        animate(iconEl, {
          left: open ? iconTxExpanded : iconTxCollapsed,
          duration: MOTION_INTERACTIVE_MS,
          ease: MOTION_INTERACTIVE_EASE,
        });
      },
      [
        applyShellMetrics,
        dim,
        iconTxCollapsed,
        iconTxExpanded,
        layout.radiusExpanded,
        targetW,
      ],
    );

    useLayoutEffect(() => {
      if (!layoutReadyRef.current) {
        layoutReadyRef.current = true;
        applyShellMetrics(expanded);
        return;
      }
      runExpandMotion(expanded);
    }, [applyShellMetrics, expanded, runExpandMotion]);

    const searchShadow = { hover: SHADOW_SM() };

    const focusInput = useCallback(() => {
      requestAnimationFrame(() => inputRef.current?.focus());
    }, []);

    const openFromInteraction = useCallback(async () => {
      if (blocked || expanded) return;
      await (squeezePromiseRef.current ?? Promise.resolve());
      squeezePromiseRef.current = null;
      setExpanded(true);
      const shell = rootRef.current;
      if (shell && !prefersReducedInteractiveHoverLift()) {
        removeAnime(shell);
        animateInteractiveHoverLift(shell, false, undefined, searchShadow);
      }
      focusInput();
    }, [blocked, expanded, focusInput, setExpanded]);

    const handleRootPointerDown = useCallback(
      (_e: PointerEvent<HTMLDivElement>) => {
        if (blocked || expanded) return;
        const shell = rootRef.current;
        if (!shell || prefersReducedInteractiveHoverLift()) {
          squeezePromiseRef.current = Promise.resolve();
          return;
        }
        squeezePromiseRef.current = animateInteractivePressSqueeze(
          shell,
        ).then(() => {});
      },
      [blocked, expanded],
    );

    const handleRootClick = useCallback(
      (e: MouseEvent<HTMLDivElement>) => {
        if (blocked) return;
        if (!expanded) {
          e.preventDefault();
          void openFromInteraction();
        }
      },
      [blocked, expanded, openFromInteraction],
    );

    const handlePointerEnter = useCallback(() => {
      if (blocked || expanded) return;
      const el = rootRef.current;
      if (!el || prefersReducedInteractiveHoverLift()) return;
      animateInteractiveHoverLift(el, true, undefined, searchShadow);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blocked, expanded]);

    const handlePointerLeave = useCallback(() => {
      const el = rootRef.current;
      if (!el || blocked || expanded) return;
      if (prefersReducedInteractiveHoverLift()) return;
      animateInteractiveHoverLift(el, false, undefined, searchShadow);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [blocked, expanded]);

    const handleInputBlur = useCallback(
      (e: FocusEvent<HTMLInputElement>) => {
        onBlur?.(e);
        if (!collapseOnBlur || blocked) return;
        window.setTimeout(() => {
          const root = rootRef.current;
          if (!root?.contains(document.activeElement)) {
            const el = inputRef.current;
            const empty = (el?.value ?? "").trim().length === 0;
            if (empty) setExpanded(false);
          }
        }, 0);
      },
      [blocked, collapseOnBlur, onBlur, setExpanded],
    );

    const handleRootKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        if (expanded || blocked) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          void openFromInteraction();
        }
      },
      [blocked, expanded, openFromInteraction],
    );

    const handleInputKeyDown = useCallback(
      (e: KeyboardEvent<HTMLInputElement>) => {
        onKeyDown?.(e);
        if (e.defaultPrevented) return;
        if (
          e.key === "Escape" &&
          collapseOnBlur &&
          (inputRef.current?.value ?? "").length === 0
        ) {
          e.stopPropagation();
          setExpanded(false);
          rootRef.current?.focus();
        }
      },
      [collapseOnBlur, onKeyDown, setExpanded],
    );

    const paddingInputLeft = layout.padX + layout.iconBox + 6;
    const showClear = expanded && hasQuery && !blocked;
    const paddingInputRight =
      layout.padX +
      (showClear ? layout.clearTap + layout.textGapClear : 0);

    const collapseA11yLabel = ariaLabelProp ?? "Открыть поиск";
    const inputAriaLabel =
      ariaLabelProp ?? (placeholder ? String(placeholder) : "Поиск");

    return (
      <div
        ref={rootRef}
        role={expanded ? "search" : undefined}
        tabIndex={expanded ? -1 : blocked ? -1 : 0}
        aria-expanded={expanded}
        aria-disabled={blocked || undefined}
        aria-label={expanded ? undefined : collapseA11yLabel}
        data-search-expanded={expanded ? "" : undefined}
        className={cn(
          "relative inline-block overflow-hidden border border-base bg-surface outline-none animate-shadow button-idle-surface-transition motion-reduce:transition-none",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          "focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-accent",
          expanded ? "cursor-text" : "",
          !expanded && !blocked ? "cursor-pointer" : "",
          blocked ? "pointer-events-none opacity-50" : "",
          className,
        )}
        style={{
          width: dim,
          height: dim,
          borderRadius: dim / 2,
        }}
        onPointerDown={handleRootPointerDown}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onClick={handleRootClick}
        onKeyDown={handleRootKeyDown}
      >
        {ripple ? (
          <Ripple color="accentSoft" disabled={blocked} />
        ) : null}
        <span
          ref={iconRef}
          className={cn(
            "pointer-events-none absolute top-1/2 z-[1] flex -translate-y-1/2 items-center justify-center text-muted",
            layout.iconClass,
          )}
          style={{
            left: iconTxCollapsed,
          }}
          aria-hidden
        >
          <IoSearch className="size-full" aria-hidden />
        </span>

        <input
          ref={setInputRef}
          id={inputId}
          type="search"
          disabled={disabled}
          readOnly={readOnly}
          placeholder={placeholder}
          value={valueProp}
          defaultValue={defaultValue}
          onChange={handleInputChange}
          onBlur={handleInputBlur}
          onKeyDown={handleInputKeyDown}
          tabIndex={expanded ? 0 : -1}
          aria-hidden={!expanded}
          aria-label={inputAriaLabel}
          className={cn(
            "box-border min-h-0 w-full border-0 bg-transparent py-0 text-foreground outline-none placeholder:text-muted",
            "[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none",
            "disabled:cursor-not-allowed disabled:opacity-100",
            layout.inputClass,
            expanded
              ? "relative z-[2] opacity-100"
              : "pointer-events-none absolute inset-0 opacity-0",
          )}
          style={
            expanded
              ? {
                  height: dim,
                  lineHeight: `${dim}px`,
                  paddingLeft: paddingInputLeft,
                  paddingRight: paddingInputRight,
                  paddingTop: 0,
                  paddingBottom: 0,
                }
              : {
                  paddingLeft: paddingInputLeft,
                  lineHeight: `${dim}px`,
                  height: "100%",
                }
          }
          {...rest}
        />
        {showClear ? (
          <button
            type="button"
            aria-label="Очистить поле"
            onClick={handleClearClick}
            onPointerDown={(e) => e.stopPropagation()}
            className={cn(
              "absolute top-1/2 z-[3] flex -translate-y-1/2 items-center justify-center rounded-full border-0 bg-transparent p-0",
              "text-foreground outline-none transition-colors",
              GHOST_CLEAR_HOVER,
              "focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-inset",
              "cursor-pointer",
            )}
            style={{
              right: layout.padX,
              width: layout.clearTap,
              height: layout.clearTap,
            }}
          >
            <IoClose
              className={`shrink-0 ${layout.clearIconClass}`}
              aria-hidden
            />
          </button>
        ) : null}
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";

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
  useMemo,
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
import { motionInteractive } from "@/components/core/utils/motionConfig";
import { Ripple } from "@/components/core/Ripple";
import { cn } from "@/utils/cn";
import type { ComponentSize } from "@/components/core/utils/componentSize";
import {
  CONTROL_SIZE_LAYOUT,
  readControlHeightPx,
} from "@/components/core/utils/controlSizeLayout";

export type SearchInputSize = ComponentSize;

const GHOST_CLEAR_HOVER =
  "hover:bg-primary-tint";

/** Горизонтальный padding (px) — совпадает с `px-base` / `px-plus` / … */
const SEARCH_PAD_X_PX: Record<ComponentSize, number> = {
  small: 8,
  base: 12,
  mid: 16,
  large: 20,
};

/** Размер иконки (px) — совпадает с `--icon-size-*`. */
const SEARCH_ICON_BOX_PX: Record<ComponentSize, number> = {
  small: 14,
  base: 16,
  mid: 20,
  large: 20,
};

const SEARCH_RADIUS_EXPANDED_PX: Record<ComponentSize, number> = {
  small: 6,
  base: 8,
  mid: 10,
  large: 12,
};

const SEARCH_CLEAR_TAP_PX: Record<ComponentSize, number> = {
  small: 20,
  base: 24,
  mid: 28,
  large: 32,
};

type SearchSizeLayout = {
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
};

function buildSearchLayout(size: ComponentSize): SearchSizeLayout {
  const control = CONTROL_SIZE_LAYOUT[size];
  return {
    dim: readControlHeightPx(size),
    defaultExpandedW: control.defaultExpandedSearchWidth,
    iconBox: SEARCH_ICON_BOX_PX[size],
    padX: SEARCH_PAD_X_PX[size],
    radiusExpanded: SEARCH_RADIUS_EXPANDED_PX[size],
    iconClass: control.icon,
    inputClass: size === "large" || size === "mid" ? "text-mid" : "text-base",
    clearTap: SEARCH_CLEAR_TAP_PX[size],
    clearIconClass: control.chevronIcon,
    textGapClear: size === "small" ? 4 : 6,
  };
}

const SIZE_LAYOUT: Record<SearchInputSize, SearchSizeLayout> = {
  small: buildSearchLayout("small"),
  base: buildSearchLayout("base"),
  mid: buildSearchLayout("mid"),
  large: buildSearchLayout("large"),
};

function resolveSearchLayout(size: ComponentSize): SearchSizeLayout {
  return {
    ...SIZE_LAYOUT[size],
    dim: readControlHeightPx(size),
  };
}

export type SearchInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "type"
> & {
  /**
   * Высота в свёрнутом виде и габариты иконки / поля — как у `Input` / `Button`.
   * `small` · `base` · `mid` · `large`. По умолчанию `base`.
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
  /**
   * Доступное имя поля и триггера свёрнутого состояния.
   * Рекомендуется задавать явно; без prop свёрнутый триггер — «Открыть поиск», развёрнутый input — placeholder.
   */
  "aria-label"?: string;
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

    const layout = resolveSearchLayout(sizeProp);
    const targetW = expandedWidth ?? layout.defaultExpandedW;
    const dim = layout.dim;

    const shellHorizontalBorderPx = useCallback(
      (shellEl: HTMLElement) => shellEl.offsetWidth - shellEl.clientWidth,
      [],
    );

    const iconLeftCollapsedPx = useCallback(
      (shellEl: HTMLElement) =>
        (shellEl.clientWidth - layout.iconBox) / 2,
      [layout.iconBox],
    );

    const iconLeftCollapsedAtBorderBoxWidth = useCallback(
      (borderBoxWidth: number, borderPx: number) =>
        (borderBoxWidth - borderPx - layout.iconBox) / 2,
      [layout.iconBox],
    );

    const iconLeftCollapsedCss = `calc(50% - ${layout.iconBox / 2}px)`;

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
        iconEl.style.left = open
          ? `${layout.padX}px`
          : iconLeftCollapsedCss;
      },
      [dim, iconLeftCollapsedCss, layout.padX, layout.radiusExpanded, targetW],
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

        if (open) {
          const iconLeftFrom = iconLeftCollapsedPx(el);
          iconEl.style.left = `${iconLeftFrom}px`;

          animate(el, {
            width: targetW,
            height: dim,
            borderRadius: layout.radiusExpanded,
            ...motionInteractive(),
          });
          animate(iconEl, {
            left: layout.padX,
            ...motionInteractive(),
          });
          return;
        }

        iconEl.style.left = `${layout.padX}px`;

        animate(el, {
          width: dim,
          height: dim,
          borderRadius: dim / 2,
          ...motionInteractive(),
        });

        const borderPx = shellHorizontalBorderPx(el);
        const iconLeftTo = iconLeftCollapsedAtBorderBoxWidth(dim, borderPx);

        animate(iconEl, {
          left: iconLeftTo,
          ...motionInteractive(),
          onComplete: () => {
            iconEl.style.left = iconLeftCollapsedCss;
          },
        });
      },
      [
        applyShellMetrics,
        dim,
        iconLeftCollapsedAtBorderBoxWidth,
        iconLeftCollapsedCss,
        iconLeftCollapsedPx,
        layout.padX,
        layout.radiusExpanded,
        shellHorizontalBorderPx,
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

    const searchShadow = useMemo(() => ({ hover: SHADOW_SM() }), []);

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
    }, [blocked, expanded, focusInput, searchShadow, setExpanded]);

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
    }, [blocked, expanded, searchShadow]);

    const handlePointerLeave = useCallback(() => {
      const el = rootRef.current;
      if (!el || blocked || expanded) return;
      if (prefersReducedInteractiveHoverLift()) return;
      animateInteractiveHoverLift(el, false, undefined, searchShadow);
    }, [blocked, expanded, searchShadow]);

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
        {...(expanded
          ? { role: "search" as const, tabIndex: -1 as const }
          : {
              role: "button" as const,
              tabIndex: (blocked ? -1 : 0) as 0 | -1,
              onClick: handleRootClick,
              onKeyDown: handleRootKeyDown,
            })}
        aria-expanded={expanded}
        aria-disabled={blocked || undefined}
        aria-label={expanded ? undefined : collapseA11yLabel}
        data-search-expanded={expanded ? "" : undefined}
        className={cn(
          "relative box-border inline-block overflow-hidden border-token bg-surface text-left outline-none animate-shadow button-idle-surface-transition motion-reduce:transition-none",
          "focus-ring",
          "focus-within:outline focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-primary",
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
      >
        {ripple ? (
          <Ripple color="accentSoft" disabled={blocked} />
        ) : null}
        <span
          ref={iconRef}
          className="pointer-events-none absolute inset-y-0 z-[1] flex items-center justify-center text-muted"
          style={{ width: layout.iconBox }}
          aria-hidden
        >
          <IoSearch className={cn("shrink-0", layout.iconClass)} aria-hidden />
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
              "focus-ring-inset",
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

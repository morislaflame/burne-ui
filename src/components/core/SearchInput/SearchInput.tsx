import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import type {
  ChangeEvent,
  FocusEvent,
  InputHTMLAttributes,
  KeyboardEvent,
  MouseEvent,
  PointerEvent,
} from "react";
import { forwardRef, useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { IoClose, IoSearch } from "react-icons/io5";

import { animateInteractivePressSqueeze, prefersReducedInteractiveHoverLift, shadowNone, shadowBase } from "@/components/core/utils/hoverInteractiveLift";
import { useGlossFieldShellMotion, animateGlossInteractivePressSqueeze } from "@/components/core/utils/glossInteractiveMotion";
import "../utils/glossInteractive.css";
import { FIELD_SHELL_FOCUS_CLASS, FIELD_SHELL_TRANSITION_CLASS, fieldShellHoverClass } from "@/components/core/utils/useFieldShellHoverLift";
import { useSecondLevelShadow } from "@/components/core/utils/useShadowMotion";
import { motionInteractive } from "@/components/core/utils/motionConfig";
import { Ripple } from "@/components/core/Ripple";
import type { ButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupTypes";
import { buttonGroupRoundingClasses, buttonGroupSegmentSurfaceClasses } from "@/components/composite/ButtonGroup/buttonGroupStyles";
import { useOptionalButtonGroupLayout, useOptionalButtonGroupSegment } from "@/components/composite/ButtonGroup/buttonGroupContext";
import { FIELD_SHELL_VARIANT_BG_CLASS, fieldShellVariantFromButtonGroup } from "@/components/core/utils/fieldShellVariant";
import { cn } from "@/utils/cn";
import type { ComponentSize } from "@/components/core/utils/componentSize";
import { readControlHeightPx } from "@/components/core/utils/controlHeightMeasure";
import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/controlSizeLayout";
import { FIELD_CONTROL_MOBILE_NO_ZOOM_CLASS } from "@/components/core/utils/fieldControlMobileNoZoom";
import { readSearchExpandedRadiusPx, SEARCH_EXPANDED_ROUNDED_CLASS, SEARCH_INPUT_CLEAR_BUTTON_CLASS, SEARCH_INPUT_CLEAR_ICON_CLASS, SEARCH_INPUT_CONTROL_BASE_CLASS, SEARCH_INPUT_CONTROL_COLLAPSED_CLASS, SEARCH_INPUT_CONTROL_EXPANDED_CLASS, SEARCH_INPUT_ICON_CLASS, SEARCH_INPUT_ICON_WRAP_CLASS } from "./searchInputStyles";

export type SearchInputSize = ComponentSize;

export type SearchInputVariant = "default" | "outline" | "secondary" | "gloss";

import { hoverVariant, TEXT_COLOR_TRANSITION } from "@/components/core/utils/hoverVariant";

const SHELL_W_COLLAPSED: Record<ComponentSize, string> = {
  small: "w-control-small",
  base: "w-control-base",
  mid: "w-control-mid",
  large: "w-control-large",
};

const SEARCH_PAD_X_PX: Record<ComponentSize, number> = {
  small: 8,
  base: 12,
  mid: 16,
  large: 20,
};

const SEARCH_ICON_BOX_PX: Record<ComponentSize, number> = {
  small: 14,
  base: 16,
  mid: 20,
  large: 20,
};

const SEARCH_CLEAR_TAP_PX: Record<ComponentSize, number> = {
  small: 20,
  base: 24,
  mid: 28,
  large: 32,
};

const SEARCH_DEFAULT_EXPANDED_WIDTH: Record<ComponentSize, number> = {
  small: 240,
  base: 280,
  mid: 320,
  large: 360,
};

type SearchSizeLayout = {
  defaultExpandedW: number;
  iconBox: number;
  padX: number;
  iconClass: string;
  controlPad: string;
  shellWCollapsed: string;
  clearTap: number;
  clearIconClass: string;
  textGapClear: number;
};

function buildSearchLayout(size: ComponentSize): SearchSizeLayout {
  const control = CONTROL_SIZE_LAYOUT[size];
  return {
    defaultExpandedW: SEARCH_DEFAULT_EXPANDED_WIDTH[size],
    iconBox: SEARCH_ICON_BOX_PX[size],
    padX: SEARCH_PAD_X_PX[size],
    iconClass: control.icon,
    controlPad: control.controlPad,
    shellWCollapsed: SHELL_W_COLLAPSED[size],
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
  return SIZE_LAYOUT[size];
}

export type SearchInputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "size" | "type"
> & {
  size?: SearchInputSize;
  variant?: SearchInputVariant;
  expandedWidth?: number;
  defaultExpanded?: boolean;
  expanded?: boolean;
  onExpandedChange?: (expanded: boolean) => void;
  collapseOnBlur?: boolean;
  ripple?: boolean;
  groupSegment?: ButtonGroupSegment;
  "aria-label"?: string;
};

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(
  function SearchInput(
    {
      className = "",
      size: sizeProp = "base",
      variant: variantProp,
      expandedWidth,
      defaultExpanded = false,
      expanded: expandedProp,
      onExpandedChange,
      collapseOnBlur = true,
      disabled,
      readOnly,
      placeholder = "Search…",
      value: valueProp,
      defaultValue,
      onChange,
      onBlur,
      onKeyDown,
      id: idProp,
      "aria-label": ariaLabelProp,
      ripple = false,
      groupSegment: groupSegmentProp,
      ...rest
    },
    ref,
  ) {
    const layoutCtx = useOptionalButtonGroupLayout();
    const groupCtx = useOptionalButtonGroupSegment();
    const groupSegment = layoutCtx?.segmented
      ? undefined
      : (groupSegmentProp ?? groupCtx?.segment);
    const variant: SearchInputVariant =
      variantProp ??
      (groupCtx?.variant != null
        ? fieldShellVariantFromButtonGroup(groupCtx.variant)
        : "default");
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
    const prevExpandedRef = useRef(expanded);

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
        if (!isValueControlled) {
          setHasQuery(e.target.value.trim().length > 0);
        }
      },
      [isValueControlled, onChange],
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
        requestAnimationFrame(() => el.focus());
      },
      [blocked, isValueControlled, onChange],
    );

    const layout = resolveSearchLayout(sizeProp);
    const targetW = expandedWidth ?? layout.defaultExpandedW;
    const collapsedDim = readControlHeightPx(sizeProp);
    const isGloss = variant === "gloss";

    const resolveSearchIdleShadow = useCallback(
      () => (expanded ? shadowBase() : shadowNone()),
      [expanded],
    );

    const standardShellHover = useSecondLevelShadow(rootRef, !blocked && !isGloss && groupSegment == null, {
      resolveIdle: resolveSearchIdleShadow,
      idleSyncKey: expanded,
    });
    const glossShellMotion = useGlossFieldShellMotion(rootRef, !blocked && isGloss && groupSegment == null);

    const bindRootRef = useCallback(
      (node: HTMLDivElement | null) => {
        rootRef.current = node;
        if (!blocked && isGloss && groupSegment == null) glossShellMotion.bindShellRef(node);
      },
      [blocked, glossShellMotion, groupSegment, isGloss],
    );

    const shellHorizontalBorderPx = useCallback(
      (shellEl: HTMLElement) => shellEl.offsetWidth - shellEl.clientWidth,
      [],
    );

    const iconLeftCollapsedAtBorderBoxWidth = useCallback(
      (borderBoxWidth: number, borderPx: number) =>
        (borderBoxWidth - borderPx - layout.iconBox) / 2,
      [layout.iconBox],
    );

    const iconLeftCollapsedCss = `calc(50% - ${layout.iconBox / 2}px)`;

    const initialExpandedRef = useRef(expanded);
    const bindIconRef = useCallback(
      (node: HTMLSpanElement | null) => {
        iconRef.current = node;
        if (node && !node.hasAttribute("data-search-icon-init")) {
          node.setAttribute("data-search-icon-init", "");
          const open = initialExpandedRef.current;
          node.style.left = open ? `${layout.padX}px` : iconLeftCollapsedCss;
        }
      },
      [iconLeftCollapsedCss, layout.padX],
    );

    const applyShellMetrics = useCallback(
      (open: boolean) => {
        const el = rootRef.current;
        const iconEl = iconRef.current;
        if (!el || !iconEl) return;
        if (open) {
          el.style.width = `${targetW}px`;
        } else {
          el.style.removeProperty("width");
        }
        el.style.removeProperty("height");
        el.style.removeProperty("borderRadius");
        iconEl.style.left = open
          ? `${layout.padX}px`
          : iconLeftCollapsedCss;
      },
      [iconLeftCollapsedCss, layout.padX, targetW],
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

        killMotion(el);
        killMotion(iconEl);
        el.style.removeProperty("borderRadius");

        const expandedRadius = readSearchExpandedRadiusPx(sizeProp);

        if (open) {
          el.style.width = `${collapsedDim}px`;
          el.style.borderRadius = `${collapsedDim / 2}px`;
          const iconLeftFrom = (el.clientWidth - layout.iconBox) / 2;
          iconEl.style.left = `${iconLeftFrom}px`;

          const vars = motionInteractive();
          gsap
            .timeline({
              onComplete: () => {
                el.style.removeProperty("borderRadius");
              },
            })
            .to(
              el,
              {
                width: targetW,
                borderRadius: expandedRadius,
                ...vars,
                overwrite: "auto",
              },
              0,
            )
            .to(
              iconEl,
              {
                left: layout.padX,
                ...vars,
                overwrite: "auto",
              },
              0,
            );
          return;
        }

        const borderPx = shellHorizontalBorderPx(el);
        const iconLeftTo = iconLeftCollapsedAtBorderBoxWidth(collapsedDim, borderPx);

        iconEl.style.left = `${layout.padX}px`;
        const vars = motionInteractive();
        gsap
          .timeline({
            onComplete: () => {
              el.style.removeProperty("width");
              el.style.removeProperty("borderRadius");
              iconEl.style.left = iconLeftCollapsedCss;
            },
          })
          .to(
            el,
            {
              width: collapsedDim,
              borderRadius: collapsedDim / 2,
              ...vars,
              overwrite: "auto",
            },
            0,
          )
          .to(
            iconEl,
            {
              left: iconLeftTo,
              ...vars,
              overwrite: "auto",
            },
            0,
          );
      },
      [
        applyShellMetrics,
        collapsedDim,
        iconLeftCollapsedAtBorderBoxWidth,
        iconLeftCollapsedCss,
        layout.iconBox,
        layout.padX,
        shellHorizontalBorderPx,
        sizeProp,
        targetW,
      ],
    );

    useLayoutEffect(() => {
      if (!layoutReadyRef.current) {
        layoutReadyRef.current = true;
        applyShellMetrics(expanded);
        prevExpandedRef.current = expanded;
        return;
      }
      if (prevExpandedRef.current === expanded) return;
      prevExpandedRef.current = expanded;
      runExpandMotion(expanded);
    }, [applyShellMetrics, expanded, runExpandMotion]);

    const focusInput = useCallback(() => {
      requestAnimationFrame(() => inputRef.current?.focus());
    }, []);

    const openFromInteraction = useCallback(async () => {
      if (blocked || expanded) return;
      await (squeezePromiseRef.current ?? Promise.resolve());
      squeezePromiseRef.current = null;
      setExpanded(true);
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
        squeezePromiseRef.current = isGloss && groupSegment == null
          ? animateGlossInteractivePressSqueeze(shell)
          : animateInteractivePressSqueeze(shell).then(() => {});
      },
      [blocked, expanded, groupSegment, isGloss],
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

    const handlePointerEnter = isGloss && groupSegment == null
      ? glossShellMotion.onShellPointerEnter
      : standardShellHover.onPointerEnter;
    const handlePointerLeave = isGloss && groupSegment == null
      ? glossShellMotion.onShellPointerLeave
      : standardShellHover.onPointerLeave;

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

    const collapseA11yLabel = ariaLabelProp ?? "Open search";
    const inputAriaLabel =
      ariaLabelProp ?? (placeholder ? String(placeholder) : "Search");
    const groupShellClass = groupSegment
      ? cn(
          buttonGroupRoundingClasses(groupSegment),
          buttonGroupSegmentSurfaceClasses(groupSegment),
        )
      : null;

    return (
      <div
        ref={bindRootRef}
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
        onFocusCapture={isGloss && groupSegment == null ? glossShellMotion.onShellFocusIn : undefined}
        onBlurCapture={isGloss && groupSegment == null ? glossShellMotion.onShellFocusOut : undefined}
        className={cn(
          groupSegment
            ? groupShellClass
            : expanded
              ? SEARCH_EXPANDED_ROUNDED_CLASS[sizeProp]
              : cn("rounded-full", layout.shellWCollapsed),
          "relative box-border inline-block overflow-hidden text-left",
          isGloss
            ? "gloss-control border-0"
            : cn("border-1 border-token", FIELD_SHELL_VARIANT_BG_CLASS[variant]),
          FIELD_SHELL_TRANSITION_CLASS,
          FIELD_SHELL_FOCUS_CLASS,
          isGloss ? glossShellMotion.shellHoverMotionClass : fieldShellHoverClass(!blocked, "default", variant),
          !isGloss && !blocked && standardShellHover.motionClass,
          expanded ? "cursor-text" : "",
          !expanded && !blocked ? "cursor-pointer" : "",
          blocked ? "pointer-events-none opacity-55" : "",
          className,
        )}
        onPointerDown={handleRootPointerDown}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
      >
        {ripple ? (
          <Ripple color="neutral" disabled={blocked} />
        ) : null}
        <span
          ref={bindIconRef}
          className={SEARCH_INPUT_ICON_WRAP_CLASS}
          style={{ width: layout.iconBox }}
          aria-hidden
        >
          <IoSearch className={cn(SEARCH_INPUT_ICON_CLASS, layout.iconClass)} aria-hidden />
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
            SEARCH_INPUT_CONTROL_BASE_CLASS,
            layout.controlPad,
            FIELD_CONTROL_MOBILE_NO_ZOOM_CLASS,
            expanded
              ? SEARCH_INPUT_CONTROL_EXPANDED_CLASS
              : SEARCH_INPUT_CONTROL_COLLAPSED_CLASS,
          )}
          style={
            expanded
              ? {
                  paddingLeft: paddingInputLeft,
                  paddingRight: paddingInputRight,
                }
              : undefined
          }
          {...rest}
        />
        {showClear ? (
          <button
            type="button"
            aria-label="Clear field"
            onClick={handleClearClick}
            onPointerDown={(e) => e.stopPropagation()}
            className={cn(
              SEARCH_INPUT_CLEAR_BUTTON_CLASS,
              TEXT_COLOR_TRANSITION,
              hoverVariant(),
            )}
            style={{
              right: layout.padX,
              width: layout.clearTap,
              height: layout.clearTap,
            }}
          >
            <IoClose
              className={cn(SEARCH_INPUT_CLEAR_ICON_CLASS, layout.clearIconClass)}
              aria-hidden
            />
          </button>
        ) : null}
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";

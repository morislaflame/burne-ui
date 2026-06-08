import { animate, remove } from "animejs";
import { IoChevronForward } from "react-icons/io5";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useId,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  cloneElement,
  isValidElement,
  type HTMLAttributes,
  type MutableRefObject,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";
import { createPortal } from "react-dom";

import { Text } from "@/components/core/Text";
import { Separator } from "@/components/core/Separator";
import { Popover } from "@/components/core/Popover";
import {
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import { SelectionIndicator } from "@/components/core/SelectionIndicator";
import type {
  SelectionIndicatorSize,
  SelectionIndicatorVariant,
} from "@/components/core/SelectionIndicator";
import { MOTION_INTERACTIVE_EASE, MOTION_TOOLTIP_MS } from "@/components/core/utils/motionTokens";
import { cn } from "@/utils/cn";

import { partitionOptionListItemChildren } from "@/components/core/utils/optionListItemChildren";
import {
  optionListItemGridClass,
} from "@/components/core/utils/optionControlGridLayout";
import {
  OptionListItemContextProvider,
  useOptionListItemContext,
} from "@/components/core/utils/optionListItemContext";
import {
  OptionListItemHint,
  OptionListItemIcon,
  OptionListItemIndicatorShell,
  OptionListItemLabel,
} from "@/components/core/utils/optionListItemParts";

function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const r of refs) {
      if (r == null) continue;
      if (typeof r === "function") r(node);
      else (r as MutableRefObject<T | null>).current = node;
    }
  };
}

function normalizeValues(v: string | string[] | undefined): string[] {
  if (v == null) return [];
  return Array.isArray(v) ? [...v] : [v];
}

type DropdownContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
  multiple: boolean;
  selected: Set<string>;
  selectItem: (value: string) => void;
  indicatorMode: "radio" | "multi";
  closeOnSelect: boolean;
  triggerRef: MutableRefObject<HTMLElement | null>;
  contentRef: MutableRefObject<HTMLDivElement | null>;
  contentId: string;
  /** Корни портальных саб-панелей — не считаются «кликом снаружи» для закрытия меню. */
  subPanelRootsRef: MutableRefObject<Set<HTMLElement>>;
};

const DropdownContext = createContext<DropdownContextValue | null>(null);

/**
 * Для одиночного выбора: показывать ли слот индикатора слева (наследование + `selectionIndicator` у группы).
 * В режиме `multiple` пункты всё равно показывают индикатор независимо от этого значения.
 */
const DropdownIndicatorPreferenceContext = createContext<boolean>(false);

function useDropdownIndicatorPreference() {
  return useContext(DropdownIndicatorPreferenceContext);
}

function useDropdown() {
  const ctx = useContext(DropdownContext);
  if (!ctx) throw new Error("Компоненты Dropdown.* должны быть внутри <Dropdown>.");
  return ctx;
}

/** Портал в `body` не наследует `data-theme` — копируем с триггера (как у `Tooltip`). */
function inheritThemePortalProps(triggerEl: HTMLElement | null): {
  "data-theme"?: "light";
} {
  if (!triggerEl) return {};
  const inherited = triggerEl.closest("[data-theme]")?.getAttribute("data-theme");
  return inherited === "light" ? { "data-theme": "light" as const } : {};
}

const MENU_ITEM_SELECTOR =
  '[role="menuitem"]:not([aria-disabled="true"]), [role="menuitemcheckbox"]:not([disabled]), [role="menuitemradio"]:not([disabled])';

function getFocusableMenuItems(root: HTMLElement): HTMLElement[] {
  return Array.from(root.querySelectorAll<HTMLElement>(MENU_ITEM_SELECTOR)).filter(
    (el) => !el.hasAttribute("disabled"),
  );
}

function focusMenuItem(items: HTMLElement[], index: number) {
  const item = items[index];
  if (item) item.focus();
}

const DropdownGroupLabelRegisterContext = createContext<
  ((id: string | undefined) => void) | null
>(null);

export type DropdownProps = Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  children: ReactNode;
  /** Управляемое открытие. */
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  /** Несколько значений `value`. */
  multiple?: boolean;
  /** Выбранное значение или значения (`Dropdown.Item` → `value`). */
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  /**
   * Индикатор слева для одиночного выбора: радио слева у пунктов с `selection`.
   * По умолчанию выключен. У `DropdownGroup` можно задать свой `selectionIndicator` — он действует на эту группу и вложенные (пока не переопределят).
   * В режиме `multiple` индикаторы у выбираемых пунктов всегда включены.
   */
  selectionIndicator?: boolean;
  /**
   * Закрыть после выбора пункта. По умолчанию `true` при `multiple === false`, иначе `false`.
   */
  closeOnSelect?: boolean;
};

export function DropdownRoot({
  children,
  className = "",
  open: openProp,
  defaultOpen = false,
  onOpenChange,
  multiple = false,
  value: valueProp,
  defaultValue,
  onValueChange,
  selectionIndicator = false,
  closeOnSelect: closeOnSelectProp,
  ...rest
}: DropdownProps) {
  const isControlledOpen = openProp !== undefined;
  const [internalOpen, setInternalOpen] = useState(defaultOpen);
  const open = isControlledOpen ? openProp! : internalOpen;

  const setOpen = useCallback(
    (next: boolean) => {
      if (!isControlledOpen) setInternalOpen(next);
      onOpenChange?.(next);
    },
    [isControlledOpen, onOpenChange],
  );

  const isControlledValue = valueProp !== undefined;
  const [internalSelected, setInternalSelected] = useState<string[]>(() =>
    normalizeValues(defaultValue),
  );

  const selectedArr = isControlledValue ? normalizeValues(valueProp) : internalSelected;
  const selected = useMemo(() => new Set(selectedArr), [selectedArr]);

  const setSelectedArr = useCallback(
    (next: string[]) => {
      if (!isControlledValue) setInternalSelected(next);
      onValueChange?.(multiple ? next : next[0] ?? "");
    },
    [isControlledValue, multiple, onValueChange],
  );

  const selectItem = useCallback(
    (itemValue: string) => {
      let next: string[];
      if (multiple) {
        next = [...selectedArr];
        const i = next.indexOf(itemValue);
        if (i >= 0) next.splice(i, 1);
        else next.push(itemValue);
      } else {
        next = selected.has(itemValue) ? [] : [itemValue];
      }
      setSelectedArr(next);
      const close =
        closeOnSelectProp ?? !multiple;
      if (close) setOpen(false);
    },
    [
      multiple,
      selected,
      selectedArr,
      setOpen,
      setSelectedArr,
      closeOnSelectProp,
    ],
  );

  const triggerRef = useRef<HTMLElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);
  const subPanelRootsRef = useRef<Set<HTMLElement>>(null!);
  if (!subPanelRootsRef.current) subPanelRootsRef.current = new Set();
  const contentId = useId();

  const indicatorMode: "radio" | "multi" = multiple ? "multi" : "radio";

  const ctx = useMemo(
    () =>
      ({
        open,
        setOpen,
        multiple,
        selected,
        selectItem,
        indicatorMode,
        closeOnSelect: closeOnSelectProp ?? !multiple,
        triggerRef,
        contentRef,
        contentId,
        subPanelRootsRef,
      }) satisfies DropdownContextValue,
    [
      open,
      setOpen,
      multiple,
      selected,
      selectItem,
      indicatorMode,
      closeOnSelectProp,
      contentId,
      subPanelRootsRef,
    ],
  );

  return (
    <DropdownContext.Provider value={ctx}>
      <DropdownIndicatorPreferenceContext.Provider value={selectionIndicator}>
        <div className={cn("relative inline-flex", className)} {...rest}>
          {children}
        </div>
      </DropdownIndicatorPreferenceContext.Provider>
    </DropdownContext.Provider>
  );
}

export type DropdownTriggerProps = HTMLAttributes<HTMLElement> & {
  /** Пробросить пропы на единственного ребёнка (например `<Button />`). */
  asChild?: boolean;
};

export const DropdownTrigger = forwardRef<HTMLElement, DropdownTriggerProps>(
  function DropdownTrigger(
    { children, className = "", asChild, onClick, ...rest },
    forwardedRef,
  ) {
    const { open, setOpen, triggerRef, contentId } = useDropdown();

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLElement>) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        setOpen(!open);
      },
      [onClick, open, setOpen],
    );

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<
        HTMLAttributes<HTMLElement> & { ref?: Ref<HTMLElement> }
      >;
      return cloneElement(child, {
        ...rest,
        ref: mergeRefs(forwardedRef, triggerRef, child.props.ref),
        className: cn(child.props.className, className),
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          child.props.onClick?.(e);
          handleClick(e);
        },
        "aria-expanded": open,
        "aria-haspopup": "menu",
        "aria-controls": contentId,
      });
    }

    return (
      <button
        type="button"
        ref={mergeRefs(
          forwardedRef as Ref<HTMLButtonElement>,
          triggerRef as Ref<HTMLButtonElement>,
        )}
        className={cn("inline-flex", className)}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={contentId}
        onClick={handleClick as React.MouseEventHandler<HTMLButtonElement>}
        {...rest}
      >
        {children}
      </button>
    );
  },
);

export type DropdownPopoverProps = HTMLAttributes<HTMLDivElement> & {
  /** Классы для внутренней панели меню (`Popover.Body`): padding, gap, max-height, … */
  bodyClassName?: string;
};

export type DropdownContentProps = DropdownPopoverProps;

export const DropdownPopover = forwardRef<HTMLDivElement, DropdownPopoverProps>(
  function DropdownPopover(
    { children, className = "", bodyClassName, ...rest },
    forwardedRef,
  ) {
    const {
      open,
      setOpen,
      triggerRef,
      contentRef,
      contentId,
      subPanelRootsRef,
    } = useDropdown();

    const shouldDismiss = useCallback(
      (target: Node) => {
        for (const root of subPanelRootsRef.current) {
          if (root.contains(target)) return false;
        }
        return true;
      },
      [subPanelRootsRef],
    );

    useLayoutEffect(() => {
      if (!open) return;
      const panel = contentRef.current;
      if (!panel) return;
      const items = getFocusableMenuItems(panel);
      items[0]?.focus();
    }, [contentRef, open]);

    useEffect(() => {
      if (!open) return;
      const panel = contentRef.current;
      if (!panel) return;

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
          e.preventDefault();
          setOpen(false);
          triggerRef.current?.focus();
          return;
        }

        const items = getFocusableMenuItems(panel);
        if (items.length === 0) return;

        const active = document.activeElement as HTMLElement | null;
        const idx = active ? items.indexOf(active) : -1;

        if (e.key === "ArrowDown") {
          e.preventDefault();
          focusMenuItem(items, idx < items.length - 1 ? idx + 1 : 0);
          return;
        }
        if (e.key === "ArrowUp") {
          e.preventDefault();
          focusMenuItem(items, idx > 0 ? idx - 1 : items.length - 1);
          return;
        }
        if (e.key === "Home") {
          e.preventDefault();
          focusMenuItem(items, 0);
          return;
        }
        if (e.key === "End") {
          e.preventDefault();
          focusMenuItem(items, items.length - 1);
        }
      };

      panel.addEventListener("keydown", onKeyDown);
      return () => panel.removeEventListener("keydown", onKeyDown);
    }, [contentRef, open, setOpen, triggerRef]);

    return (
      <Popover
        open={open}
        onOpenChange={setOpen}
        side="bottom"
        anchorRef={triggerRef}
        shouldDismiss={shouldDismiss}
      >
        <Popover.Content
          ref={mergeRefs(forwardedRef, contentRef)}
          matchAnchorWidth
          unstyled
          contentRole={undefined}
          offset={6}
          id={contentId}
          className={cn("z-[100]", className)}
          {...rest}
        >
          <Popover.Body
            role="menu"
            className={cn(
              "max-h-[min(24rem,70vh)] gap-xsmall overflow-y-auto overflow-x-hidden p-plus text-left outline-none",
              bodyClassName,
            )}
          >
            {children}
          </Popover.Body>
        </Popover.Content>
      </Popover>
    );
  },
);

/** @deprecated Используйте `Dropdown.Popover`. */
export const DropdownContent = DropdownPopover;

export type DropdownGroupProps = HTMLAttributes<HTMLDivElement> & {
  /**
   * Переопределить показ индикатора выбора слева для этой группы и вложенных групп (только при одиночном выборе).
   * Не задано — наследовать от родителя (`Dropdown` или внешней `DropdownGroup`).
   */
  selectionIndicator?: boolean;
};

/**
 * Логическая группа пунктов (как `DropdownMenuGroup`): внутри — `Dropdown.Label`, `Dropdown.Item`, без лишнего отступа между соседними группами кроме `gap` у контента и `Dropdown.Separator`.
 */
export function DropdownGroup({
  className = "",
  children,
  selectionIndicator,
  ...rest
}: DropdownGroupProps) {
  const parentPreference = useDropdownIndicatorPreference();
  const resolvedPreference =
    selectionIndicator !== undefined ? selectionIndicator : parentPreference;
  const [labelId, setLabelId] = useState<string | undefined>();

  const registerLabel = useCallback((id: string | undefined) => {
    setLabelId(id);
  }, []);

  return (
    <DropdownIndicatorPreferenceContext.Provider value={resolvedPreference}>
      <DropdownGroupLabelRegisterContext.Provider value={registerLabel}>
        <div
          role="group"
          aria-labelledby={labelId}
          className={cn("flex min-w-0 flex-col gap-xsmall text-left", className)}
          {...rest}
        >
          {children}
        </div>
      </DropdownGroupLabelRegisterContext.Provider>
    </DropdownIndicatorPreferenceContext.Provider>
  );
}

export type DropdownLabelProps = HTMLAttributes<HTMLDivElement>;

export function DropdownLabel({
  className = "",
  children,
  id: idProp,
  ...rest
}: DropdownLabelProps) {
  const autoId = useId();
  const id = idProp ?? autoId;
  const registerLabel = useContext(DropdownGroupLabelRegisterContext);

  useLayoutEffect(() => {
    registerLabel?.(id);
    return () => registerLabel?.(undefined);
  }, [id, registerLabel]);

  return (
    <div id={id} className={cn("px-base text-left", className)} {...rest}>
      <Text as="span" variant="small" className="font-medium text-muted">
        {children}
      </Text>
    </div>
  );
}

export type DropdownSeparatorProps = HTMLAttributes<HTMLDivElement>;

export function DropdownSeparator({ className = "", ...rest }: DropdownSeparatorProps) {
  /** Поля панели — `p-base`; сепаратор на всю ширину внутренней области. */
  return <Separator className={className} {...rest} />;
}

type DropdownSubContextValue = {
  open: boolean;
  setOpen: (next: boolean) => void;
  triggerRef: MutableRefObject<HTMLDivElement | null>;
  scheduleClose: () => void;
  cancelClose: () => void;
};

const DropdownSubContext = createContext<DropdownSubContextValue | null>(null);

function useDropdownSub() {
  const v = useContext(DropdownSubContext);
  if (!v) {
    throw new Error("Компоненты DropdownSub.* должны быть внутри <DropdownSub>.");
  }
  return v;
}

export type DropdownSubProps = HTMLAttributes<HTMLDivElement>;

/**
 * Вложенное меню по hover (и по клику для тач): `DropdownSubTrigger` + `DropdownSubContent`.
 */
export function DropdownSub({ className = "", children, ...rest }: DropdownSubProps) {
  const { open: menuOpen } = useDropdown();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLDivElement | null>(null);
  const closeTimerRef = useRef<ReturnType<typeof window.setTimeout> | undefined>(
    undefined,
  );

  useEffect(() => {
    if (!menuOpen) setOpen(false);
  }, [menuOpen]);

  const cancelClose = useCallback(() => {
    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = undefined;
  }, []);

  const scheduleClose = useCallback(() => {
    window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      setOpen(false);
    }, 160);
  }, []);

  const ctx = useMemo(
    () => ({
      open,
      setOpen,
      triggerRef,
      scheduleClose,
      cancelClose,
    }),
    [open, scheduleClose, cancelClose],
  );

  return (
    <DropdownSubContext.Provider value={ctx}>
      <div className={cn("relative min-w-0", className)} {...rest}>
        {children}
      </div>
    </DropdownSubContext.Provider>
  );
}

export type DropdownSubTriggerProps = HTMLAttributes<HTMLDivElement> & {
  /** Пробросить пропы на единственного ребёнка (обёртка вокруг текста). */
  asChild?: boolean;
};

export const DropdownSubTrigger = forwardRef<HTMLDivElement, DropdownSubTriggerProps>(
  function DropdownSubTrigger(
    {
      className = "",
      children,
      asChild,
      onPointerEnter,
      onPointerLeave,
      onClick,
      onKeyDown,
      ...rest
    },
    forwardedRef,
  ) {
    const { open, setOpen, triggerRef, scheduleClose, cancelClose } = useDropdownSub();

    const handleEnter = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        onPointerEnter?.(e);
        if (e.defaultPrevented) return;
        cancelClose();
        setOpen(true);
      },
      [cancelClose, onPointerEnter, setOpen],
    );

    const handleLeave = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        onPointerLeave?.(e);
        if (e.defaultPrevented) return;
        scheduleClose();
      },
      [onPointerLeave, scheduleClose],
    );

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLDivElement>) => {
        onClick?.(e);
        if (e.defaultPrevented) return;
        cancelClose();
        setOpen(true);
      },
      [cancelClose, onClick, setOpen],
    );

    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLDivElement>) => {
        onKeyDown?.(e);
        if (e.defaultPrevented) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          cancelClose();
          setOpen(true);
        }
      },
      [cancelClose, onKeyDown, setOpen],
    );

    const rowClass = cn(
      "flex w-full min-w-0 cursor-pointer items-center gap-base rounded-mid px-base py-small text-left outline-none",
      /* как у подписи в `Dropdown.Item`: токен `text-base`, не наследованный `1rem` у `html` */
      "text-base font-medium text-foreground button-idle-surface-transition motion-reduce:transition-none hover:bg-accent-fill-hover",
      "focus-visible:bg-accent-fill-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
      className,
    );

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<
        HTMLAttributes<HTMLElement> & { ref?: Ref<HTMLElement> }
      >;
      return cloneElement(child, {
        ...rest,
        ref: mergeRefs(forwardedRef, triggerRef, child.props.ref) as Ref<HTMLElement>,
        className: cn(child.props.className, rowClass),
        onPointerEnter: (e: React.PointerEvent<HTMLElement>) => {
          (child.props as HTMLAttributes<HTMLElement>).onPointerEnter?.(e);
          handleEnter(e as unknown as React.PointerEvent<HTMLDivElement>);
        },
        onPointerLeave: (e: React.PointerEvent<HTMLElement>) => {
          (child.props as HTMLAttributes<HTMLElement>).onPointerLeave?.(e);
          handleLeave(e as unknown as React.PointerEvent<HTMLDivElement>);
        },
        onClick: (e: React.MouseEvent<HTMLElement>) => {
          (child.props as HTMLAttributes<HTMLElement>).onClick?.(e);
          handleClick(e as unknown as React.MouseEvent<HTMLDivElement>);
        },
        onKeyDown: (e: React.KeyboardEvent<HTMLElement>) => {
          (child.props as HTMLAttributes<HTMLElement>).onKeyDown?.(e);
          handleKeyDown(e as unknown as React.KeyboardEvent<HTMLDivElement>);
        },
        role: "menuitem",
        "aria-expanded": open,
        "aria-haspopup": "menu",
      });
    }

    return (
      <div
        ref={mergeRefs(forwardedRef, triggerRef)}
        role="menuitem"
        tabIndex={-1}
        aria-expanded={open}
        aria-haspopup="menu"
        className={rowClass}
        onPointerEnter={handleEnter}
        onPointerLeave={handleLeave}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...rest}
      >
        <span className="min-w-0 flex-1">{children}</span>
        <IoChevronForward className="shrink-0 text-muted icon-base" aria-hidden />
      </div>
    );
  },
);

export type DropdownSubContentProps = HTMLAttributes<HTMLDivElement>;

export const DropdownSubContent = forwardRef<HTMLDivElement, DropdownSubContentProps>(
  function DropdownSubContent(
    {
      children,
      className = "",
      style,
      onPointerEnter: onPointerEnterProp,
      onPointerLeave: onPointerLeaveProp,
      ...rest
    },
    forwardedRef,
  ) {
    const { open: subOpen, triggerRef, scheduleClose, cancelClose } = useDropdownSub();
    const { subPanelRootsRef, triggerRef: menuTriggerRef } = useDropdown();

    const panelRef = useRef<HTMLDivElement | null>(null);
    const [pos, setPos] = useState({ top: 0, left: 0, minW: 0 });
    const [portalMounted, setPortalMounted] = useState(subOpen);

    const updatePosition = useCallback(() => {
      const t = triggerRef.current;
      if (!t) return;
      const r = t.getBoundingClientRect();
      const gap = 6;
      const minW = Math.max(r.width, 10 * 16);
      let left = r.right + gap;
      let top = r.top;
      const estW = minW;
      if (left + estW > window.innerWidth - 12) {
        left = Math.max(12, r.left - estW - gap);
      }
      const panel = panelRef.current;
      const ph = panel?.offsetHeight ?? 0;
      if (ph > 0 && top + ph > window.innerHeight - 8) {
        top = Math.max(8, window.innerHeight - ph - 8);
      }
      setPos({ top, left, minW });
    }, [triggerRef]);

    useLayoutEffect(() => {
      if (subOpen) setPortalMounted(true);
    }, [subOpen]);

    useLayoutEffect(() => {
      if (!subOpen) return;
      updatePosition();
    }, [subOpen, updatePosition]);

    useEffect(() => {
      if (!subOpen) return;
      const onScroll = () => updatePosition();
      window.addEventListener("scroll", onScroll, true);
      window.addEventListener("resize", onScroll);
      return () => {
        window.removeEventListener("scroll", onScroll, true);
        window.removeEventListener("resize", onScroll);
      };
    }, [subOpen, updatePosition]);

    useLayoutEffect(() => {
      const el = panelRef.current;
      if (!portalMounted || !el) return;
      subPanelRootsRef.current.add(el);
      return () => {
        subPanelRootsRef.current.delete(el);
      };
    }, [portalMounted, subPanelRootsRef]);

    useLayoutEffect(() => {
      if (!portalMounted) return undefined;
      const el = panelRef.current;
      if (!el) return undefined;

      const reduced = prefersReducedInteractiveHoverLift();
      let cancelled = false;

      if (reduced) {
        remove(el);
        if (subOpen) {
          el.style.opacity = "";
        } else {
          setPortalMounted(false);
        }
        return () => {
          cancelled = true;
        };
      }

      remove(el);

      if (subOpen) {
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
    }, [subOpen, portalMounted]);

    const handleEnter = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        onPointerEnterProp?.(e);
        if (e.defaultPrevented) return;
        cancelClose();
      },
      [cancelClose, onPointerEnterProp],
    );

    const handleLeave = useCallback(
      (e: React.PointerEvent<HTMLDivElement>) => {
        onPointerLeaveProp?.(e);
        if (e.defaultPrevented) return;
        scheduleClose();
      },
      [onPointerLeaveProp, scheduleClose],
    );

    if (!portalMounted) return null;

    const portalTheme = inheritThemePortalProps(menuTriggerRef.current);

    const panel = (
      <div
        ref={mergeRefs(forwardedRef, panelRef)}
        {...portalTheme}
        role="menu"
        className={cn(
          "fixed z-[110] flex max-h-[min(22rem,65vh)] flex-col overflow-y-auto overflow-x-hidden rounded-mid border border-base bg-surface p-base text-left shadow-token-md outline-none",
          "will-change-[opacity] motion-reduce:transition-none",
          !subOpen && portalMounted && "pointer-events-none",
          className,
        )}
        style={{
          top: pos.top,
          left: pos.left,
          minWidth: pos.minW,
          ...style,
        }}
        {...rest}
        onPointerEnter={handleEnter}
        onPointerLeave={handleLeave}
      >
        {children}
      </div>
    );

    return typeof document !== "undefined"
      ? createPortal(panel, document.body)
      : null;
  },
);

function partitionDropdownItemChildren(children: ReactNode) {
  return partitionOptionListItemChildren(children);
}

export type DropdownItemLabelProps = HTMLAttributes<HTMLSpanElement>;

export function DropdownItemLabel(props: DropdownItemLabelProps) {
  return <OptionListItemLabel {...props} />;
}

DropdownItemLabel.displayName = "DropdownItemLabel";

export type DropdownItemHintProps = HTMLAttributes<HTMLSpanElement>;

export function DropdownItemHint(props: DropdownItemHintProps) {
  return <OptionListItemHint {...props} />;
}

DropdownItemHint.displayName = "DropdownItemHint";

export type DropdownItemIconProps = HTMLAttributes<HTMLSpanElement>;

export function DropdownItemIcon(props: DropdownItemIconProps) {
  return <OptionListItemIcon {...props} />;
}

DropdownItemIcon.displayName = "DropdownItemIcon";

export type DropdownItemIndicatorProps = Omit<HTMLAttributes<HTMLSpanElement>, "children"> & {
  variant?: SelectionIndicatorVariant;
  size?: SelectionIndicatorSize;
  /** Галочка при выборе; по умолчанию — в режиме `multiple`. */
  check?: boolean;
  /** Своя иконка поверх заливки вместо галочки. */
  children?: ReactNode;
};

export function DropdownItemIndicator({
  variant = "base",
  size = "small",
  check,
  children,
  className,
  ...rest
}: DropdownItemIndicatorProps) {
  const ctx = useOptionListItemContext("Dropdown.ItemIndicator");

  if (!ctx.showIndicatorSlot) return null;

  const showCheck = check ?? ctx.indicatorMode === "multi";
  const hasCustomIcon = children != null;

  return (
    <OptionListItemIndicatorShell className={className} {...rest}>
      <SelectionIndicator
        variant={variant}
        size={size}
        selected={ctx.selected}
        check={showCheck && !hasCustomIcon}
        icon={children ?? undefined}
      />
    </OptionListItemIndicatorShell>
  );
}

DropdownItemIndicator.displayName = "DropdownItemIndicator";

export type DropdownItemVariant = "default" | "danger" | "warning" | "info" | "success";

const DROPDOWN_ITEM_VARIANT_CLASS: Record<DropdownItemVariant, string> = {
  default: cn(
    "text-foreground hover:bg-accent-fill-hover",
    "focus-visible:bg-accent-fill-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
  ),
  danger: cn(
    "text-danger hover:bg-accent-fill-hover",
    "focus-visible:bg-accent-fill-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger",
  ),
  warning: cn(
    "text-warning hover:bg-accent-fill-hover",
    "focus-visible:bg-accent-fill-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-warning",
  ),
  info: cn(
    "text-info hover:bg-accent-fill-hover",
    "focus-visible:bg-accent-fill-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-info",
  ),
  success: cn(
    "text-success hover:bg-accent-fill-hover",
    "focus-visible:bg-accent-fill-hover focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-success",
  ),
};

export type DropdownItemProps = Omit<HTMLAttributes<HTMLElement>, "value"> & {
  /**
   * Ключ для режима выбора. Не нужен при `selection={false}` или при `href`.
   */
  value?: string;
  /** Навигационная ссылка — рендер `<a role="menuitem">`; выбор значения отключён. */
  href?: string;
  disabled?: boolean;
  /**
   * Пункт участвует в выборе значения; при `multiple` или при включённом `selectionIndicator` у `Dropdown` / `Dropdown.Group` слева показывается индикатор.
   * `false` — действие: без выбора значения; клик закрывает меню.
   */
  selection?: boolean;
  /** Семантический цвет подписи и строки (hint наследует тон с прозрачностью). */
  variant?: DropdownItemVariant;
};

export const DropdownItem = forwardRef<HTMLElement, DropdownItemProps>(
  function DropdownItem(
    {
      children,
      className = "",
      value,
      href,
      disabled = false,
      selection: selectionProp,
      variant = "default",
      onClick,
      onPointerDown,
      ...rest
    },
    ref,
  ) {
    const {
      selected,
      selectItem,
      multiple,
      indicatorMode,
      setOpen,
    } = useDropdown();
    const indicatorPreference = useDropdownIndicatorPreference();

    const parts = partitionDropdownItemChildren(children);
    const hasItemIndicator = parts.indicator != null;
    const hasHint = parts.hint != null;
    const hasIcon = parts.icon != null;

    const isLink = Boolean(href);
    const isSelectionItem = !isLink && selectionProp !== false;
    const showIndicatorSlot =
      isSelectionItem && (multiple || indicatorPreference || hasItemIndicator);

    const itemRole =
      !showIndicatorSlot
        ? "menuitem"
        : indicatorMode === "multi"
          ? "menuitemcheckbox"
          : "menuitemradio";

    const isSelected = isSelectionItem && value != null && selected.has(value);
    const rowRef = useRef<HTMLElement | null>(null);

    const setRefs = useCallback(
      (node: HTMLElement | null) => {
        rowRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const rowClass = cn(
      "w-full min-w-0 origin-center rounded-mid px-base py-small text-left no-underline outline-none text-base",
      optionListItemGridClass(hasHint, "gap-x-base", showIndicatorSlot, hasIcon),
      "button-idle-surface-transition motion-reduce:transition-none",
      !disabled && cn("cursor-pointer", DROPDOWN_ITEM_VARIANT_CLASS[variant]),
      disabled &&
        "cursor-not-allowed bg-transparent text-muted opacity-45 hover:bg-transparent",
      className,
    );

    const handlePointerDown = useCallback(
      (e: React.PointerEvent<HTMLElement>) => {
        onPointerDown?.(e);
        if (e.defaultPrevented || disabled) return;
        const el = rowRef.current;
        if (!el || prefersReducedInteractiveHoverLift()) return;
        void animateInteractivePressSqueeze(el);
      },
      [disabled, onPointerDown],
    );

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLElement>) => {
        onClick?.(e);
        if (e.defaultPrevented || disabled) return;
        if (!isSelectionItem) {
          setOpen(false);
          return;
        }
        if (value == null) return;
        selectItem(value);
      },
      [disabled, isSelectionItem, onClick, selectItem, setOpen, value],
    );

    const itemBody = (
      <>
        {showIndicatorSlot && !hasItemIndicator ? <DropdownItemIndicator /> : null}
        {parts.indicator}
        {parts.label}
        {parts.hint}
        {parts.icon}
        {parts.rest}
      </>
    );

    const itemCtx = {
      showIndicatorSlot,
      hasHint,
      hasIcon,
      selected: isSelected,
      indicatorMode,
      disabled,
      mutedHint: disabled || variant === "default",
    };

    if (isLink) {
      return (
        <OptionListItemContextProvider value={itemCtx}>
          <a
            ref={setRefs as Ref<HTMLAnchorElement>}
            role={itemRole}
            href={disabled ? undefined : href}
            tabIndex={-1}
            aria-disabled={disabled || undefined}
            className={rowClass}
            onClick={handleClick}
            onPointerDown={handlePointerDown}
            {...(rest as HTMLAttributes<HTMLAnchorElement>)}
          >
            {itemBody}
          </a>
        </OptionListItemContextProvider>
      );
    }

    return (
      <OptionListItemContextProvider value={itemCtx}>
        <button
          ref={setRefs as Ref<HTMLButtonElement>}
          type="button"
          role={itemRole}
          disabled={disabled}
          tabIndex={-1}
          aria-checked={showIndicatorSlot ? isSelected : undefined}
          className={rowClass}
          onClick={handleClick}
          onPointerDown={handlePointerDown}
          {...(rest as HTMLAttributes<HTMLButtonElement>)}
        >
          {itemBody}
        </button>
      </OptionListItemContextProvider>
    );
  },
);

DropdownTrigger.displayName = "Dropdown.Trigger";
DropdownPopover.displayName = "Dropdown.Popover";
DropdownContent.displayName = "Dropdown.Content";
DropdownItem.displayName = "Dropdown.Item";
DropdownGroup.displayName = "Dropdown.Group";
DropdownLabel.displayName = "Dropdown.Label";
DropdownSeparator.displayName = "Dropdown.Separator";
DropdownSub.displayName = "Dropdown.Sub";
DropdownSubTrigger.displayName = "Dropdown.SubTrigger";
DropdownSubContent.displayName = "Dropdown.SubContent";
DropdownRoot.displayName = "Dropdown";

/** Составной API: `Dropdown.Trigger`, `Dropdown.Popover`, `Dropdown.Item`, … */

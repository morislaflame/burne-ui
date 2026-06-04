import { animate, remove } from "animejs";
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
  type HTMLAttributes,
  type KeyboardEvent,
  type PointerEvent,
  type ReactNode,
} from "react";
import { IoChevronDown } from "react-icons/io5";

import { Text } from "@/components/core/Text";
import {
  animateInteractiveHoverLift,
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import {
  MOTION_INTERACTIVE_EASE,
} from "@/components/core/utils/motionTokens";
import { cn } from "@/utils/cn";

// ─── types ────────────────────────────────────────────────────────────────────

export type DisclosureVariant = "default" | "outline" | "secondary" | "card" | "ghost";
export type DisclosureSize = "small" | "base" | "mid" | "large";
export type DisclosureIconPos = "left" | "right";

/** Контент в отдельной рамке под триггером (outline / secondary). */
function isFramedVariant(variant: DisclosureVariant): boolean {
  return variant === "outline" || variant === "secondary";
}

// ─── DisclosureGroup context ──────────────────────────────────────────────────

type DisclosureGroupCtx = {
  openValue: string | null;
  setOpenValue: (val: string | null) => void;
  variant: DisclosureVariant;
  size: DisclosureSize;
  separated: boolean;
  accordion: boolean;
};

const DisclosureGroupContext = createContext<DisclosureGroupCtx | null>(null);

// ─── Disclosure context ───────────────────────────────────────────────────────

type DisclosureCtx = {
  open: boolean;
  setOpen: (v: boolean) => void;
  triggerId: string;
  panelId: string;
  variant: DisclosureVariant;
  size: DisclosureSize;
  disabled: boolean;
  iconPos: DisclosureIconPos;
};

const DisclosureCtx = createContext<DisclosureCtx | null>(null);

function useDisclosureCtx(): DisclosureCtx {
  const ctx = useContext(DisclosureCtx);
  if (!ctx) throw new Error("Disclosure parts must be inside <Disclosure>.");
  return ctx;
}

// ─── size maps ────────────────────────────────────────────────────────────────

const TRIGGER_H: Record<DisclosureSize, string> = {
  small: "min-h-control-small",
  base: "min-h-control-base",
  mid: "min-h-control-mid",
  large: "min-h-control-large",
};

const TRIGGER_PAD: Record<DisclosureSize, string> = {
  small: "px-base",
  base: "px-plus",
  mid: "px-mid",
  large: "px-large",
};

const CONTENT_PAD: Record<DisclosureSize, string> = {
  small: "p-base",
  base: "p-plus",
  mid: "p-mid",
  large: "p-large",
};

const TRIGGER_TEXT: Record<DisclosureSize, string> = {
  small: "small",
  base: "base",
  mid: "mid",
  large: "mid",
};

const ICON_CLASS: Record<DisclosureSize, string> = {
  small: "icon-small",
  base: "icon-base",
  mid: "icon-large",
  large: "icon-large",
};

// ─── variant maps ─────────────────────────────────────────────────────────────

const VARIANT_ROOT: Record<DisclosureVariant, string> = {
  default: "border-b border-base last:border-b-0",
  outline: "flex flex-col",
  secondary: "flex flex-col",
  card: "overflow-hidden rounded-mid border border-base bg-surface animate-shadow",
  ghost: "flex flex-col",
};

const FRAMED_PANEL: Record<"outline" | "secondary", string> = {
  outline: "surface-outline rounded-mid text-foreground",
  secondary: "surface-secondary rounded-mid text-foreground",
};

const VARIANT_TRIGGER: Record<DisclosureVariant, string> = {
  default: cn(
    "rounded-mid bg-transparent text-foreground",
    "button-idle-surface-transition motion-reduce:transition-none",
    "hover:bg-accent-fill-hover",
  ),
  outline: cn(
    "rounded-mid bg-transparent text-foreground",
    "button-idle-surface-transition motion-reduce:transition-none",
    "hover:bg-accent-fill-hover",
  ),
  secondary: cn(
    "rounded-mid bg-transparent text-foreground",
    "button-idle-surface-transition motion-reduce:transition-none",
    "hover:bg-accent-fill-hover",
  ),
  card: cn(
    "bg-transparent text-foreground",
    "button-idle-surface-transition motion-reduce:transition-none",
    "hover:bg-accent-fill-hover",
  ),
  ghost: cn(
    "rounded-mid bg-transparent text-foreground",
    "button-idle-surface-transition motion-reduce:transition-none",
    "hover:bg-accent-fill-hover",
  ),
};

const VARIANT_OPEN_TRIGGER: Record<DisclosureVariant, string> = {
  default: "",
  outline: "",
  secondary: "",
  card: "border-b border-base",
  ghost: "",
};

// ─── animation ────────────────────────────────────────────────────────────────

const EXPAND_MS = 280;
const EASE = MOTION_INTERACTIVE_EASE;

function useContentAnimation(
  shellRef: React.RefObject<HTMLDivElement | null>,
  innerRef: React.RefObject<HTMLDivElement | null>,
  open: boolean,
) {
  const isFirstRender = useRef(true);

  useLayoutEffect(() => {
    const shell = shellRef.current;
    const inner = innerRef.current;
    if (!shell || !inner) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (!open) {
        shell.style.height = "0px";
        shell.style.overflow = "hidden";
      }
      return;
    }

    remove(shell);

    if (open) {
      shell.style.overflow = "hidden";
      const target = inner.scrollHeight;
      animate(shell, {
        height: [0, target],
        duration: EXPAND_MS,
        ease: EASE,
        onComplete: () => {
          shell.style.height = "auto";
          shell.style.overflow = "hidden";
        },
      });
    } else {
      const current = shell.getBoundingClientRect().height;
      shell.style.height = `${current}px`;
      shell.style.overflow = "hidden";
      animate(shell, {
        height: [current, 0],
        duration: Math.round(EXPAND_MS * 0.85),
        ease: EASE,
        onComplete: () => {
          shell.style.height = "0px";
        },
      });
    }
  }, [open, shellRef, innerRef]);
}

function useChevronAnimation(
  chevronRef: React.RefObject<HTMLSpanElement | null>,
  open: boolean,
) {
  const isFirstRender = useRef(true);

  useLayoutEffect(() => {
    const el = chevronRef.current;
    if (!el) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (open) el.style.transform = "rotate(180deg)";
      return;
    }

    remove(el);
    animate(el, {
      rotate: open ? 180 : 0,
      duration: EXPAND_MS,
      ease: EASE,
    });
  }, [open, chevronRef]);
}

// ─── Disclosure.Trigger ───────────────────────────────────────────────────────

export type DisclosureTriggerProps = HTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  icon?: ReactNode | null;
};

const DisclosureTrigger = forwardRef<HTMLButtonElement, DisclosureTriggerProps>(
  function DisclosureTrigger(
    {
      children,
      icon,
      className = "",
      onKeyDown,
      onClick,
      onPointerEnter,
      onPointerLeave,
      onPointerDown,
      ...rest
    },
    ref,
  ) {
    const { open, setOpen, triggerId, panelId, variant, size, disabled, iconPos } =
      useDisclosureCtx();

    const chevronRef = useRef<HTMLSpanElement>(null);
    const btnRef = useRef<HTMLButtonElement>(null);
    const hoverInsideRef = useRef(false);

    const setRefs = useCallback(
      (node: HTMLButtonElement | null) => {
        btnRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    useChevronAnimation(chevronRef, open);

    useEffect(() => {
      return () => {
        const el = btnRef.current;
        if (el) remove(el);
      };
    }, []);

    useEffect(() => {
      if (!disabled) return;
      hoverInsideRef.current = false;
      const el = btnRef.current;
      if (el) remove(el);
    }, [disabled]);

    const handleClick = useCallback(
      (e: React.MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        if (e.defaultPrevented || disabled) return;
        setOpen(!open);
      },
      [disabled, onClick, open, setOpen],
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLButtonElement>) => {
        onKeyDown?.(e);
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (!disabled) setOpen(!open);
        }
      },
      [disabled, onKeyDown, open, setOpen],
    );

    const handlePointerEnter = useCallback(
      (e: PointerEvent<HTMLButtonElement>) => {
        onPointerEnter?.(e);
        if (e.defaultPrevented || disabled) return;
        hoverInsideRef.current = true;
        const el = btnRef.current;
        if (!el || prefersReducedInteractiveHoverLift()) return;
        animateInteractiveHoverLift(el, true);
      },
      [disabled, onPointerEnter],
    );

    const handlePointerLeave = useCallback(
      (e: PointerEvent<HTMLButtonElement>) => {
        onPointerLeave?.(e);
        hoverInsideRef.current = false;
        const el = btnRef.current;
        if (!el || prefersReducedInteractiveHoverLift()) return;
        animateInteractiveHoverLift(el, false);
      },
      [onPointerLeave],
    );

    const handlePointerDown = useCallback(
      (e: PointerEvent<HTMLButtonElement>) => {
        onPointerDown?.(e);
        if (e.defaultPrevented || disabled) return;
        const el = btnRef.current;
        if (!el || prefersReducedInteractiveHoverLift()) return;
        void animateInteractivePressSqueeze(el).then(() => {
          if (hoverInsideRef.current && btnRef.current && !prefersReducedInteractiveHoverLift()) {
            animateInteractiveHoverLift(btnRef.current, true);
          }
        });
      },
      [disabled, onPointerDown],
    );

    const chevronNode =
      icon !== null ? (
        <span
          ref={chevronRef}
          aria-hidden
          className={cn(
            "inline-flex shrink-0 origin-center items-center justify-center text-muted transition-colors duration-200",
            open && "text-accent",
            ICON_CLASS[size],
          )}
        >
          {icon ?? <IoChevronDown className="size-full" />}
        </span>
      ) : null;

    return (
      <button
        ref={setRefs}
        id={triggerId}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        disabled={disabled}
        className={cn(
          "flex w-full origin-center select-none items-center gap-small text-left outline-none will-change-transform",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
          TRIGGER_H[size],
          TRIGGER_PAD[size],
          VARIANT_TRIGGER[variant],
          open && VARIANT_OPEN_TRIGGER[variant],
          disabled && "cursor-not-allowed opacity-48",
          !disabled && "cursor-pointer",
          className,
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        onPointerDown={handlePointerDown}
        {...rest}
      >
        {iconPos === "left" && chevronNode}
        <Text
          as="span"
          variant={TRIGGER_TEXT[size] as "small" | "base" | "mid"}
          className={cn(
            "min-w-0 flex-1 font-medium",
            open ? "text-accent" : "text-foreground",
          )}
        >
          {children}
        </Text>
        {iconPos === "right" && chevronNode}
      </button>
    );
  },
);

DisclosureTrigger.displayName = "DisclosureTrigger";

// ─── Disclosure.Content ───────────────────────────────────────────────────────

export type DisclosureContentProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

const DisclosureContent = forwardRef<HTMLDivElement, DisclosureContentProps>(
  function DisclosureContent({ children, className = "", ...rest }, ref) {
    const { open, panelId, triggerId, size, variant } = useDisclosureCtx();

    const shellRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    useContentAnimation(shellRef, innerRef, open);

    const setShellRef = useCallback(
      (node: HTMLDivElement | null) => {
        shellRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const framed = isFramedVariant(variant);

    const innerCls = cn(
      CONTENT_PAD[size],
      framed && variant === "outline" && FRAMED_PANEL.outline,
      framed && variant === "secondary" && FRAMED_PANEL.secondary,
      framed && "mt-xsmall",
      variant === "ghost" && "text-muted",
      variant === "default" && "text-muted",
      className,
    );

    return (
      <div
        ref={setShellRef}
        aria-hidden={!open}
        className="overflow-hidden"
      >
        <div
          ref={innerRef}
          id={panelId}
          role="region"
          aria-labelledby={triggerId}
          className={innerCls}
          {...rest}
        >
          {children}
        </div>
      </div>
    );
  },
);

DisclosureContent.displayName = "DisclosureContent";

// ─── Disclosure root ──────────────────────────────────────────────────────────

export type DisclosureProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  value?: string;
  variant?: DisclosureVariant;
  size?: DisclosureSize;
  disabled?: boolean;
  iconPos?: DisclosureIconPos;
};

export const Disclosure = Object.assign(
  forwardRef<HTMLDivElement, DisclosureProps>(function Disclosure(
    {
      children,
      open: openProp,
      defaultOpen = false,
      onOpenChange,
      value,
      variant: variantProp,
      size: sizeProp,
      disabled = false,
      iconPos = "right",
      className = "",
      ...rest
    },
    ref,
  ) {
    const groupCtx = useContext(DisclosureGroupContext);

    // В режиме accordion=false каждый Disclosure управляет своим состоянием самостоятельно
    const isGrouped = groupCtx !== null && value !== undefined && groupCtx.accordion;
    const groupOpen = isGrouped ? groupCtx!.openValue === value : undefined;

    const [internal, setInternal] = useState(defaultOpen);

    const open = isGrouped ? groupOpen! : openProp !== undefined ? openProp : internal;

    const setOpen = useCallback(
      (next: boolean) => {
        if (isGrouped) {
          groupCtx!.setOpenValue(next ? (value ?? null) : null);
        } else {
          if (openProp === undefined) setInternal(next);
          onOpenChange?.(next);
        }
      },
      [isGrouped, groupCtx, value, openProp, onOpenChange],
    );

    const autoId = useId();
    const triggerId = `disclosure-trigger-${autoId}`;
    const panelId = `disclosure-panel-${autoId}`;

    const variant = variantProp ?? groupCtx?.variant ?? "default";
    const size = sizeProp ?? groupCtx?.size ?? "base";

    const groupedCardShell =
      groupCtx != null && !groupCtx.separated && groupCtx.variant === "card";

    const rootCls =
      variant === "card" && groupedCardShell
        ? "border-b border-base last:border-b-0"
        : VARIANT_ROOT[variant];

    const ctx: DisclosureCtx = useMemo(
      () => ({ open, setOpen, triggerId, panelId, variant, size, disabled, iconPos }),
      [disabled, iconPos, open, panelId, setOpen, size, triggerId, variant],
    );

    return (
      <DisclosureCtx.Provider value={ctx}>
        <div ref={ref} className={cn(rootCls, className)} {...rest}>
          {children}
        </div>
      </DisclosureCtx.Provider>
    );
  }),
  {
    Trigger: DisclosureTrigger,
    Content: DisclosureContent,
  },
);

Disclosure.displayName = "Disclosure";

// ─── DisclosureGroup ──────────────────────────────────────────────────────────

export type DisclosureGroupProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
  accordion?: boolean;
  separated?: boolean;
  variant?: DisclosureVariant;
  size?: DisclosureSize;
  value?: string | null;
  defaultValue?: string | null;
  onValueChange?: (value: string | null) => void;
};

export const DisclosureGroup = forwardRef<HTMLDivElement, DisclosureGroupProps>(
  function DisclosureGroup(
    {
      children,
      accordion = true,
      separated = false,
      variant = "default",
      size = "base",
      value: valueProp,
      defaultValue = null,
      onValueChange,
      className = "",
      ...rest
    },
    ref,
  ) {
    const isControlled = valueProp !== undefined;
    const [internal, setInternal] = useState<string | null>(defaultValue);
    const openValue = isControlled ? valueProp! : internal;

    const setOpenValue = useCallback(
      (val: string | null) => {
        const next = accordion && val === openValue ? null : val;
        if (!isControlled) setInternal(next);
        onValueChange?.(next);
      },
      [accordion, isControlled, onValueChange, openValue],
    );

    const ctx: DisclosureGroupCtx = useMemo(
      () => ({ openValue, setOpenValue, variant, size, separated, accordion }),
      [accordion, openValue, setOpenValue, variant, size, separated],
    );

    const groupCls = cn(
      "flex w-full flex-col",
      separated && "gap-mid",
      !separated && variant === "default" && "divide-y divide-base border-y border-base",
      !separated && variant === "card" &&
        "overflow-hidden rounded-mid border border-base bg-surface animate-shadow divide-y divide-base",
      !separated && (variant === "outline" || variant === "secondary" || variant === "ghost") &&
        "gap-small",
      className,
    );

    return (
      <DisclosureGroupContext.Provider value={ctx}>
        <div ref={ref} className={groupCls} {...rest}>
          {children}
        </div>
      </DisclosureGroupContext.Provider>
    );
  },
);

DisclosureGroup.displayName = "DisclosureGroup";

import { gsap, killMotion } from "@/components/core/utils/gsapMotion";
import {
  Children,
  createContext,
  forwardRef,
  isValidElement,
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
  shouldSkipInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import { getMotionConfig } from "@/components/core/utils/motionConfig";
import { hoverVariant } from "@/components/core/utils/hoverVariant";
import { cn } from "@/utils/cn";

import { useDisclosureContentDrag } from "./useDisclosureContentDrag";

// ─── types ────────────────────────────────────────────────────────────────────

export type DisclosureVariant = "default" | "outline" | "secondary" | "card" | "ghost";
export type DisclosureSize = "small" | "base" | "mid" | "large";
export type DisclosureIconPos = "left" | "right";

/** Контент в отдельной рамке под триггером (outline / secondary). */
function isFramedVariant(variant: DisclosureVariant): boolean {
  return variant === "outline" || variant === "secondary" || variant === "default";
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
  dragHandle: boolean;
  shellRef: React.RefObject<HTMLDivElement | null>;
  innerRef: React.RefObject<HTMLElement | null>;
  chevronRef: React.RefObject<HTMLSpanElement | null>;
  skipContentAnimRef: React.RefObject<boolean>;
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
  small: "px-base py-base",
  base: "px-large py-base",
  mid: "px-mid py-base",
  large: "px-large py-base",
};

const CONTENT_PAD: Record<DisclosureSize, string> = {
  small: "p-base",
  base: "p-mid",
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
  default: "flex flex-col",
  outline: "flex flex-col",
  secondary: "flex flex-col",
  card: "overflow-hidden rounded-base border-token bg-surface animate-shadow",
  ghost: "flex flex-col",
};

const FRAMED_PANEL: Record<DisclosureVariant, string> = {
  default: "bg-surface border-token rounded-mid text-foreground",
  outline: "bg-transparent border-token rounded-mid text-foreground",
  secondary: "bg-secondary border-token rounded-mid text-secondary-foreground",
  card: "bg-surface border-token rounded-mid text-foreground",
  ghost: "bg-transparent border-token rounded-mid text-foreground",
};

const TRIGGER_INTERACTIVE = cn(
  "bg-transparent text-foreground",
  hoverVariant(),
);

const VARIANT_TRIGGER: Record<DisclosureVariant, string> = {
  default: cn("rounded-mid", TRIGGER_INTERACTIVE),
  outline: cn("rounded-mid", TRIGGER_INTERACTIVE),
  secondary: cn("rounded-mid", TRIGGER_INTERACTIVE),
  card: TRIGGER_INTERACTIVE,
  ghost: cn("rounded-mid", TRIGGER_INTERACTIVE),
};

function readDisclosurePartDisplayName(type: unknown): string | undefined {
  return (type as { displayName?: string }).displayName;
}

/** Заголовок → контент → хэндл: раскрываемая часть между триггером и полоской. */
function orderDragHandleChildren(children: ReactNode): ReactNode[] {
  const trigger: ReactNode[] = [];
  const content: ReactNode[] = [];
  const handle: ReactNode[] = [];
  const other: ReactNode[] = [];

  Children.forEach(children, (child) => {
    if (!isValidElement(child)) {
      other.push(child);
      return;
    }
    const name = readDisclosurePartDisplayName(child.type);
    if (name === "DisclosureTrigger") trigger.push(child);
    else if (name === "DisclosureContent") content.push(child);
    else if (name === "DisclosureHandle") handle.push(child);
    else other.push(child);
  });

  return [...trigger, ...content, ...handle, ...other];
}

// ─── animation ────────────────────────────────────────────────────────────────

const EXPAND_EASE = "power1.inOut";

function releaseExpandedShellHeight(shell: HTMLElement, inner: HTMLElement) {
  const measured = inner.scrollHeight;
  shell.style.height = `${measured}px`;
  requestAnimationFrame(() => {
    shell.style.height = "auto";
    shell.style.overflow = "";
  });
}

function useContentAnimation(
  shellRef: React.RefObject<HTMLDivElement | null>,
  innerRef: React.RefObject<HTMLElement | null>,
  open: boolean,
  skipContentAnimRef: React.RefObject<boolean>,
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

    if (skipContentAnimRef.current) {
      skipContentAnimRef.current = false;
      if (open) {
        shell.style.height = "auto";
        shell.style.overflow = "";
      } else {
        shell.style.height = "0px";
        shell.style.overflow = "hidden";
      }
      return;
    }

    killMotion(shell);

    const { interactiveDuration: expandMs, interactiveEase: collapseEase } = getMotionConfig();
    if (open) {
      shell.style.overflow = "hidden";
      gsap.fromTo(
        shell,
        { height: 0 },
        {
          height: () => inner.scrollHeight,
          duration: expandMs / 1000,
          ease: EXPAND_EASE,
          overwrite: "auto",
          onComplete: () => releaseExpandedShellHeight(shell, inner),
        },
      );
    } else {
      const current = shell.scrollHeight || shell.getBoundingClientRect().height;
      shell.style.height = `${current}px`;
      shell.style.overflow = "hidden";
      gsap.to(shell, {
        height: 0,
        duration: Math.round(expandMs * 0.85) / 1000,
        ease: collapseEase,
        overwrite: "auto",
        onComplete: () => {
          shell.style.height = "0px";
          shell.style.overflow = "hidden";
        },
      });
    }
  }, [open, shellRef, innerRef, skipContentAnimRef]);
}

function useChevronAnimation(
  chevronRef: React.RefObject<HTMLSpanElement | null>,
  open: boolean,
  skipContentAnimRef: React.RefObject<boolean>,
) {
  const isFirstRender = useRef(true);

  useLayoutEffect(() => {
    const el = chevronRef.current;
    if (!el) return;

    if (skipContentAnimRef.current) return;

    if (isFirstRender.current) {
      isFirstRender.current = false;
      if (open) el.style.transform = "rotate(180deg)";
      return;
    }

    const { interactiveDuration, interactiveEase } = getMotionConfig();
    killMotion(el);
    gsap.to(el, {
      rotation: open ? 180 : 0,
      duration: interactiveDuration / 1000,
      ease: interactiveEase,
      overwrite: "auto",
    });
  }, [open, chevronRef, skipContentAnimRef]);
}

// ─── Disclosure.Trigger ───────────────────────────────────────────────────────

export type DisclosureTriggerProps = HTMLAttributes<HTMLButtonElement> & {
  children?: ReactNode;
  icon?: ReactNode | null;
};

export const DisclosureTrigger = forwardRef<HTMLButtonElement, DisclosureTriggerProps>(
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
    const { open, setOpen, triggerId, panelId, variant, size, disabled, iconPos, skipContentAnimRef } =
      useDisclosureCtx();

    const { chevronRef } = useDisclosureCtx();
    const btnRef = useRef<HTMLButtonElement>(null);
    const titleLiftRef = useRef<HTMLSpanElement>(null);
    const hoverInsideRef = useRef(false);

    const setRefs = useCallback(
      (node: HTMLButtonElement | null) => {
        btnRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    useChevronAnimation(chevronRef, open, skipContentAnimRef);

    useEffect(() => {
      const el = titleLiftRef.current;
      return () => {
        if (el) killMotion(el);
      };
    }, []);

    useEffect(() => {
      if (!disabled) return;
      hoverInsideRef.current = false;
      const el = titleLiftRef.current;
      if (el) killMotion(el);
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
        const el = titleLiftRef.current;
        if (!el || shouldSkipInteractiveHoverLift()) return;
        animateInteractiveHoverLift(el, true);
      },
      [disabled, onPointerEnter],
    );

    const handlePointerLeave = useCallback(
      (e: PointerEvent<HTMLButtonElement>) => {
        onPointerLeave?.(e);
        hoverInsideRef.current = false;
        const el = titleLiftRef.current;
        if (!el || shouldSkipInteractiveHoverLift()) return;
        animateInteractiveHoverLift(el, false);
      },
      [onPointerLeave],
    );

    const handlePointerDown = useCallback(
      (e: PointerEvent<HTMLButtonElement>) => {
        onPointerDown?.(e);
        if (e.defaultPrevented || disabled) return;
        const el = titleLiftRef.current;
        if (!el || prefersReducedInteractiveHoverLift()) return;
        void animateInteractivePressSqueeze(el).then(() => {
          if (hoverInsideRef.current && titleLiftRef.current && !shouldSkipInteractiveHoverLift()) {
            animateInteractiveHoverLift(titleLiftRef.current, true);
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
            "inline-flex shrink-0 origin-center items-center justify-center text-muted transition-colors duration-fast",
            open && "text-primary",
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
          "flex w-full select-none items-center gap-small text-left outline-none",
          "focus-ring",
          TRIGGER_H[size],
          TRIGGER_PAD[size],
          VARIANT_TRIGGER[variant],
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
        <span
          ref={titleLiftRef}
          className="min-w-0 flex-1 origin-center will-change-transform"
        >
          <Text
            as="span"
            variant={TRIGGER_TEXT[size] as "small" | "base" | "mid"}
            className={cn(
              "block font-medium",
              open ? "text-primary" : "text-foreground",
            )}
          >
            {children}
          </Text>
        </span>
        {iconPos === "right" && chevronNode}
      </button>
    );
  },
);

DisclosureTrigger.displayName = "DisclosureTrigger";

// ─── Disclosure.Handle (card + dragHandle) ────────────────────────────────────

export type DisclosureHandleProps = HTMLAttributes<HTMLDivElement>;

export function DisclosureHandleInner({
  className = "",
  onPointerDown,
  ...rest
}: DisclosureHandleProps) {
  const {
    variant,
    disabled,
    dragHandle,
    shellRef,
    innerRef,
    chevronRef,
    open,
    setOpen,
    skipContentAnimRef,
  } = useDisclosureCtx();

  const { onPointerDown: dragPD } = useDisclosureContentDrag(
    shellRef,
    innerRef,
    chevronRef,
    open,
    setOpen,
    disabled,
    skipContentAnimRef,
  );

  if (!dragHandle || variant !== "card") return null;

  return (
    <div
      aria-hidden
      className={cn(
        "flex touch-none select-none shrink-0 cursor-grab items-center justify-center border-t-token py-xsmall active:cursor-grabbing",
        disabled && "pointer-events-none opacity-48",
        className,
      )}
      onPointerDown={(e) => {
        onPointerDown?.(e);
        dragPD(e);
      }}
      {...rest}
    >
      <span className="h-1 w-10 rounded-full bg-tertiary" />
    </div>
  );
}

DisclosureHandleInner.displayName = "DisclosureHandle";

// ─── Disclosure.Content ───────────────────────────────────────────────────────

export type DisclosureContentProps = HTMLAttributes<HTMLDivElement> & {
  children?: ReactNode;
};

export const DisclosureContent = forwardRef<HTMLDivElement, DisclosureContentProps>(
  function DisclosureContent({ children, className = "", ...rest }, ref) {
    const { open, panelId, triggerId, size, variant, shellRef, innerRef, skipContentAnimRef } =
      useDisclosureCtx();

    useContentAnimation(shellRef, innerRef, open, skipContentAnimRef);

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
      framed && variant === "outline" && FRAMED_PANEL.default,
      framed && variant === "outline" && FRAMED_PANEL.outline,
      framed && variant === "secondary" && FRAMED_PANEL.secondary,
      framed && "mt-xsmall",
      variant === "card" && "border-t-token",
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
        <section
          ref={innerRef}
          id={panelId}
          aria-labelledby={triggerId}
          className={innerCls}
          {...rest}
        >
          {children}
        </section>
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
  /** Полоска-хэндл для drag-раскрытия; работает только с `variant="card"`. */
  dragHandle?: boolean;
};

export const DisclosureRoot = forwardRef<HTMLDivElement, DisclosureProps>(function Disclosure(
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
      dragHandle = false,
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
    const shellRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLElement>(null);
    const chevronRef = useRef<HTMLSpanElement>(null);
    const skipContentAnimRef = useRef(false);

    const variant = variantProp ?? groupCtx?.variant ?? "default";
    const size = sizeProp ?? groupCtx?.size ?? "base";

    const groupedCardShell =
      groupCtx != null && !groupCtx.separated && groupCtx.variant === "card";

    const rootCls =
      variant === "card" && groupedCardShell
        ? ""
        : VARIANT_ROOT[variant];

    const ctx: DisclosureCtx = useMemo(
      () => ({
        open,
        setOpen,
        triggerId,
        panelId,
        variant,
        size,
        disabled,
        iconPos,
        dragHandle,
        shellRef,
        innerRef,
        chevronRef,
        skipContentAnimRef,
      }),
      [disabled, dragHandle, iconPos, open, panelId, setOpen, size, triggerId, variant],
    );

    const orderedChildren =
      dragHandle && variant === "card" ? orderDragHandleChildren(children) : children;

    return (
      <DisclosureCtx.Provider value={ctx}>
        <div ref={ref} className={cn(rootCls, className)} {...rest}>
          {orderedChildren}
        </div>
      </DisclosureCtx.Provider>
    );
  },
);

DisclosureRoot.displayName = "Disclosure";

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
      !separated && variant === "default" && "divide-y-token border-t-token border-b-token",
      !separated && variant === "card" &&
        "overflow-hidden rounded-mid border-token bg-surface shadow-token-sm divide-y-token",
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

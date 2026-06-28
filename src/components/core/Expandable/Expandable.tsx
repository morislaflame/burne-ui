import {
  Children,
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useCallback,
  useContext,
  useId,
  useLayoutEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type ReactElement,
  type ReactNode,
  type Ref,
} from "react";

import {
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import { Ripple } from "@/components/core/Ripple";
import { Text } from "@/components/core/Text";
import type { ComponentSize } from "@/components/core/utils/componentSize";
import { CONTROL_SIZE_LAYOUT } from "@/components/core/utils/controlSizeLayout";
import { getMotionConfig } from "@/components/core/utils/motionConfig";
import { useChevronRotation } from "@/components/core/utils/useChevronRotation";
import {
  useCollapsibleHeight,
  useCollapsibleShellRef,
} from "@/components/core/utils/useCollapsibleHeight";
import { useMergedGlossPanelRef } from "@/components/core/utils/glossInteractiveMotion";
import "../utils/glossInteractive.css";
import { cn } from "@/utils/cn";

export type ExpandableSize = ComponentSize;

export type ExpandableVariant = "default" | "gloss";

export type ExpandableRootProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  children?: ReactNode;
  variant?: ExpandableVariant;
  compound?: boolean;
  title?: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  size?: ExpandableSize;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
};

export type ExpandableTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  hideChevron?: boolean;
  asChild?: boolean;
};

export type ExpandableIconProps = HTMLAttributes<HTMLSpanElement>;
export type ExpandableMessageProps = HTMLAttributes<HTMLDivElement>;
export type ExpandableContentProps = HTMLAttributes<HTMLDivElement>;
export type ExpandableTitleProps = HTMLAttributes<HTMLDivElement>;
export type ExpandableDescriptionProps = HTMLAttributes<HTMLDivElement>;
export type ExpandableChevronProps = HTMLAttributes<HTMLSpanElement>;
export type ExpandablePanelProps = HTMLAttributes<HTMLDivElement>;

type ExpandableContextValue = {
  open: boolean;
  disabled: boolean;
  hasPanel: boolean;
  size: ExpandableSize;
  variant: ExpandableVariant;
  toggle: () => void;
  headerId: string;
  panelId: string;
  setHasPanel: (v: boolean) => void;
};

const EXPANDABLE_PANEL_PAD: Record<ExpandableSize, string> = {
  small: "px-base pb-base pt-small",
  base: "px-plus pb-plus pt-base",
  mid: "px-mid pb-mid pt-base",
  large: "px-large pb-large pt-base",
};

const EXPANDABLE_DESCRIPTION_VARIANT = {
  small: "small",
  base: "small",
  mid: "base",
  large: "base",
} as const satisfies Record<ExpandableSize, "small" | "base">;

function controlMinHeightClass(size: ExpandableSize): string {
  return CONTROL_SIZE_LAYOUT[size].h.replace(/^h-/, "min-h-");
}

const ExpandableContext = createContext<ExpandableContextValue | null>(null);

function useExpandable() {
  const ctx = useContext(ExpandableContext);
  if (!ctx) throw new Error("Компоненты Expandable должны быть внутри <Expandable>.");
  return ctx;
}

export { useExpandable as useExpandableContext };

function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (node: T | null) => {
    for (const ref of refs) {
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    }
  };
}

function partitionTriggerRipple(children: ReactNode): {
  rippleOverlay: ReactNode;
  rest: ReactNode;
} {
  const ripples: ReactNode[] = [];
  const rest: ReactNode[] = [];
  Children.forEach(children, (child) => {
    if (isValidElement(child) && child.type === Ripple) {
      ripples.push(child);
    } else {
      rest.push(child);
    }
  });
  const rippleOverlay =
    ripples.length > 0 ? (
      <span
        className="pointer-events-none absolute inset-0 z-0 overflow-hidden rounded-[inherit]"
        aria-hidden
      >
        {ripples}
      </span>
    ) : null;
  return { rippleOverlay, rest: <>{rest}</> };
}

export const ExpandableMessage = forwardRef<HTMLDivElement, ExpandableMessageProps>(
  function ExpandableMessage({ className = "", ...rest }, ref) {
    return (
      <div
        ref={ref}
        className={cn("flex min-w-0 flex-1 items-start gap-base", className)}
        {...rest}
      />
    );
  },
);

ExpandableMessage.displayName = "ExpandableMessage";

const EXPANDABLE_MESSAGE_DISPLAY_NAMES = new Set([
  "ExpandableMessage",
  "Accordion.Message",
]);

function hasExpandableMessage(children: ReactNode): boolean {
  let found = false;

  Children.forEach(children, (child) => {
    if (found || !isValidElement(child)) return;
    const type = child.type as { displayName?: string };
    if (
      child.type === ExpandableMessage ||
      (type.displayName != null && EXPANDABLE_MESSAGE_DISPLAY_NAMES.has(type.displayName))
    ) {
      found = true;
    }
  });

  return found;
}

function ChevronSvg({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`shrink-0 ${className}`}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

export const ExpandableTrigger = forwardRef<HTMLButtonElement, ExpandableTriggerProps>(
  function ExpandableTrigger(
    {
      hideChevron = false,
      asChild,
      className = "",
      onClick,
      onKeyDown,
      onPointerDown: onPointerDownProp,
      children,
      type = "button",
      ...props
    },
    ref,
  ) {
    const {
      open,
      disabled,
      hasPanel,
      size,
      toggle,
      headerId,
      panelId,
    } = useExpandable();

    const handleClick = useCallback(
      (e: MouseEvent<HTMLButtonElement>) => {
        onClick?.(e);
        if (e.defaultPrevented || disabled) return;
        toggle();
      },
      [disabled, onClick, toggle],
    );

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLButtonElement>) => {
        onKeyDown?.(e);
        if (e.defaultPrevented || disabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      },
      [disabled, onKeyDown, toggle],
    );

    const layout = CONTROL_SIZE_LAYOUT[size];

    const liftSpanRef = useRef<HTMLSpanElement | null>(null);
    const chevronRef = useRef<HTMLSpanElement | null>(null);
    const bindChevronRef = useChevronRotation(
      open,
      chevronRef,
      () => getMotionConfig().enableExpandable,
    );
    const { rippleOverlay, rest: triggerChildren } =
      partitionTriggerRipple(children);
    const mainChildren = hasExpandableMessage(triggerChildren) ? (
      triggerChildren
    ) : (
      <ExpandableMessage>{triggerChildren}</ExpandableMessage>
    );

    const setTriggerRef = useCallback(
      (node: HTMLButtonElement | null) => {
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    const handlePointerDown = useCallback(
      (e: PointerEvent<HTMLButtonElement>) => {
        if (!disabled) {
          const span = liftSpanRef.current;
          if (span && !prefersReducedInteractiveHoverLift()) {
            void animateInteractivePressSqueeze(span);
          }
        }
        onPointerDownProp?.(e);
      },
      [disabled, onPointerDownProp],
    );

    if (asChild && isValidElement(children)) {
      const child = children as ReactElement<
        HTMLAttributes<HTMLElement> & { ref?: Ref<HTMLElement>; disabled?: boolean }
      >;

      return cloneElement(child, {
        ...props,
        id: headerId,
        ref: mergeRefs(ref, child.props.ref),
        className: cn(child.props.className, className),
        disabled: disabled || child.props.disabled,
        "aria-expanded": hasPanel ? open : undefined,
        "aria-controls": hasPanel ? panelId : undefined,
        onClick: (e: MouseEvent<HTMLElement>) => {
          child.props.onClick?.(e);
          handleClick(e as MouseEvent<HTMLButtonElement>);
        },
        onKeyDown: (e: KeyboardEvent<HTMLElement>) => {
          child.props.onKeyDown?.(e);
          handleKeyDown(e as KeyboardEvent<HTMLButtonElement>);
        },
      });
    }

    return (
      <button
        ref={setTriggerRef}
        type={type}
        id={headerId}
        className={cn(
          "relative flex w-full items-center gap-base overflow-hidden py-base text-left outline-none",
          controlMinHeightClass(size),
          layout.padX,
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          className,
        )}
        aria-expanded={hasPanel ? open : undefined}
        aria-controls={hasPanel ? panelId : undefined}
        disabled={disabled}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {rippleOverlay}
        <span
          ref={liftSpanRef}
          className={cn(
            "relative z-[1] flex min-w-0 flex-1 origin-center will-change-transform",
            hideChevron && "w-full",
          )}
        >
          {mainChildren}
        </span>
        {!hideChevron && hasPanel ? (
          <span
            ref={bindChevronRef}
            className="relative z-[1] ml-auto flex shrink-0 origin-center"
            aria-hidden
          >
            <ChevronSvg className={layout.chevronIcon} />
          </span>
        ) : null}
      </button>
    );
  },
);

ExpandableTrigger.displayName = "ExpandableTrigger";

export function ExpandableIcon({ className = "", ...props }: ExpandableIconProps) {
  const { size } = useExpandable();
  return (
    <span
      aria-hidden
      className={cn(
        "shrink-0 text-primary [&_svg]:size-full",
        CONTROL_SIZE_LAYOUT[size].icon,
        className,
      )}
      {...props}
    />
  );
}

ExpandableIcon.displayName = "ExpandableIcon";

export function ExpandableContent({ className = "", ...props }: ExpandableContentProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 max-w-full flex-col gap-xsmall text-left",
        className,
      )}
      {...props}
    />
  );
}

ExpandableContent.displayName = "ExpandableContent";

export function ExpandableTitle({ className = "", ...props }: ExpandableTitleProps) {
  const { size } = useExpandable();
  return (
    <Text
      as="div"
      variant={CONTROL_SIZE_LAYOUT[size].controlText}
      className={cn("", className)}
      {...props}
    />
  );
}

ExpandableTitle.displayName = "ExpandableTitle";

export function ExpandableDescription({
  className = "",
  ...props
}: ExpandableDescriptionProps) {
  const { size } = useExpandable();
  return (
    <Text
      as="div"
      variant={EXPANDABLE_DESCRIPTION_VARIANT[size]}
      className={cn("text-muted", className)}
      {...props}
    />
  );
}

ExpandableDescription.displayName = "ExpandableDescription";

export function ExpandableChevron({ className = "", ...props }: ExpandableChevronProps) {
  const { open, hasPanel, size } = useExpandable();
  const chevronRef = useRef<HTMLSpanElement | null>(null);
  const bindChevronRef = useChevronRotation(
    open,
    chevronRef,
    () => getMotionConfig().enableExpandable,
  );

  if (!hasPanel) return null;
  return (
    <span
      ref={bindChevronRef}
      className={cn("relative z-[1] flex shrink-0 self-center origin-center", className)}
      aria-hidden
      {...props}
    >
      <ChevronSvg className={CONTROL_SIZE_LAYOUT[size].chevronIcon} />
    </span>
  );
}

ExpandableChevron.displayName = "ExpandableChevron";

export const ExpandablePanel = forwardRef<HTMLDivElement, ExpandablePanelProps>(
  function ExpandablePanel({ className = "", children, ...props }, ref) {
    const {
      open,
      headerId,
      panelId,
      size,
      setHasPanel,
    } = useExpandable();

    const shellRef = useRef<HTMLDivElement | null>(null);
    const innerRef = useRef<HTMLDivElement | null>(null);
    const bindShellRef = useCollapsibleShellRef(shellRef, open);

    useLayoutEffect(() => {
      setHasPanel(true);
      return () => setHasPanel(false);
    }, [setHasPanel]);

    useCollapsibleHeight(open, shellRef, innerRef);

    const setSectionRef = useCallback(
      (node: HTMLDivElement | null) => {
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [ref],
    );

    return (
      <div ref={bindShellRef} className="overflow-hidden">
        <div ref={innerRef}>
          <section
            ref={setSectionRef}
            id={panelId}
            aria-labelledby={headerId}
            aria-hidden={!open}
            inert={!open}
            className={cn(EXPANDABLE_PANEL_PAD[size], "text-left", className)}
            {...props}
          >
            {children}
          </section>
        </div>
      </div>
    );
  },
);

ExpandablePanel.displayName = "ExpandablePanel";

const COMPOUND_SLOT_DISPLAY_NAMES = new Set([
  "ExpandableTrigger",
  "ExpandablePanel",
  "ExpandableMessage",
  "Accordion.Trigger",
  "Accordion.Panel",
  "Accordion.Message",
  "Accordion.Heading",
]);

function hasExpandableCompoundChildren(children: ReactNode): boolean {
  let found = false;

  const walk = (node: ReactNode) => {
    if (found) return;
    for (const child of Children.toArray(node)) {
      if (!isValidElement(child)) continue;
      const type = child.type as { displayName?: string };
      if (
        child.type === ExpandableTrigger ||
        child.type === ExpandablePanel ||
        child.type === ExpandableMessage ||
        (type.displayName != null && COMPOUND_SLOT_DISPLAY_NAMES.has(type.displayName))
      ) {
        found = true;
        return;
      }
      walk((child.props as { children?: ReactNode }).children);
    }
  };

  walk(children);
  return found;
}

export type ExpandableProps = ExpandableRootProps;

export const ExpandableRoot = forwardRef<HTMLDivElement, ExpandableRootProps>(
  function ExpandableRoot(
    {
      children,
      compound: compoundProp,
      title,
      description,
      icon,
      variant = "default",
      size = "base",
      defaultOpen = false,
      open: openProp,
      onOpenChange,
      disabled = false,
      className = "",
      ...rest
    },
    ref,
  ) {
    const panelId = useId();
    const headerId = useId();
    const isGloss = variant === "gloss";
    const controlled = openProp !== undefined;
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const [hasPanel, setHasPanelState] = useState(false);

    const setHasPanel = useCallback((v: boolean) => {
      setHasPanelState(v);
    }, []);

    const open = controlled ? openProp! : internalOpen;

    const toggle = useCallback(() => {
      if (disabled || !hasPanel) return;
      const next = !open;
      if (!controlled) setInternalOpen(next);
      onOpenChange?.(next);
    }, [controlled, disabled, hasPanel, open, onOpenChange]);

    const ctxValue: ExpandableContextValue = {
      open,
      disabled,
      hasPanel,
      size,
      variant,
      toggle,
      headerId,
      panelId,
      setHasPanel,
    };

    const isCompound =
      compoundProp === true || hasExpandableCompoundChildren(children);

    const setRootRef = useMergedGlossPanelRef(ref, isGloss);

    const simpleBody = (
      <>
        <ExpandableTrigger>
          <ExpandableMessage>
            {icon != null ? <ExpandableIcon>{icon}</ExpandableIcon> : null}
            <ExpandableContent>
              {title != null ? <ExpandableTitle>{title}</ExpandableTitle> : null}
              {description != null ? (
                <ExpandableDescription>{description}</ExpandableDescription>
              ) : null}
            </ExpandableContent>
          </ExpandableMessage>
        </ExpandableTrigger>
        {children != null ? <ExpandablePanel>{children}</ExpandablePanel> : null}
      </>
    );

    return (
      <ExpandableContext.Provider value={ctxValue}>
        <div
          ref={setRootRef}
          className={cn(
            "rounded-mid text-left text-foreground",
            isGloss
              ? "gloss-panel gloss-deep border-0"
              : "border-token bg-surface shadow-token-sm",
            className,
          )}
          {...rest}
        >
          {isGloss ? (
            <div className="gloss-content flex min-w-0 flex-col">
              {isCompound ? children : simpleBody}
            </div>
          ) : isCompound ? (
            children
          ) : (
            simpleBody
          )}
        </div>
      </ExpandableContext.Provider>
    );
  },
);

ExpandableRoot.displayName = "ExpandableRoot";


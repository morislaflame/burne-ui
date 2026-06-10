import {
  Children,
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
  type PointerEvent,
  type ReactNode,
} from "react";

import {
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import { Ripple } from "@/components/core/Ripple";
import { Text } from "@/components/core/Text";
import { cn } from "@/utils/cn";

export type ExpandableRootProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  children?: ReactNode;
  /**
   * Составная разметка (`Trigger` / `Panel` и слоты).
   * `Accordion.Item` включает автоматически.
   */
  compound?: boolean;
  /** Simple API: заголовок триггера. В compound игнорируется. */
  title?: ReactNode;
  /** Simple API: подзаголовок под заголовком. В compound — `<Expandable.Description>`. */
  description?: ReactNode;
  /** Simple API: иконка слева от текста. В compound — `<Expandable.Icon>`. */
  icon?: ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
};

export type ExpandableTriggerProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  /** Если `true`, автоматический шеврон справа не показывается — используйте `<Expandable.Chevron />` внутри. */
  hideChevron?: boolean;
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
  toggle: () => void;
  headerId: string;
  panelId: string;
  setHasPanel: (v: boolean) => void;
};

const ExpandableContext = createContext<ExpandableContextValue | null>(null);

function useExpandable() {
  const ctx = useContext(ExpandableContext);
  if (!ctx) throw new Error("Компоненты Expandable должны быть внутри <Expandable>.");
  return ctx;
}

export { useExpandable as useExpandableContext };

/** Выносит `<Ripple />` на полный `<button>`, а не в узкий flex-ряд с текстом. */
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
      className = "",
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
      toggle,
      headerId,
      panelId,
    } = useExpandable();

    const liftSpanRef = useRef<HTMLSpanElement | null>(null);
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

    return (
      <button
        ref={setTriggerRef}
        type={type}
        id={headerId}
        className={cn(
          "relative flex w-full items-center gap-base overflow-hidden py-plus px-mid text-left outline-none",
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2",
          disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          className,
        )}
        aria-expanded={hasPanel ? open : undefined}
        aria-controls={hasPanel ? panelId : undefined}
        disabled={disabled}
        onPointerDown={handlePointerDown}
        onClick={toggle}
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
            className={cn(
              "relative z-[1] ml-auto flex shrink-0 transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
              open ? "rotate-180" : "rotate-0",
            )}
          >
            <ChevronSvg />
          </span>
        ) : null}
      </button>
    );
  },
);

ExpandableTrigger.displayName = "ExpandableTrigger";

export function ExpandableIcon({ className = "", ...props }: ExpandableIconProps) {
  return (
    <span
      aria-hidden
      className={cn("shrink-0 text-primary [&_svg]:icon-mid", className)}
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
  return (
    <Text
      as="div"
      variant="base"
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
  return (
    <Text
      as="div"
      variant="small"
      className={cn("text-muted", className)}
      {...props}
    />
  );
}

ExpandableDescription.displayName = "ExpandableDescription";

export function ExpandableChevron({ className = "", ...props }: ExpandableChevronProps) {
  const { open, hasPanel } = useExpandable();
  if (!hasPanel) return null;
  return (
    <span
      className={cn(
        "relative z-[1] flex shrink-0 self-center transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
        open ? "rotate-180" : "rotate-0",
        className,
      )}
      aria-hidden
      {...props}
    >
      <ChevronSvg />
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
      setHasPanel,
    } = useExpandable();

    useLayoutEffect(() => {
      setHasPanel(true);
      return () => setHasPanel(false);
    }, [setHasPanel]);

    return (
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <section
            ref={ref}
            id={panelId}
            aria-labelledby={headerId}
            aria-hidden={!open}
            inert={!open}
            className={cn("px-mid pb-plus text-left", className)}
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
      toggle,
      headerId,
      panelId,
      setHasPanel,
    };

    const isCompound =
      compoundProp === true || hasExpandableCompoundChildren(children);

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
          ref={ref}
          className={cn(
            "rounded-mid border-token bg-surface text-left text-foreground",
            className,
          )}
          {...rest}
        >
          {isCompound ? children : simpleBody}
        </div>
      </ExpandableContext.Provider>
    );
  },
);

ExpandableRoot.displayName = "ExpandableRoot";

/** Раскрывающийся блок. **Simple** — `title`, `description`, `icon` на root, контент в `children`. **Compound** — `Trigger`, `Panel`, опционально `Message`, `Icon`, `Content`, `Title`, `Description`, `Chevron`. */

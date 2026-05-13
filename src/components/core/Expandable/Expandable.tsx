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
export type ExpandableContentProps = HTMLAttributes<HTMLDivElement>;
export type ExpandableTitleProps = HTMLAttributes<HTMLSpanElement>;
export type ExpandableDescriptionProps = HTMLAttributes<HTMLSpanElement>;
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

const ExpandableTrigger = forwardRef<HTMLButtonElement, ExpandableTriggerProps>(
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
    const { rippleOverlay, rest: mainChildren } =
      partitionTriggerRipple(children);

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
          "focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
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
            "relative z-[1] flex w-fit max-w-full min-w-0 origin-center will-change-transform",
            "items-start gap-base",
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

function ExpandableIcon({ className = "", ...props }: ExpandableIconProps) {
  return (
    <span
      className={cn(
        "flex shrink-0 items-center self-start text-accent [&_svg]:icon-base mt-[0.0575rem]",
        className,
      )}
      {...props}
    />
  );
}

function ExpandableContent({ className = "", ...props }: ExpandableContentProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 max-w-full flex-col gap-xsmall",
        className,
      )}
      {...props}
    />
  );
}

function ExpandableTitle({ className = "", ...props }: ExpandableTitleProps) {
  return (
    <Text
      as="span"
      variant="base"
      className={cn("block font-medium leading-snug", className)}
      {...props}
    />
  );
}

function ExpandableDescription({
  className = "",
  ...props
}: ExpandableDescriptionProps) {
  return (
    <Text
      as="span"
      variant="base"
      className={cn("block leading-normal text-muted", className)}
      {...props}
    />
  );
}

function ExpandableChevron({ className = "", ...props }: ExpandableChevronProps) {
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

const ExpandablePanel = forwardRef<HTMLDivElement, ExpandablePanelProps>(
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
          <div
            ref={ref}
            id={panelId}
            role="region"
            aria-labelledby={headerId}
            aria-hidden={!open}
            inert={!open}
            className={cn("px-mid pb-plus leading-normal", className)}
            {...props}
          >
            {children}
          </div>
        </div>
      </div>
    );
  },
);

export type ExpandableProps = ExpandableRootProps;

const ExpandableRoot = forwardRef<HTMLDivElement, ExpandableRootProps>(
  function ExpandableRoot(
    {
      children,
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

    return (
      <ExpandableContext.Provider value={ctxValue}>
        <div
          ref={ref}
          className={cn(
            "rounded-mid border border-base bg-surface text-foreground",
            className,
          )}
          {...rest}
        >
          {children}
        </div>
      </ExpandableContext.Provider>
    );
  },
);

/** Раскрывающийся блок: составной API — `Expandable` (корень), `Trigger`, `Panel`, опционально `Icon`, `Content`, `Title`, `Description`, `Chevron`. Лёгкое сжатие строки тригера при нажатии (anime.js). */
export const Expandable = Object.assign(ExpandableRoot, {
  Trigger: ExpandableTrigger,
  Icon: ExpandableIcon,
  Content: ExpandableContent,
  Title: ExpandableTitle,
  Description: ExpandableDescription,
  Chevron: ExpandableChevron,
  Panel: ExpandablePanel,
});

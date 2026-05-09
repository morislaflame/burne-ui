import {
  forwardRef,
  useCallback,
  useId,
  useRef,
  useState,
  type HTMLAttributes,
  type PointerEvent,
  type ReactNode,
} from "react";
import {
  ConvergeRippleLayer,
  createConvergeRippleFromPointer,
  type ConvergeRipple,
} from "../utils/pressRipple";

export type ExpandableProps = Omit<HTMLAttributes<HTMLDivElement>, "title"> & {
  /** Заголовок строки триггера. */
  title: ReactNode;
  /** Подзаголовок под заголовком (опционально). */
  description?: ReactNode;
  /** Иконка слева от заголовка и описания. */
  icon?: ReactNode;
  /** Контент раскрывающейся области. */
  children?: ReactNode;
  /** Начальное состояние (неконтролируемый режим). */
  defaultOpen?: boolean;
  /** Управляемое открытое состояние. */
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  disabled?: boolean;
  /** Опциональные hover-анимации в шапке (title scale, description translateY). */
  hoverAnimated?: boolean;
  /** Опциональный converge-ripple при нажатии на шапку. */
  pressRipple?: boolean;
};

function ChevronDown({ className = "" }: { className?: string }) {
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

export const Expandable = forwardRef<HTMLDivElement, ExpandableProps>(
  function Expandable(
    {
      title,
      description,
      icon,
      children,
      defaultOpen = false,
      open: openProp,
      onOpenChange,
      disabled = false,
      hoverAnimated = true,
      pressRipple = false,
      className = "",
      ...rest
    },
    ref,
  ) {
    const panelId = useId();
    const headerId = useId();
    const rippleId = useRef(0);
    const controlled = openProp !== undefined;
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const [ripples, setRipples] = useState<ConvergeRipple[]>([]);
    const open = controlled ? openProp : internalOpen;

    const toggle = useCallback(() => {
      if (disabled) return;
      const next = !open;
      if (!controlled) setInternalOpen(next);
      onOpenChange?.(next);
    }, [controlled, disabled, open, onOpenChange]);

    const hasPanel = children != null;
    const dismissConverge = useCallback((id: number) => {
      setRipples((prev) => prev.filter((rp) => rp.id !== id));
    }, []);

    const pushConvergeRipple = useCallback(
      (e: PointerEvent<HTMLButtonElement>) => {
        if (disabled) return;
        const id = ++rippleId.current;
        const ripple = createConvergeRippleFromPointer(e, id);
        setRipples((prev) => [...prev, ripple]);
      },
      [disabled],
    );

    return (
      <div
        ref={ref}
        className={[
          "rounded-b-md border border-b-border bg-b-surface text-b-text shadow-sm",
          className,
        ].join(" ")}
        {...rest}
      >
        <button
          type="button"
          id={headerId}
          className={[
            "group relative flex w-full items-start gap-3 overflow-hidden px-4 py-3 text-left outline-none",
            "focus-visible:outline focus-visible:outline-2 focus-visible:outline-b-accent focus-visible:outline-offset-2",
            disabled ? "cursor-not-allowed opacity-50" : "cursor-pointer",
          ].join(" ")}
          aria-expanded={hasPanel ? open : undefined}
          aria-controls={hasPanel ? panelId : undefined}
          disabled={disabled}
          onPointerDown={pressRipple ? pushConvergeRipple : undefined}
          onClick={toggle}
        >
          {pressRipple ? (
            <span
              className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
              aria-hidden
            >
              <ConvergeRippleLayer
                ripples={ripples}
                tone="color-mix(in oklab, var(--b-color-accent) 28%, transparent)"
                onDone={dismissConverge}
                durationMs={640}
                opacityFrom={0.34}
              />
            </span>
          ) : null}
          {icon ? (
            <span className="relative z-[1] flex shrink-0 items-center self-start pt-0.5 text-b-accent [&_svg]:size-5">
              {icon}
            </span>
          ) : null}
          <span className="relative z-[1] min-w-0 flex-1">
            <span
              className={[
                "block font-medium leading-snug",
                hoverAnimated
                  ? "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none group-hover:scale-[1.015] group-hover:translate-x-[2px]"
                  : "",
              ].join(" ")}
            >
              {title}
            </span>
            {description ? (
              <span
                className={[
                  "mt-1 block text-sm leading-normal text-b-muted",
                  hoverAnimated
                  ? "transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none group-hover:scale-[1.015] group-hover:translate-x-[2px]"
                  : "",
                ].join(" ")}
              >
                {description}
              </span>
            ) : null}
          </span>
          {hasPanel ? (
            <span
              className={[
                "relative z-[1] flex shrink-0 self-center transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
                open ? "rotate-180" : "rotate-0",
              ].join(" ")}
            >
              <ChevronDown />
            </span>
          ) : null}
        </button>

        {hasPanel ? (
          <div
            className={[
              "grid transition-[grid-template-rows] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none",
              open ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
            ].join(" ")}
          >
            <div className="min-h-0 overflow-hidden">
              <div
                id={panelId}
                role="region"
                aria-labelledby={headerId}
                aria-hidden={!open}
                inert={!open}
                className="px-4 pb-4"
              >
                {children}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    );
  },
);

import { remove } from "animejs";
import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type MouseEvent,
  type PointerEvent,
  type Ref,
} from "react";

import { Text } from "@/components/core/Text";
import {
  animateInteractiveHoverLift,
  animateInteractivePressSqueeze,
  prefersReducedInteractiveHoverLift,
  SHADOW_SM,
  useInteractiveHoverLiftContainerHandlers,
} from "@/components/core/utils/hoverInteractiveLift";
import { cn } from "@/utils/cn";

export type CardVariant = "default" | "outline" | "secondary";

/** Событие активации нажимаемой карточки (`pressable`): клик или клавиши Enter / Space. */
export type CardPressEvent =
  | MouseEvent<HTMLElement>
  | KeyboardEvent<HTMLElement>;

export type CardProps = Omit<
  HTMLAttributes<HTMLElement>,
  "onClick" | "onKeyDown"
> & {
  /** Поверхность и обводка. По умолчанию `default`. */
  variant?: CardVariant;
  /**
   * Интерактивная карточка: hover-lift, тень и squeeze при нажатии (как у кнопки).
   * Риппл не встроен — при необходимости передайте `<Ripple />` первым ребёнком и оберните остальной контент в слой с `relative z-[1]`.
   * Не помещайте внутрь другие кнопки/ссылки без `stopPropagation` на их клик — иначе сработает и `onPress` карточки.
   */
  pressable?: boolean;
  /** Вызывается при активации (`click` или Enter / Space на корне). Имеет смысл только при `pressable`. */
  onPress?: (event: CardPressEvent) => void;
  onClick?: HTMLAttributes<HTMLElement>["onClick"];
  onKeyDown?: HTMLAttributes<HTMLElement>["onKeyDown"];
};

const CARD_SURFACE: Record<CardVariant, string> = {
  default: "bg-surface border-token",
  outline: "bg-transparent border-token",
  secondary: "bg-secondary border-token",
};

export type CardContentProps = HTMLAttributes<HTMLDivElement>;
export type CardTitleProps = HTMLAttributes<HTMLHeadingElement>;
export type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement>;
export type CardBodyProps = HTMLAttributes<HTMLDivElement>;
export type CardFooterProps = HTMLAttributes<HTMLDivElement>;

export function CardContent({ className = "", ...rest }: CardContentProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-small py-plus px-mid",
        className,
      )}
      {...rest}
    />
  );
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  function CardTitle({ className = "", ...rest }, ref) {
    return (
      <Text
        ref={ref as Ref<HTMLElement>}
        as="h3"
        variant="base"
        className={cn("min-w-0", className)}
        {...rest}
      />
    );
  },
);

export const CardDescription = forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(function CardDescription({ className = "", ...rest }, ref) {
  return (
    <Text
      ref={ref as Ref<HTMLElement>}
      as="p"
      variant="base"
      className={cn("min-w-0 text-muted", className)}
      {...rest}
    />
  );
});

export function CardBody({ className = "", children, ...rest }: CardBodyProps) {
  return (
    <div
      className={cn("min-w-0 px-mid pb-mid", className)}
      {...rest}
    >
      <Text variant="base" as="div">
        {children}
      </Text>
    </div>
  );
}

/** Нижняя зона действий / мета с разделителем. */
export function CardFooter({ className = "", ...rest }: CardFooterProps) {
  return (
    <div
      className={cn(
        "mt-auto border-t-token py-plus px-mid text-muted",
        className,
      )}
      {...rest}
    />
  );
}

const CARD_PRESS_SHADOW = { hover: SHADOW_SM() };

export const CardRoot = forwardRef<HTMLElement, CardProps>(function Card(
  {
    className = "",
    variant = "default",
    pressable = false,
    onPress,
    onPointerOver: onPointerOverProp,
    onPointerOut: onPointerOutProp,
    onPointerDown: onPointerDownProp,
    onClick: onClickProp,
    onKeyDown: onKeyDownProp,
    children,
    ...rest
  },
  ref,
) {
  const rootRef = useRef<HTMLElement | null>(null);
  const pointerInsideRef = useRef(false);

  const setRootRef = useCallback(
    (node: HTMLElement | null) => {
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const liftPointerHandlers = useInteractiveHoverLiftContainerHandlers(
    rootRef,
    pressable,
    pointerInsideRef,
    undefined,
    pressable ? CARD_PRESS_SHADOW : undefined,
  );

  useEffect(() => {
    if (pressable) return;
    const el = rootRef.current;
    if (el) remove(el);
    pointerInsideRef.current = false;
  }, [pressable]);

  const handlePointerDown = useCallback(
    (e: PointerEvent<HTMLElement>) => {
      onPointerDownProp?.(e);
      if (
        !pressable ||
        e.defaultPrevented ||
        prefersReducedInteractiveHoverLift()
      ) {
        return;
      }
      const shell = rootRef.current;
      if (!shell) return;
      void animateInteractivePressSqueeze(shell).then(() => {
        const el = rootRef.current;
        if (!el || prefersReducedInteractiveHoverLift()) return;
        if (pointerInsideRef.current) {
          animateInteractiveHoverLift(el, true, undefined, CARD_PRESS_SHADOW);
        }
      });
    },
    [onPointerDownProp, pressable],
  );

  const handleClick = useCallback(
    (e: MouseEvent<HTMLElement>) => {
      onClickProp?.(e);
      if (!pressable || e.defaultPrevented) return;
      onPress?.(e);
    },
    [onClickProp, onPress, pressable],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLElement>) => {
      onKeyDownProp?.(e);
    },
    [onKeyDownProp],
  );

  const rootClassName = cn(
    "flex min-w-0 flex-col overflow-hidden rounded-mid text-foreground outline-none",
    pressable &&
      "relative cursor-pointer animate-shadow button-idle-surface-transition motion-reduce:transition-none focus-ring",
    CARD_SURFACE[variant],
    pressable && "will-change-transform origin-center",
    className,
  );

  if (pressable) {
    return (
      <button
        type="button"
        {...rest}
        ref={setRootRef}
        className={cn(rootClassName, "w-full border-0 p-0 text-left")}
        onPointerOver={(e) => {
          onPointerOverProp?.(e);
          if (!e.defaultPrevented) {
            liftPointerHandlers.onPointerOver(e);
          }
        }}
        onPointerOut={(e) => {
          onPointerOutProp?.(e);
          liftPointerHandlers.onPointerOut(e);
        }}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        <div className="relative flex min-w-0 flex-1 flex-col">{children}</div>
      </button>
    );
  }

  if (onClickProp || onKeyDownProp || onPointerDownProp) {
    return (
      <button
        type="button"
        {...rest}
        ref={setRootRef}
        className={cn(rootClassName, "w-full border-0 p-0 text-left")}
        onPointerOver={onPointerOverProp}
        onPointerOut={onPointerOutProp}
        onPointerDown={onPointerDownProp}
        onClick={onClickProp}
        onKeyDown={onKeyDownProp}
      >
        {children}
      </button>
    );
  }

  return (
    <div
      {...rest}
      ref={setRootRef}
      className={rootClassName}
      onPointerOver={onPointerOverProp}
      onPointerOut={onPointerOutProp}
    >
      {children}
    </div>
  );
});

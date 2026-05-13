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
  | MouseEvent<HTMLDivElement>
  | KeyboardEvent<HTMLDivElement>;

export type CardProps = Omit<
  HTMLAttributes<HTMLDivElement>,
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
  onClick?: HTMLAttributes<HTMLDivElement>["onClick"];
  onKeyDown?: HTMLAttributes<HTMLDivElement>["onKeyDown"];
};

const CARD_SURFACE: Record<CardVariant, string> = {
  default: "bg-surface border border-base",
  outline: "surface-outline",
  secondary: "surface-secondary",
};

export type CardContentProps = HTMLAttributes<HTMLDivElement>;
export type CardTitleProps = HTMLAttributes<HTMLHeadingElement>;
export type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement>;
export type CardBodyProps = HTMLAttributes<HTMLDivElement>;
export type CardFooterProps = HTMLAttributes<HTMLDivElement>;

function CardContent({ className = "", ...rest }: CardContentProps) {
  return (
    <div
      className={cn(
        "flex min-w-0 flex-col gap-small py-plus px-mid text-left",
        className,
      )}
      {...rest}
    />
  );
}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  function CardTitle({ className = "", ...rest }, ref) {
    return (
      <Text
        ref={ref as Ref<HTMLElement>}
        as="h3"
        variant="base"
        className={cn("min-w-0 leading-snug", className)}
        {...rest}
      />
    );
  },
);

const CardDescription = forwardRef<
  HTMLParagraphElement,
  CardDescriptionProps
>(function CardDescription({ className = "", ...rest }, ref) {
  return (
    <Text
      ref={ref as Ref<HTMLElement>}
      as="p"
      variant="base"
      className={cn("min-w-0 leading-normal text-muted", className)}
      {...rest}
    />
  );
});

function CardBody({ className = "", children, ...rest }: CardBodyProps) {
  return (
    <div
      className={cn("min-w-0 px-mid pb-mid text-left", className)}
      {...rest}
    >
      <Text variant="base" as="div" className="leading-relaxed">
        {children}
      </Text>
    </div>
  );
}

/** Нижняя зона действий / мета с разделителем. */
function CardFooter({ className = "", ...rest }: CardFooterProps) {
  return (
    <div
      className={cn(
        "mt-auto border-t border-base py-plus px-mid text-left text-sm text-muted",
        className,
      )}
      {...rest}
    />
  );
}

const CARD_PRESS_SHADOW = { hover: SHADOW_SM() };

const CardRoot = forwardRef<HTMLDivElement, CardProps>(function Card(
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
    role: roleProp,
    tabIndex: tabIndexProp,
    children,
    ...rest
  },
  ref,
) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const pointerInsideRef = useRef(false);

  const setRootRef = useCallback(
    (node: HTMLDivElement | null) => {
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
    (e: PointerEvent<HTMLDivElement>) => {
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
    (e: MouseEvent<HTMLDivElement>) => {
      onClickProp?.(e);
      if (!pressable || e.defaultPrevented) return;
      onPress?.(e);
    },
    [onClickProp, onPress, pressable],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLDivElement>) => {
      onKeyDownProp?.(e);
      if (!pressable || e.defaultPrevented) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        (e.currentTarget as HTMLDivElement).click();
      }
    },
    [onKeyDownProp, pressable],
  );

  return (
    <div
      ref={setRootRef}
      role={roleProp ?? (pressable ? "button" : undefined)}
      tabIndex={
        tabIndexProp ?? (pressable ? 0 : undefined)
      }
      className={cn(
        "flex min-w-0 flex-col overflow-hidden rounded-mid text-left text-foreground outline-none",
        pressable &&
          "relative cursor-pointer animate-shadow button-idle-surface-transition motion-reduce:transition-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent",
        CARD_SURFACE[variant],
        pressable && "will-change-transform origin-center",
        className,
      )}
      onPointerOver={(e) => {
        onPointerOverProp?.(e);
        if (!e.defaultPrevented && pressable) {
          liftPointerHandlers.onPointerOver(e);
        }
      }}
      onPointerOut={(e) => {
        onPointerOutProp?.(e);
        if (pressable) liftPointerHandlers.onPointerOut(e);
      }}
      onPointerDown={handlePointerDown}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      {...rest}
    >
      {pressable ? (
        <div className="relative flex min-w-0 flex-1 flex-col text-left">
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
});

/** Карточка: корневой блок с токенами темы; при `pressable` — hover-lift, тень и squeeze (риппл — снаружи через `<Ripple />`). */
export const Card = Object.assign(CardRoot, {
  Content: CardContent,
  Title: CardTitle,
  Description: CardDescription,
  Body: CardBody,
  Footer: CardFooter,
});

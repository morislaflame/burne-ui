import { killMotion } from "@/components/core/utils/gsapMotion";
import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
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
  shouldSkipInteractiveHoverLift,
} from "@/components/core/utils/hoverInteractiveLift";
import {
  useSecondLevelShadowContainer,
} from "@/components/core/utils/useShadowMotion";
import {
  animateGlossInteractivePressSqueeze,
  createGlossInteractiveRefCallback,
  GLOSS_INTERACTIVE_MOTION_CLASS,
  useGlossInteractiveHandlers,
} from "@/components/core/utils/glossInteractiveMotion";
import { SURFACE_COLOR_TRANSITION } from "@/components/core/utils/hoverVariant";
import { cn } from "@/utils/cn";

import "../utils/glossInteractive.css";

export type CardVariant = "default" | "outline" | "secondary" | "gloss";

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

const CARD_SURFACE: Record<Exclude<CardVariant, "gloss">, string> = {
  default: "bg-surface border-token",
  outline: "bg-transparent border-token",
  secondary: "bg-secondary border-token",
};

/** Пассивный 2-й уровень — статичная sm-тень без hover-lift. */
const CARD_STATIC_SHADOW = "shadow-token-sm";

export type CardHeaderProps = HTMLAttributes<HTMLDivElement>;
export type CardBodyProps = HTMLAttributes<HTMLDivElement>;
export type CardTitleProps = HTMLAttributes<HTMLHeadingElement>;
export type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement>;
export type CardFooterProps = HTMLAttributes<HTMLDivElement>;

/** Шапка карточки: заголовок, описание, мета. */
export function CardHeader({ className = "", ...rest }: CardHeaderProps) {
  return (
    <div
      className={cn(
        "flex shrink-0 flex-col gap-small py-plus px-large text-left",
        className,
      )}
      {...rest}
    />
  );
}

/** Колонка заголовка и подзаголовка внутри `Card.Header`. */
export function CardHeadingBlock({ className = "", ...rest }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex min-w-0 flex-1 flex-col gap-xsmall text-left", className)}
      {...rest}
    />
  );
}

/** Основной контент между шапкой и футером. */
export function CardBody({ className = "", ...rest }: CardBodyProps) {
  return (
    <div className={cn("min-w-0 px-large pb-mid", className)} {...rest} />
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

/** Нижняя зона действий / мета с разделителем. */
export function CardFooter({ className = "", ...rest }: CardFooterProps) {
  return (
    <div
      className={cn(
        "mt-auto border-t-token py-plus px-large text-muted",
        className,
      )}
      {...rest}
    />
  );
}


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

  const isGloss = variant === "gloss";
  const glossPressable = pressable && isGloss;

  const bindGlossRef = useMemo(
    () => createGlossInteractiveRefCallback(rootRef, isGloss),
    [isGloss],
  );

  const setRootRef = useCallback(
    (node: HTMLElement | null) => {
      bindGlossRef(node);
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [bindGlossRef, ref],
  );

  const glossPointerHandlers = useGlossInteractiveHandlers(
    rootRef,
    glossPressable,
    { pointerInsideRef },
  );

  const pressableLift = useSecondLevelShadowContainer(
    rootRef,
    pressable && !isGloss,
    { pointerInsideRef },
  );

  useEffect(() => {
    if (pressable) return;
    const el = rootRef.current;
    if (el) killMotion(el);
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

      if (isGloss) {
        void animateGlossInteractivePressSqueeze(
          shell,
          pointerInsideRef.current,
        );
        return;
      }

      void animateInteractivePressSqueeze(shell).then(() => {
        const el = rootRef.current;
        if (!el) return;
        if (shouldSkipInteractiveHoverLift()) return;
        if (pointerInsideRef.current) {
          animateInteractiveHoverLift(el, true, undefined, pressableLift.shadow);
        }
      });
    },
    [isGloss, onPointerDownProp, pressable],
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

  if (isGloss) {
    const glossPanelClass = cn(
      "gloss-panel flex min-w-0 flex-col rounded-mid text-foreground outline-none",
      SURFACE_COLOR_TRANSITION,
      className,
    );
    const glossChildren = (
      <div className="gloss-content flex min-w-0 flex-1 flex-col">{children}</div>
    );

    if (pressable) {
      return (
        <button
          type="button"
          {...rest}
          ref={setRootRef}
          className={cn(
            glossPanelClass,
            pressable &&
              cn(GLOSS_INTERACTIVE_MOTION_CLASS, "cursor-pointer focus-ring w-full border-0 p-0 text-left"),
          )}
          onPointerOver={(e) => {
            onPointerOverProp?.(e);
            if (pressable && !e.defaultPrevented) {
              if (isGloss) glossPointerHandlers.onPointerOver(e);
              else pressableLift.onPointerOver(e);
            }
          }}
          onPointerOut={(e) => {
            onPointerOutProp?.(e);
            if (pressable) {
              if (isGloss) glossPointerHandlers.onPointerOut(e);
              else pressableLift.onPointerOut(e);
            }
          }}
          onPointerDown={handlePointerDown}
          onClick={handleClick}
          onKeyDown={handleKeyDown}
        >
          {glossChildren}
        </button>
      );
    }

    return (
      <div
        {...rest}
        ref={setRootRef}
        className={glossPanelClass}
        onPointerOver={onPointerOverProp}
        onPointerOut={onPointerOutProp}
        onPointerDown={onPointerDownProp}
        onClick={onClickProp}
        onKeyDown={onKeyDownProp}
      >
        {glossChildren}
      </div>
    );
  }

  const rootClassName = cn(
    "flex min-w-0 flex-col overflow-hidden rounded-mid text-foreground outline-none",
    pressable && cn("relative cursor-pointer focus-ring", pressableLift.motionClass),
    SURFACE_COLOR_TRANSITION,
    CARD_SURFACE[variant],
    !pressable && CARD_STATIC_SHADOW,
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
            pressableLift.onPointerOver(e);
          }
        }}
        onPointerOut={(e) => {
          onPointerOutProp?.(e);
          pressableLift.onPointerOut(e);
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

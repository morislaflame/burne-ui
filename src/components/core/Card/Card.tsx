import {
  forwardRef,
  useCallback,
  useRef,
  type HTMLAttributes,
  type Ref,
} from "react";

import { Text } from "@/components/core/Text";
import { useInteractiveHoverLiftContainerHandlers } from "@/components/core/utils/hoverInteractiveLift";
import { cn } from "@/utils/cn";

export type CardVariant = "default" | "outline" | "secondary";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  /** Поверхность и обводка. По умолчанию `default`. */
  variant?: CardVariant;
};

const CARD_SURFACE: Record<CardVariant, string> = {
  default: "bg-surface border border-base shadow-sm",
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
        "flex min-w-0 flex-col gap-xsmall py-plus px-mid",
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
        variant="mid"
        className={cn("min-w-0 font-semibold", className)}
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
      className={cn("min-w-0 px-mid pb-mid", className)}
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
        "mt-auto border-t border-base py-plus px-mid text-sm text-muted",
        className,
      )}
      {...rest}
    />
  );
}

const CardRoot = forwardRef<HTMLDivElement, CardProps>(function Card(
  {
    className = "",
    variant = "default",
    onPointerOver: onPointerOverProp,
    onPointerOut: onPointerOutProp,
    ...rest
  },
  ref,
) {
  const rootRef = useRef<HTMLDivElement | null>(null);

  const setRootRef = useCallback(
    (node: HTMLDivElement | null) => {
      rootRef.current = node;
      if (typeof ref === "function") ref(node);
      else if (ref) ref.current = node;
    },
    [ref],
  );

  const liftPointerHandlers = useInteractiveHoverLiftContainerHandlers(rootRef, true);

  return (
    <div
      ref={setRootRef}
      className={cn(
        "flex min-w-0 flex-col overflow-hidden rounded-mid text-foreground outline-none",
        CARD_SURFACE[variant],
        className,
      )}
      onPointerOver={(e) => {
        onPointerOverProp?.(e);
        if (!e.defaultPrevented) liftPointerHandlers.onPointerOver(e);
      }}
      onPointerOut={(e) => {
        onPointerOutProp?.(e);
        liftPointerHandlers.onPointerOut(e);
      }}
      {...rest}
    />
  );
});

/** Карточка: корневой блок с токенами темы и лёгким hover-lift. */
export const Card = Object.assign(CardRoot, {
  Content: CardContent,
  Title: CardTitle,
  Description: CardDescription,
  Body: CardBody,
  Footer: CardFooter,
});

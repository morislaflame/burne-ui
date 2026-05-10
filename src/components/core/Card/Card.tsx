import {
  forwardRef,
  useCallback,
  useRef,
  type HTMLAttributes,
} from "react";

import { cn } from "../../../utils/cn";
import { useInteractiveHoverLiftOnContainer } from "../utils/hoverInteractiveLift";

export type CardVariant = "default" | "outline";

export type CardProps = HTMLAttributes<HTMLDivElement> & {
  /** Поверхность и обводка. По умолчанию `default`. */
  variant?: CardVariant;
};

const CARD_SURFACE: Record<CardVariant, string> = {
  default: "bg-brn-surface border border-brn-border shadow-sm",
  outline: "bg-transparent border border-brn-border shadow-none",
};

export type CardContentProps = HTMLAttributes<HTMLDivElement>;
export type CardTitleProps = HTMLAttributes<HTMLHeadingElement>;
export type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement>;
export type CardBodyProps = HTMLAttributes<HTMLDivElement>;
export type CardFooterProps = HTMLAttributes<HTMLDivElement>;

function CardContent({ className = "", ...rest }: CardContentProps) {
  return (
    <div
      className={cn("brn-title-subtitle-stack brn-inset-md", className)}
      {...rest}
    />
  );
}

const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  function CardTitle({ className = "", ...rest }, ref) {
    return (
      <h3
        ref={ref}
        className={cn("min-w-0 text-md font-semibold leading-snug", className)}
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
    <p
      ref={ref}
      className={cn("min-w-0 text-sm leading-normal text-brn-muted", className)}
      {...rest}
    />
  );
});

function CardBody({ className = "", ...rest }: CardBodyProps) {
  return (
    <div
      className={cn(
        "min-w-0 px-4 pb-4 text-sm leading-relaxed text-brn-text",
        className,
      )}
      {...rest}
    />
  );
}

/** Нижняя зона действий / мета с разделителем. */
function CardFooter({ className = "", ...rest }: CardFooterProps) {
  return (
    <div
      className={cn(
        "mt-auto border-t border-brn-border brn-inset-md text-sm text-brn-muted",
        className,
      )}
      {...rest}
    />
  );
}

const CardRoot = forwardRef<HTMLDivElement, CardProps>(function Card(
  { className = "", variant = "default", ...rest },
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

  useInteractiveHoverLiftOnContainer(rootRef, rootRef, true);

  return (
    <div
      ref={setRootRef}
      className={cn(
        "flex min-w-0 flex-col overflow-hidden rounded-xl text-brn-text outline-none",
        CARD_SURFACE[variant],
        className,
      )}
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

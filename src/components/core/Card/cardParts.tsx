import { forwardRef, type Ref } from "react";

import { Text } from "@/components/core/Text";
import { cn } from "@/utils/cn";

import { cardTitleHeadingTag } from "./cardA11y";

import { useCardClassNames, useCardSize } from "./cardContext";
import {
  CARD_BUTTON_SHELL_CLASS,
  CARD_DESCRIPTION_CLASS,
  CARD_GLOSS_CONTENT_CLASS,
  CARD_PRESSABLE_CONTENT_CLASS,
  CARD_TITLE_CLASS,
  cardBodyClass,
  cardFooterClass,
  cardGlossPressableClass,
  cardHeaderClass,
  cardHeadingBlockClass,
  panelSizeLayout,
} from "./cardStyles";
import type {
  CardBodyProps,
  CardDescriptionProps,
  CardFooterProps,
  CardHeaderProps,
  CardHeadingBlockProps,
  CardRootShellProps,
  CardTitleProps,
} from "./cardTypes";

export function CardHeader({ className = "", ...rest }: CardHeaderProps) {
  const slotClassNames = useCardClassNames();
  const size = useCardSize();
  return (
    <div
      className={cardHeaderClass(size, cn(slotClassNames.header, className))}
      {...rest}
    />
  );
}

export function CardHeadingBlock({ className = "", ...rest }: CardHeadingBlockProps) {
  const slotClassNames = useCardClassNames();
  const size = useCardSize();
  return (
    <div
      className={cardHeadingBlockClass(
        size,
        cn(slotClassNames.headingBlock, className),
      )}
      {...rest}
    />
  );
}

export function CardBody({ className = "", ...rest }: CardBodyProps) {
  const slotClassNames = useCardClassNames();
  const size = useCardSize();
  return (
    <div
      className={cardBodyClass(size, cn(slotClassNames.body, className))}
      {...rest}
    />
  );
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  function CardTitle({ className = "", ...rest }, ref) {
    const slotClassNames = useCardClassNames();
    const size = useCardSize();
    return (
      <Text
        ref={ref as Ref<HTMLElement>}
        as={cardTitleHeadingTag()}
        variant={panelSizeLayout(size).titleVariant}
        className={cn(CARD_TITLE_CLASS, slotClassNames.title, className)}
        {...rest}
      />
    );
  },
);

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  function CardDescription({ className = "", ...rest }, ref) {
    const slotClassNames = useCardClassNames();
    const size = useCardSize();
    return (
      <Text
        ref={ref as Ref<HTMLElement>}
        as="p"
        variant={panelSizeLayout(size).descVariant}
        className={cn(
          CARD_DESCRIPTION_CLASS,
          slotClassNames.description,
          className,
        )}
        {...rest}
      />
    );
  },
);

export function CardFooter({ className = "", ...rest }: CardFooterProps) {
  const slotClassNames = useCardClassNames();
  const size = useCardSize();
  return (
    <div
      className={cardFooterClass(size, cn(slotClassNames.footer, className))}
      {...rest}
    />
  );
}

export function CardRootShell({
  pressable,
  isGloss,
  renderAsButton,
  glossPanelClass,
  rootClassName,
  setRootRef,
  rest,
  children,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onClick,
  onKeyDown,
}: CardRootShellProps) {
  const slotClassNames = useCardClassNames();

  if (isGloss) {
    const glossChildren = (
      <div className={cn(CARD_GLOSS_CONTENT_CLASS, slotClassNames.glossContent)}>
        {children}
      </div>
    );

    if (pressable) {
      return (
        <button
          type="button"
          {...rest}
          ref={setRootRef}
          className={cn(
            CARD_BUTTON_SHELL_CLASS,
            glossPanelClass,
            cardGlossPressableClass(pressable),
          )}
          onPointerOver={onPointerOver}
          onPointerOut={onPointerOut}
          onPointerDown={onPointerDown}
          onClick={onClick}
          onKeyDown={onKeyDown}
        >
          {glossChildren}
        </button>
      );
    }

    if (renderAsButton) {
      return (
        <button
          type="button"
          {...rest}
          ref={setRootRef}
          className={cn(CARD_BUTTON_SHELL_CLASS, glossPanelClass)}
          onPointerOver={onPointerOver}
          onPointerOut={onPointerOut}
          onPointerDown={onPointerDown}
          onClick={onClick}
          onKeyDown={onKeyDown}
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
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      >
        {glossChildren}
      </div>
    );
  }

  if (pressable) {
    return (
      <button
        type="button"
        {...rest}
        ref={setRootRef}
        className={cn(CARD_BUTTON_SHELL_CLASS, rootClassName)}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onPointerDown={onPointerDown}
        onClick={onClick}
        onKeyDown={onKeyDown}
      >
        <div
          className={cn(
            CARD_PRESSABLE_CONTENT_CLASS,
            slotClassNames.content,
          )}
        >
          {children}
        </div>
      </button>
    );
  }

  if (renderAsButton) {
    return (
      <button
        type="button"
        {...rest}
        ref={setRootRef}
        className={cn(CARD_BUTTON_SHELL_CLASS, rootClassName)}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
        onPointerDown={onPointerDown}
        onClick={onClick}
        onKeyDown={onKeyDown}
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
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {children}
    </div>
  );
}

CardTitle.displayName = "CardTitle";
CardDescription.displayName = "CardDescription";

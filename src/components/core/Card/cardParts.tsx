import { forwardRef, type Ref } from "react";

import { Text } from "@/components/core/Text";
import { useMotionPart } from "@/components/core/utils/slotMotion";
import { cn } from "@/utils/cn";

import { cardTitleHeadingTag } from "./cardA11y";

import { useCardClassNames, useCardSize, useOptionalCardMotionScope } from "./cardContext";
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

export function CardHeader({
  className = "",
  motion,
  onPointerOver,
  onPointerOut,
  ...rest
}: CardHeaderProps) {
  const slotClassNames = useCardClassNames();
  const size = useCardSize();
  const { setRef, pointerHandlers } = useMotionPart<HTMLDivElement>({
    scope: useOptionalCardMotionScope(),
    slot: "header",
    motion,
    pointerPhases: true,
    onPointerOver,
    onPointerOut,
  });
  return (
    <div
      ref={setRef}
      className={cardHeaderClass(size, cn(slotClassNames.header, className))}
      {...rest}
      {...pointerHandlers}
    />
  );
}

export function CardHeadingBlock({
  className = "",
  motion,
  onPointerOver,
  onPointerOut,
  ...rest
}: CardHeadingBlockProps) {
  const slotClassNames = useCardClassNames();
  const size = useCardSize();
  const { setRef, pointerHandlers } = useMotionPart<HTMLDivElement>({
    scope: useOptionalCardMotionScope(),
    slot: "headingBlock",
    motion,
    pointerPhases: true,
    onPointerOver,
    onPointerOut,
  });
  return (
    <div
      ref={setRef}
      className={cardHeadingBlockClass(
        size,
        cn(slotClassNames.headingBlock, className),
      )}
      {...rest}
      {...pointerHandlers}
    />
  );
}

export function CardBody({
  className = "",
  motion,
  onPointerOver,
  onPointerOut,
  ...rest
}: CardBodyProps) {
  const slotClassNames = useCardClassNames();
  const size = useCardSize();
  const { setRef, pointerHandlers } = useMotionPart<HTMLDivElement>({
    scope: useOptionalCardMotionScope(),
    slot: "body",
    motion,
    pointerPhases: true,
    onPointerOver,
    onPointerOut,
  });
  return (
    <div
      ref={setRef}
      className={cardBodyClass(size, cn(slotClassNames.body, className))}
      {...rest}
      {...pointerHandlers}
    />
  );
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  function CardTitle(
    { className = "", motion, onPointerOver, onPointerOut, ...rest },
    ref,
  ) {
    const slotClassNames = useCardClassNames();
    const size = useCardSize();
    const { setRef, pointerHandlers } = useMotionPart<HTMLHeadingElement>({
      scope: useOptionalCardMotionScope(),
      slot: "title",
      motion,
      forwardedRef: ref,
      pointerPhases: true,
      onPointerOver,
      onPointerOut,
    });
    return (
      <Text
        ref={setRef as Ref<HTMLElement>}
        as={cardTitleHeadingTag()}
        variant={panelSizeLayout(size).titleVariant}
        className={cn(
          CARD_TITLE_CLASS,
          panelSizeLayout(size).titleClassName,
          slotClassNames.title,
          className,
        )}
        {...rest}
        {...pointerHandlers}
      />
    );
  },
);

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  function CardDescription(
    { className = "", motion, onPointerOver, onPointerOut, ...rest },
    ref,
  ) {
    const slotClassNames = useCardClassNames();
    const size = useCardSize();
    const { setRef, pointerHandlers } = useMotionPart<HTMLParagraphElement>({
      scope: useOptionalCardMotionScope(),
      slot: "description",
      motion,
      forwardedRef: ref,
      pointerPhases: true,
      onPointerOver,
      onPointerOut,
    });
    return (
      <Text
        ref={setRef as Ref<HTMLElement>}
        as="p"
        variant={panelSizeLayout(size).descVariant}
        className={cn(
          CARD_DESCRIPTION_CLASS,
          slotClassNames.description,
          className,
        )}
        {...rest}
        {...pointerHandlers}
      />
    );
  },
);

export function CardFooter({
  className = "",
  motion,
  onPointerOver,
  onPointerOut,
  ...rest
}: CardFooterProps) {
  const slotClassNames = useCardClassNames();
  const size = useCardSize();
  const { setRef, pointerHandlers } = useMotionPart<HTMLDivElement>({
    scope: useOptionalCardMotionScope(),
    slot: "footer",
    motion,
    pointerPhases: true,
    onPointerOver,
    onPointerOut,
  });
  return (
    <div
      ref={setRef}
      className={cardFooterClass(size, cn(slotClassNames.footer, className))}
      {...rest}
      {...pointerHandlers}
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
  onPointerUp,
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
          onPointerUp={onPointerUp}
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
          onPointerUp={onPointerUp}
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
        onPointerUp={onPointerUp}
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
        onPointerUp={onPointerUp}
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

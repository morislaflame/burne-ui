import { forwardRef, type Ref } from "react";

import { Text } from "@/components/core/Text";
import { cn } from "@/utils/cn";

import { cardTitleHeadingTag } from "./cardA11y";
import { mergeCardSlotClass } from "./cardAPI";
import { useCardClassNames } from "./cardContext";
import {
  CARD_BODY_CLASS,
  CARD_BUTTON_SHELL_CLASS,
  CARD_DESCRIPTION_CLASS,
  CARD_FOOTER_CLASS,
  CARD_GLOSS_CONTENT_CLASS,
  CARD_HEADER_CLASS,
  CARD_HEADING_BLOCK_CLASS,
  CARD_PRESSABLE_CONTENT_CLASS,
  CARD_TITLE_CLASS,
  cardGlossPressableClass,
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
  return (
    <div
      className={mergeCardSlotClass(CARD_HEADER_CLASS, slotClassNames.header, className)}
      {...rest}
    />
  );
}

export function CardHeadingBlock({ className = "", ...rest }: CardHeadingBlockProps) {
  const slotClassNames = useCardClassNames();
  return (
    <div
      className={mergeCardSlotClass(
        CARD_HEADING_BLOCK_CLASS,
        slotClassNames.headingBlock,
        className,
      )}
      {...rest}
    />
  );
}

export function CardBody({ className = "", ...rest }: CardBodyProps) {
  const slotClassNames = useCardClassNames();
  return (
    <div
      className={mergeCardSlotClass(CARD_BODY_CLASS, slotClassNames.body, className)}
      {...rest}
    />
  );
}

export const CardTitle = forwardRef<HTMLHeadingElement, CardTitleProps>(
  function CardTitle({ className = "", ...rest }, ref) {
    const slotClassNames = useCardClassNames();
    return (
      <Text
        ref={ref as Ref<HTMLElement>}
        as={cardTitleHeadingTag()}
        variant="base"
        className={mergeCardSlotClass(CARD_TITLE_CLASS, slotClassNames.title, className)}
        {...rest}
      />
    );
  },
);

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  function CardDescription({ className = "", ...rest }, ref) {
    const slotClassNames = useCardClassNames();
    return (
      <Text
        ref={ref as Ref<HTMLElement>}
        as="p"
        variant="base"
        className={mergeCardSlotClass(
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
  return (
    <div
      className={mergeCardSlotClass(CARD_FOOTER_CLASS, slotClassNames.footer, className)}
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
  glossPointerHandlers,
  pressableLift,
  onPointerOverProp,
  onPointerOutProp,
  handlePointerDown,
  handleClick,
  handleKeyDown,
  onPointerDownProp,
  onClickProp,
  onKeyDownProp,
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

  if (pressable) {
    return (
      <button
        type="button"
        {...rest}
        ref={setRootRef}
        className={cn(CARD_BUTTON_SHELL_CLASS, rootClassName)}
        onPointerOver={(e) => {
          onPointerOverProp?.(e);
          if (!e.defaultPrevented) pressableLift.onPointerOver(e);
        }}
        onPointerOut={(e) => {
          onPointerOutProp?.(e);
          pressableLift.onPointerOut(e);
        }}
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
      >
        <div
          className={mergeCardSlotClass(
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
}

CardTitle.displayName = "CardTitle";
CardDescription.displayName = "CardDescription";

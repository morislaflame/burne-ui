import { forwardRef, type Ref } from "react";

import { Text } from "@/components/core/Text";
import { dataVariantProps } from "@/components/core/utils/dataContract";
import { useMotionPart } from "@/components/core/utils/slotMotion";
import { resolveSkinLayer } from "@/skins/resolveSkinLayer";
import { SkinShell } from "@/skins/skinShell";
import { cn } from "@/utils/cn";

import { cardTitleHeadingTag } from "./cardA11y";

import { useCardClassNames, useCardSize, useOptionalCardMotionScope } from "./cardContext";
import {
  CARD_BUTTON_SHELL_CLASS,
  CARD_DESCRIPTION_CLASS,
  CARD_PRESSABLE_CONTENT_CLASS,
  CARD_TITLE_CLASS,
  cardBodyClass,
  cardFooterClass,
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
        cn(slotClassNames.headingBlock, className))}
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
    ref) {
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
          className)}
        {...rest}
        {...pointerHandlers}
      />
    );
  });

export const CardDescription = forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  function CardDescription(
    { className = "", motion, onPointerOver, onPointerOut, ...rest },
    ref) {
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
          className)}
        {...rest}
        {...pointerHandlers}
      />
    );
  });

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
  renderAsButton,
  rootClassName,
  setRootRef,
  rest,
  children,
  variant,
  size,
  onPointerOver,
  onPointerOut,
  onPointerDown,
  onPointerUp,
  onClick,
  onKeyDown,
}: CardRootShellProps) {
  const slotClassNames = useCardClassNames();
  const scope = useOptionalCardMotionScope();
  const pressableClass = cn(CARD_PRESSABLE_CONTENT_CLASS, slotClassNames.content);
  const hasLayerContent = Boolean(
    resolveSkinLayer(variant, "card.root")?.declarative?.content);

  const fallback =
    pressable || renderAsButton ? (
      <button
        type="button"
        className={cn(CARD_BUTTON_SHELL_CLASS, rootClassName)}
        onClick={onClick}
        onKeyDown={onKeyDown}
      />
    ) : (
      <div className={rootClassName} />
    );

  return (
    <SkinShell
      {...rest}
      {...dataVariantProps({ size, variant })}
      part="card.root"
      variant={variant}
      scope={scope}
      slot="root"
      ref={setRootRef}
      contentClassName={hasLayerContent && pressable ? pressableClass : undefined}
      fallback={fallback}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onPointerDown={onPointerDown}
      onPointerUp={onPointerUp}
    >
      {pressable && !hasLayerContent ? (
        <div className={pressableClass}>{children}</div>
      ) : (
        children
      )}
    </SkinShell>
  );
}

CardTitle.displayName = "CardTitle";
CardDescription.displayName = "CardDescription";

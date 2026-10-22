import { cloneElement, forwardRef, isValidElement, type ReactElement, type ReactNode, type Ref } from "react";

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

export const CardHeader = forwardRef<HTMLDivElement, CardHeaderProps>(
  function CardHeader(
    { className = "", motion, onPointerOver, onPointerOut, ...rest },
    ref,
  ) {
  const slotClassNames = useCardClassNames();
  const size = useCardSize();
  const { setRef, pointerHandlers } = useMotionPart<HTMLDivElement>({
    scope: useOptionalCardMotionScope(),
    slot: "header",
    motion,
    forwardedRef: ref,
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
},
);

export const CardHeadingBlock = forwardRef<HTMLDivElement, CardHeadingBlockProps>(
  function CardHeadingBlock(
    { className = "", motion, onPointerOver, onPointerOut, ...rest },
    ref,
  ) {
  const slotClassNames = useCardClassNames();
  const size = useCardSize();
  const { setRef, pointerHandlers } = useMotionPart<HTMLDivElement>({
    scope: useOptionalCardMotionScope(),
    slot: "headingBlock",
    motion,
    forwardedRef: ref,
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
},
);

export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(
  function CardBody(
    { className = "", motion, onPointerOver, onPointerOut, ...rest },
    ref,
  ) {
  const slotClassNames = useCardClassNames();
  const size = useCardSize();
  const { setRef, pointerHandlers } = useMotionPart<HTMLDivElement>({
    scope: useOptionalCardMotionScope(),
    slot: "body",
    motion,
    forwardedRef: ref,
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
},
);

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
        textStyle={panelSizeLayout(size).titleVariant}
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
        textStyle={panelSizeLayout(size).descVariant}
        className={cn(
          CARD_DESCRIPTION_CLASS,
          slotClassNames.description,
          className)}
        {...rest}
        {...pointerHandlers}
      />
    );
  });

export const CardFooter = forwardRef<HTMLDivElement, CardFooterProps>(
  function CardFooter(
    { className = "", motion, onPointerOver, onPointerOut, ...rest },
    ref,
  ) {
  const slotClassNames = useCardClassNames();
  const size = useCardSize();
  const { setRef, pointerHandlers } = useMotionPart<HTMLDivElement>({
    scope: useOptionalCardMotionScope(),
    slot: "footer",
    motion,
    forwardedRef: ref,
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
},
);

export function CardRootShell({
  pressable,
  renderAsButton,
  href,
  asChild = false,
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

  const shellClass = cn(
    pressable || renderAsButton || href != null || asChild
      ? CARD_BUTTON_SHELL_CLASS
      : undefined,
    rootClassName,
  );
  const child = asChild && isValidElement(children)
    ? (children as ReactElement<{ className?: string; children?: ReactNode }>)
    : null;
  const content = child ? child.props.children : children;
  const fallback = child
    ? cloneElement(child, {
        className: cn(shellClass, child.props.className),
      })
    : href != null
      ? (
          /* eslint-disable jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label -- body is injected by SkinShell */
          // react-doctor-disable-next-line react-doctor/anchor-has-content, react-doctor/control-has-associated-label -- body is injected by SkinShell
          <a
            href={href}
            className={shellClass}
            onClick={onClick}
            onKeyDown={onKeyDown}
          />
        )
      : pressable || renderAsButton
        ? (
            // react-doctor-disable-next-line react-doctor/control-has-associated-label -- body is injected by SkinShell
            <button
              type="button"
              className={shellClass}
              onClick={onClick}
              onKeyDown={onKeyDown}
            />
          )
        : (
            <div className={rootClassName} />
          );
  /* eslint-enable jsx-a11y/anchor-has-content, jsx-a11y/control-has-associated-label */

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
        <div className={pressableClass}>{content}</div>
      ) : (
        content
      )}
    </SkinShell>
  );
}

CardTitle.displayName = "CardTitle";
CardDescription.displayName = "CardDescription";

import { forwardRef, useLayoutEffect, type Ref } from "react";

import { CloseButton } from "@/components/core/CloseButton";
import { Text } from "@/components/core/Text";

import { drawerHandleAriaLabel, DRAWER_CLOSE_DEFAULT_ARIA_LABEL } from "./drawerA11y";
import { mergeDrawerSlotClass } from "./drawerAPI";
import { useDrawer, useDrawerClassNames } from "./drawerContext";
import {
  DRAWER_CLOSE_CLASS,
  DRAWER_DESCRIPTION_CLASS,
  DRAWER_FOOTER_CLASS,
  DRAWER_HEADER_CLASS,
  DRAWER_HEADING_BLOCK_CLASS,
  DRAWER_NATIVE_CLASS,
  DRAWER_TITLE_CLASS,
  drawerBodyClass,
  drawerContentClass,
  drawerGlossContentWrapClass,
  drawerGlossPanelClass,
  drawerHandleClass,
  drawerHandleGripClass,
  drawerOverlayClass,
  drawerOverlayEnterStyle,
  drawerPanelClass,
} from "./drawerStyles";
import type {
  DrawerBackdropProps,
  DrawerBodyProps,
  DrawerCloseProps,
  DrawerContentProps,
  DrawerDescriptionProps,
  DrawerFooterProps,
  DrawerHandleProps,
  DrawerHeaderProps,
  DrawerHeadingBlockProps,
  DrawerPanelSegment,
  DrawerPortalShellProps,
  DrawerTitleProps,
  DrawerVariant,
} from "./drawerTypes";
import { useDrawerHandleDrag } from "./useDrawerHandleDrag";

export function DrawerBackdropInner(_props: DrawerBackdropProps) {
  return null;
}

DrawerBackdropInner.displayName = "DrawerBackdrop";

export function DrawerContent({ className, ...rest }: DrawerContentProps) {
  const slotClassNames = useDrawerClassNames();

  return (
    <div
      className={drawerContentClass(
        mergeDrawerSlotClass(slotClassNames.content, className),
      )}
      {...rest}
    />
  );
}

DrawerContent.displayName = "DrawerContent";

function DrawerPanelSegment({
  segment,
  variant,
  index,
}: {
  segment: DrawerPanelSegment;
  variant: DrawerVariant;
  index: number;
}) {
  const slotClassNames = useDrawerClassNames();

  if (segment.kind === "handle") {
    return segment.node;
  }

  if (variant === "gloss") {
    return (
      <div
        key={`drawer-content-${index}`}
        className={drawerGlossContentWrapClass(slotClassNames.glossContent)}
      >
        <DrawerContent>{segment.children}</DrawerContent>
      </div>
    );
  }

  return (
    <DrawerContent key={`drawer-content-${index}`}>
      {segment.children}
    </DrawerContent>
  );
}

export function DrawerHandleInner({
  className,
  onPointerDown,
  ...rest
}: DrawerHandleProps) {
  const {
    onOpenChange,
    placement,
    overlayRef,
    panelRef,
    skipCloseAnimRef,
  } = useDrawer();
  const slotClassNames = useDrawerClassNames();
  const { onPointerDown: dragPD } = useDrawerHandleDrag(
    panelRef,
    overlayRef,
    placement,
    () => onOpenChange(false),
    false,
    skipCloseAnimRef,
  );

  return (
    <div
      aria-label={drawerHandleAriaLabel(placement)}
      className={drawerHandleClass({
        placement,
        slotClass: slotClassNames.handle,
        className,
      })}
      onPointerDown={(e) => {
        onPointerDown?.(e);
        dragPD(e);
      }}
      {...rest}
    >
      <span
        aria-hidden
        className={drawerHandleGripClass({
          placement,
          slotClass: slotClassNames.handleGrip,
        })}
      />
    </div>
  );
}

DrawerHandleInner.displayName = "DrawerHandle";

export function DrawerHeader({ className, ...rest }: DrawerHeaderProps) {
  const slotClassNames = useDrawerClassNames();

  return (
    <div
      className={mergeDrawerSlotClass(
        DRAWER_HEADER_CLASS,
        slotClassNames.header,
        className,
      )}
      {...rest}
    />
  );
}

DrawerHeader.displayName = "DrawerHeader";

export function DrawerHeadingBlock({
  className,
  ...rest
}: DrawerHeadingBlockProps) {
  const slotClassNames = useDrawerClassNames();

  return (
    <div
      className={mergeDrawerSlotClass(
        DRAWER_HEADING_BLOCK_CLASS,
        slotClassNames.headingBlock,
        className,
      )}
      {...rest}
    />
  );
}

DrawerHeadingBlock.displayName = "DrawerHeadingBlock";

export const DrawerTitle = forwardRef<HTMLHeadingElement, DrawerTitleProps>(
  function DrawerTitle({ className, id, ...rest }, ref) {
    const { titleId } = useDrawer();
    const slotClassNames = useDrawerClassNames();

    return (
      <Text
        ref={ref as Ref<HTMLElement>}
        as="h2"
        variant="mid"
        id={id ?? titleId}
        className={mergeDrawerSlotClass(
          DRAWER_TITLE_CLASS,
          slotClassNames.title,
          className,
        )}
        {...rest}
      />
    );
  },
);

DrawerTitle.displayName = "DrawerTitle";

export function DrawerDescription({
  className,
  id,
  ...rest
}: DrawerDescriptionProps) {
  const { descriptionId, setHasDescription } = useDrawer();
  const slotClassNames = useDrawerClassNames();

  useLayoutEffect(() => {
    setHasDescription(true);
    return () => setHasDescription(false);
  }, [setHasDescription]);

  return (
    <Text
      as="p"
      variant="base"
      id={id ?? descriptionId}
      className={mergeDrawerSlotClass(
        DRAWER_DESCRIPTION_CLASS,
        slotClassNames.description,
        className,
      )}
      {...rest}
    />
  );
}

DrawerDescription.displayName = "DrawerDescription";

export const DrawerClose = forwardRef<HTMLButtonElement, DrawerCloseProps>(
  function DrawerClose(
    {
      className,
      onClick,
      "aria-label": ariaLabel = DRAWER_CLOSE_DEFAULT_ARIA_LABEL,
      ...rest
    },
    ref,
  ) {
    const { onOpenChange } = useDrawer();
    const slotClassNames = useDrawerClassNames();

    return (
      <CloseButton
        ref={ref}
        size="small"
        variant="secondary"
        aria-label={ariaLabel}
        className={mergeDrawerSlotClass(
          DRAWER_CLOSE_CLASS,
          slotClassNames.close,
          className,
        )}
        onClick={(e) => {
          onClick?.(e);
          if (!e.defaultPrevented) onOpenChange(false);
        }}
        {...rest}
      />
    );
  },
);

DrawerClose.displayName = "DrawerClose";

export function DrawerBody({ className, ...rest }: DrawerBodyProps) {
  const slotClassNames = useDrawerClassNames();

  return (
    <div
      className={drawerBodyClass(
        mergeDrawerSlotClass(slotClassNames.body, className),
      )}
      {...rest}
    />
  );
}

DrawerBody.displayName = "DrawerBody";

export function DrawerFooter({ className, ...rest }: DrawerFooterProps) {
  const slotClassNames = useDrawerClassNames();

  return (
    <div
      className={mergeDrawerSlotClass(
        DRAWER_FOOTER_CLASS,
        slotClassNames.footer,
        className,
      )}
      {...rest}
    />
  );
}

DrawerFooter.displayName = "DrawerFooter";

export function DrawerPortalShell({
  className,
  variant,
  placement,
  size,
  portalTheme,
  lightUi,
  titleId,
  descriptionId,
  hasDescription,
  backdropIsDismissable,
  panelSegments,
  dialogRef,
  overlayRef,
  panelRef,
  bindGlossPanelRef,
  onBackdropMouseDown,
  onDialogClose,
}: DrawerPortalShellProps) {
  const slotClassNames = useDrawerClassNames();

  const panelNodes = panelSegments.map((segment, index) => (
    <DrawerPanelSegment
      key={segment.kind === "handle" ? `handle-${index}` : `content-${index}`}
      segment={segment}
      variant={variant}
      index={index}
    />
  ));

  return (
    <dialog
      {...portalTheme}
      ref={dialogRef}
      onClose={onDialogClose}
      aria-labelledby={titleId}
      aria-describedby={hasDescription ? descriptionId : undefined}
      className={mergeDrawerSlotClass(DRAWER_NATIVE_CLASS, slotClassNames.dialog)}
    >
      <div
        ref={overlayRef}
        className={drawerOverlayClass({
          lightUi,
          dismissable: backdropIsDismissable,
          slotClass: slotClassNames.overlay,
        })}
        style={drawerOverlayEnterStyle()}
        aria-hidden
        onMouseDown={onBackdropMouseDown}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        className={drawerPanelClass({
          variant,
          placement,
          size,
          className,
          slotClass: slotClassNames.panel,
        })}
      >
        {variant === "gloss" ? (
          <div
            ref={bindGlossPanelRef}
            className={drawerGlossPanelClass({
              placement,
              size,
              slotClass: slotClassNames.glossPanel,
            })}
          >
            {panelNodes}
          </div>
        ) : (
          panelNodes
        )}
      </div>
    </dialog>
  );
}

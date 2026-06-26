import {
  DrawerBackdropInner,
  DrawerBody,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHandleInner,
  DrawerHeader,
  DrawerHeadingBlock,
  DrawerRoot,
  DrawerTitle,
} from "./Drawer";

export const Drawer = Object.assign(DrawerRoot, {
  /** Конфигурирует подложку (`isDismissable`). Сам ничего не рендерит. */
  Backdrop: DrawerBackdropInner,
  /** Полоска перетягивания для свайп-закрытия. */
  Handle: DrawerHandleInner,
  Content: DrawerContent,
  Header: DrawerHeader,
  HeadingBlock: DrawerHeadingBlock,
  Title: DrawerTitle,
  Description: DrawerDescription,
  Close: DrawerClose,
  Body: DrawerBody,
  Footer: DrawerFooter,
});

export type {
  DrawerProps,
  DrawerPlacement,
  DrawerSize,
  DrawerVariant,
  DrawerBackdropProps,
  DrawerHandleProps,
  DrawerHeaderProps,
  DrawerHeadingBlockProps,
  DrawerTitleProps,
  DrawerDescriptionProps,
  DrawerBodyProps,
  DrawerFooterProps,
  DrawerCloseProps,
} from "./Drawer";

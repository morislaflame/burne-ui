import {
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogHeadingBlock,
  DialogRoot,
  DialogTitle,
} from "./Dialog";

export const Dialog = Object.assign(DialogRoot, {
  Content: DialogContent,
  Header: DialogHeader,
  HeadingBlock: DialogHeadingBlock,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
  Body: DialogBody,
  Footer: DialogFooter,
});

export type {
  DialogProps,
  DialogHeaderProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogBodyProps,
  DialogFooterProps,
  DialogCloseProps,
} from "./Dialog";

export { DialogContent };

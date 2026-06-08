import {
  DialogBody,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogHeadingBlock,
  DialogRoot,
  DialogTitle,
} from "./Dialog";

export const Dialog = Object.assign(DialogRoot, {
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

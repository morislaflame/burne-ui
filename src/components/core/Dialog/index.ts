import { DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogHeadingBlock, DialogPanel, DialogRoot, DialogTitle, DialogTrigger } from "./Dialog";

export const Dialog = Object.assign(DialogRoot, {
  Trigger: DialogTrigger,
  Panel: DialogPanel,
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
  DialogPanelProps,
  DialogTriggerProps,
  DialogVariant,
  DialogSize,
  DialogHeaderProps,
  DialogTitleProps,
  DialogDescriptionProps,
  DialogBodyProps,
  DialogFooterProps,
  DialogCloseProps,
  DialogContentProps,
  DialogHeadingBlockProps,
  DialogClassNames,
} from "./dialogTypes";

export { DialogContent };

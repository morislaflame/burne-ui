import { DialogBody, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogHeadingBlock, DialogOverlay, DialogPanel, DialogRoot, DialogTitle, DialogTrigger } from "./Dialog";
 
export const Dialog = Object.assign(DialogRoot, {
  Trigger: DialogTrigger,
  Overlay: DialogOverlay,
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
  DialogOverlayProps,
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
  DialogMotion,
  DialogLifecycleMotion,
  DialogPartMotion,
} from "./dialogTypes";
 
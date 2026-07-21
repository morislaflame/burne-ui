import "../utils/glossInteractive.css";

import { PopoverClassNamesProvider, PopoverProvider } from "./popoverContext";
import type { PopoverRootProps } from "./popoverTypes";
import { usePopoverRootState } from "./usePopoverRootState";

export type {
  PopoverArrowProps,
  PopoverBodyProps,
  PopoverClassNames,
  PopoverContentGap,
  PopoverContentProps,
  PopoverHeaderProps,
  PopoverDescriptionProps,
  PopoverTitleProps,
  PopoverRootProps,
  PopoverSide,
  PopoverSize,
  PopoverTriggerProps,
  PopoverVariant,
} from "./popoverTypes";

export {
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverHeader,
  PopoverDescription,
  PopoverTitle,
  PopoverTrigger,
} from "./popoverParts";

export function PopoverRoot({
  children,
  classNames,
  size = "base",
  variant = "default",
  side = "bottom",
  open,
  defaultOpen = false,
  onOpenChange,
  anchorRef,
  shouldDismiss,
}: PopoverRootProps) {
  const { contextValue } = usePopoverRootState({
    children,
    size,
    variant,
    side,
    open,
    defaultOpen,
    onOpenChange,
    anchorRef,
    shouldDismiss,
  });

  return (
    <PopoverProvider value={contextValue}>
      <PopoverClassNamesProvider classNames={classNames}>
        {children}
      </PopoverClassNamesProvider>
    </PopoverProvider>
  );
}

PopoverRoot.displayName = "PopoverRoot";

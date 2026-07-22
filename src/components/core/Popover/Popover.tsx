import "../utils/glossInteractive.css";

import { PopoverClassNamesProvider, PopoverProvider } from "./popoverContext";
import type { PopoverProps } from "./popoverTypes";
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
  PopoverProps,
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
  portalContainer,
}: PopoverProps) {
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
    portalContainer,
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

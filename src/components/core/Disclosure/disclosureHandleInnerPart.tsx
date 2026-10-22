import { forwardRef } from "react";

import { cn } from "@/utils/cn";
 
import { useDisclosureClassNames, useDisclosureContext } from "./disclosureContext";
import { DISCLOSURE_HANDLE_BASE_CLASS, DISCLOSURE_HANDLE_DISABLED_CLASS, DISCLOSURE_HANDLE_GRIP_CLASS } from "./disclosureStyles";
import type { DisclosureHandleProps } from "./disclosureTypes";
import { useDisclosureContentDrag } from "./useDisclosureContentDrag";
 
export const DisclosureHandleInner = forwardRef<HTMLDivElement, DisclosureHandleProps>(
  function DisclosureHandleInner({ className, onPointerDown, ...rest }, ref) {
  const slotClassNames = useDisclosureClassNames();
  const {
    variant,
    disabled,
    dragHandle,
    shellRef,
    innerRef,
    chevronRef,
    open,
    setOpen,
    skipContentAnimRef,
  } = useDisclosureContext();
 
  const { onPointerDown: dragPD } = useDisclosureContentDrag(
    shellRef,
    innerRef,
    chevronRef,
    open,
    setOpen,
    disabled,
    skipContentAnimRef,
  );
 
  if (!dragHandle || variant !== "card") return null;
 
  return (
    <div
      aria-hidden
      className={cn(
        DISCLOSURE_HANDLE_BASE_CLASS,
        disabled && DISCLOSURE_HANDLE_DISABLED_CLASS,
        slotClassNames.handle,
        className,
      )}
      onPointerDown={(e) => {
        onPointerDown?.(e);
        dragPD(e);
      }}
      {...rest}
      ref={ref}
    >
      <span className={DISCLOSURE_HANDLE_GRIP_CLASS} />
    </div>
  );
},
);
 
DisclosureHandleInner.displayName = "DisclosureHandle";
 
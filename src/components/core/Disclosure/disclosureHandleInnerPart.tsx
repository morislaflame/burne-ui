import { mergeDisclosureSlotClass } from "./disclosureAPI";
import { useDisclosureClassNames, useDisclosureContext } from "./disclosureContext";
import {
  DISCLOSURE_HANDLE_BASE_CLASS,
  DISCLOSURE_HANDLE_DISABLED_CLASS,
  DISCLOSURE_HANDLE_GRIP_CLASS,
} from "./disclosureStyles";
import type { DisclosureHandleProps } from "./disclosureTypes";
import { useDisclosureContentDrag } from "./useDisclosureContentDrag";

export function DisclosureHandleInner({
  className,
  onPointerDown,
  ...rest
}: DisclosureHandleProps) {
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
      className={mergeDisclosureSlotClass(
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
    >
      <span className={DISCLOSURE_HANDLE_GRIP_CLASS} />
    </div>
  );
}

DisclosureHandleInner.displayName = "DisclosureHandle";

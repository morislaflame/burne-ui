import { forwardRef, useCallback } from "react";

import { useMotionPart } from "@/components/core/utils/slotMotion";

import { useDisclosureContentMotion } from "./disclosureAnimations";
import { useDisclosureClassNames, useDisclosureContext, useOptionalDisclosureMotionScope } from "./disclosureContext";
import { DISCLOSURE_CONTENT_SHELL_CLASS, disclosureContentPanelClass, disclosureContentWrapClass } from "./disclosureStyles";
import type { DisclosureContentProps } from "./disclosureTypes";

import { cn } from "@/utils/cn";

export const DisclosureContent = forwardRef<HTMLDivElement, DisclosureContentProps>(
  function DisclosureContent({ children, className, motion, ...rest }, ref) {
    const slotClassNames = useDisclosureClassNames();
    const {
      open,
      panelId,
      triggerId,
      size,
      variant,
      shellRef,
      innerRef,
      skipContentAnimRef,
    } = useDisclosureContext();

    const { setShellRef: bindShellRef, setInnerRef } = useDisclosureContentMotion({
      open,
      motion,
      skipContentAnimRef,
      shellRef,
      innerRef,
    });
    const { setRef: setBodyPartRef } = useMotionPart<HTMLElement>({
      scope: useOptionalDisclosureMotionScope(),
      slot: "body",
    });

    const setShellRef = useCallback(
      (node: HTMLDivElement | null) => {
        bindShellRef(node);
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [bindShellRef, ref],
    );

    const contentWrapCls = disclosureContentWrapClass(variant);
    const panelClass = cn(slotClassNames.contentPanel, slotClassNames.body);

    return (
      <div
        ref={setShellRef}
        aria-hidden={!open}
        className={cn(
          DISCLOSURE_CONTENT_SHELL_CLASS,
          slotClassNames.contentShell,
        )}
      >
        <div
          ref={setInnerRef}
          className={cn(
            contentWrapCls,
            slotClassNames.contentWrap,
          )}
        >
          <section
            ref={setBodyPartRef}
            id={panelId}
            aria-labelledby={triggerId}
            className={disclosureContentPanelClass({
              variant,
              size,
              className,
              slotClass: panelClass,
            })}
            {...rest}
          >
            {children}
          </section>
        </div>
      </div>
    );
  },
);

DisclosureContent.displayName = "DisclosureContent";

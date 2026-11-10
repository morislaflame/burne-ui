import { forwardRef, useCallback } from "react";

import { mergeForwardedRef, mergeRefs } from "@/components/core/utils/mergeRefs";
import { useStudioSlotRef } from "@/studio/studioModeContext";
import { useMotionPart } from "@/components/core/utils/slotMotion";

import { useDisclosureContentMotion } from "./disclosureAnimations";
import { useDisclosureClassNames, useDisclosureContext, useOptionalDisclosureMotionScope } from "./disclosureContext";
import { DISCLOSURE_CONTENT_SHELL_CLASS, disclosureContentClass, disclosureContentWrapClass } from "./disclosureStyles";
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
      skipContentAnimRef,
      shellRef,
      innerRef,
    });
    const contentScope = useOptionalDisclosureMotionScope();
    const studioWrapRef = useStudioSlotRef<HTMLDivElement>("disclosure.contentWrap", contentScope);
    const { setRef: setContentPartRef } = useMotionPart<HTMLElement>({
      scope: contentScope,
      slot: "content",
      motion,
    });

    const setSectionRef = useCallback(
      (node: HTMLDivElement | null) => {
        setContentPartRef(node);
        mergeForwardedRef(ref, node);
      },
      [ref, setContentPartRef],
    );

    const contentWrapCls = disclosureContentWrapClass(variant);

    return (
      <div
        ref={bindShellRef}
        aria-hidden={!open}
        className={cn(
          DISCLOSURE_CONTENT_SHELL_CLASS,
          slotClassNames.contentShell,
        )}
      >
        <div
          ref={mergeRefs(setInnerRef, studioWrapRef)}
          className={cn(
            contentWrapCls,
            slotClassNames.contentWrap,
          )}
        >
          <section
            ref={setSectionRef}
            id={panelId}
            aria-labelledby={triggerId}
            className={disclosureContentClass({
              variant,
              size,
              className,
              slotClass: slotClassNames.content,
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

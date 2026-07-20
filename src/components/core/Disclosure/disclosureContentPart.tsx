import { forwardRef, useCallback } from "react";

import {
  useCollapsibleHeight,
  useCollapsibleShellRef,
} from "@/components/core/utils/useCollapsibleHeight";

import { useDisclosureClassNames, useDisclosureContext } from "./disclosureContext";
import {
  DISCLOSURE_CONTENT_SHELL_CLASS,
  DISCLOSURE_GLOSS_PANEL_CLASS,
  disclosureContentPanelClass,
  disclosureContentWrapClass,
  disclosureGlossContentClass,
} from "./disclosureStyles";
import type { DisclosureContentProps } from "./disclosureTypes";

import { cn } from "@/utils/cn";

export const DisclosureContent = forwardRef<HTMLDivElement, DisclosureContentProps>(
  function DisclosureContent({ children, className, ...rest }, ref) {
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

    useCollapsibleHeight(open, shellRef, innerRef, { skipAnimRef: skipContentAnimRef });

    const bindShellRef = useCollapsibleShellRef(shellRef, open);

    const setShellRef = useCallback(
      (node: HTMLDivElement | null) => {
        bindShellRef(node);
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      },
      [bindShellRef, ref],
    );

    const contentWrapCls = disclosureContentWrapClass(variant);
    const isGloss = variant === "gloss";

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
          ref={innerRef}
          className={cn(
            contentWrapCls,
            slotClassNames.contentWrap,
          )}
        >
          {isGloss ? (
            <section
              id={panelId}
              aria-labelledby={triggerId}
              className={cn(
                slotClassNames.contentPanel,
                className,
              )}
              {...rest}
            >
              <div
                className={cn(
                  DISCLOSURE_GLOSS_PANEL_CLASS,
                  slotClassNames.glossPanel,
                )}
              >
                <div className={disclosureGlossContentClass(size, slotClassNames.glossContent)}>
                  {children}
                </div>
              </div>
            </section>
          ) : (
            <section
              id={panelId}
              aria-labelledby={triggerId}
              className={disclosureContentPanelClass({
                variant,
                size,
                className,
                slotClass: slotClassNames.contentPanel,
              })}
              {...rest}
            >
              {children}
            </section>
          )}
        </div>
      </div>
    );
  },
);

DisclosureContent.displayName = "DisclosureContent";

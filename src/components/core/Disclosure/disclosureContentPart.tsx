import { forwardRef, useCallback } from "react";

import {
  useCollapsibleHeight,
  useCollapsibleShellRef,
} from "@/components/core/utils/useCollapsibleHeight";

import { mergeDisclosureSlotClass } from "./disclosureAPI";
import { useDisclosureClassNames, useDisclosureContext } from "./disclosureContext";
import {
  DISCLOSURE_CONTENT_SHELL_CLASS,
  DISCLOSURE_GLOSS_PANEL_CLASS,
  disclosureContentPanelClass,
  disclosureContentWrapClass,
  disclosureGlossContentClass,
} from "./disclosureStyles";
import type { DisclosureContentProps } from "./disclosureTypes";

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
        className={mergeDisclosureSlotClass(
          DISCLOSURE_CONTENT_SHELL_CLASS,
          slotClassNames.contentShell,
        )}
      >
        <div
          ref={innerRef}
          className={mergeDisclosureSlotClass(
            contentWrapCls,
            slotClassNames.contentWrap,
          )}
        >
          {isGloss ? (
            <section
              id={panelId}
              aria-labelledby={triggerId}
              className={mergeDisclosureSlotClass(
                slotClassNames.contentPanel,
                className,
              )}
              {...rest}
            >
              <div
                className={mergeDisclosureSlotClass(
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

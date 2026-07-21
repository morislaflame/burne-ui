import { forwardRef } from "react";

import { useMergedGlossPanelRef } from "@/components/core/utils/glossInteractiveMotion";
import "../utils/glossInteractive.css";

import { ExpandableClassNamesProvider, ExpandableProvider } from "./expandableContext";
import { EXPANDABLE_GLOSS_CONTENT_CLASS, ExpandableChevron, ExpandableContent, ExpandableDescription, ExpandableIcon, ExpandableMessage, ExpandablePanel, ExpandableSimpleBody, ExpandableTitle, ExpandableTrigger } from "./expandableParts";
import { expandableRootClass } from "./expandableStyles";
import type { ExpandableRootProps } from "./expandableTypes";
import { useExpandableRootState } from "./useExpandableRootState";

import { cn } from "@/utils/cn";

export type {
  ExpandableProps,
  ExpandableRootProps,
  ExpandableTriggerProps,
  ExpandableMessageProps,
  ExpandableIconProps,
  ExpandableContentProps,
  ExpandableTitleProps,
  ExpandableDescriptionProps,
  ExpandableChevronProps,
  ExpandablePanelProps,
  ExpandableSize,
  ExpandableVariant,
  ExpandableClassNames,
} from "./expandableTypes";

export { useExpandableContext } from "./expandableContext";

export const ExpandableRoot = forwardRef<HTMLDivElement, ExpandableRootProps>(
  function ExpandableRoot(
    {
      children,
      compound: compoundProp,
      title,
      description,
      icon,
      variant = "default",
      size = "base",
      defaultOpen = false,
      open: openProp,
      onOpenChange,
      disabled = false,
      className,
      classNames,
      ...rest
    },
    ref,
  ) {
    const state = useExpandableRootState({
      children,
      compound: compoundProp,
      defaultOpen,
      open: openProp,
      onOpenChange,
      disabled,
      size,
      variant,
    });

    const setRootRef = useMergedGlossPanelRef(ref, state.isGloss);

    const body = state.isCompound ? (
      children
    ) : (
      <ExpandableSimpleBody
        title={title}
        description={description}
        icon={icon}
        panelChildren={children}
      />
    );

    return (
      <ExpandableProvider value={state.contextValue}>
        <ExpandableClassNamesProvider classNames={classNames}>
          <div
            ref={setRootRef}
            className={expandableRootClass({
              variant,
              className,
              slotClass: classNames?.root,
            })}
            {...rest}
          >
            {state.isGloss ? (
              <div
                className={cn(
                  EXPANDABLE_GLOSS_CONTENT_CLASS,
                  classNames?.glossContent,
                )}
              >
                {body}
              </div>
            ) : (
              body
            )}
          </div>
        </ExpandableClassNamesProvider>
      </ExpandableProvider>
    );
  },
);

ExpandableRoot.displayName = "ExpandableRoot";

export {
  ExpandableTrigger,
  ExpandableMessage,
  ExpandableIcon,
  ExpandableContent,
  ExpandableTitle,
  ExpandableDescription,
  ExpandableChevron,
  ExpandablePanel,
};

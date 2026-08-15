import { forwardRef, type ForwardedRef } from "react";

import { mergeMotionSlotMaps, useMotionPart } from "@/components/core/utils/slotMotion";

import { tabsPanelA11y, tabsPanelId, tabsTabId } from "./tabsA11y";
import { useTabsPanelLifecycle } from "./tabsAnimations";
import {
  TabsMotionProvider,
  useOptionalTabsMotionScope,
  useTabsClassNames,
  useTabsContext,
  useTabsMotionScope,
} from "./tabsContext";
import { tabsPanelClass } from "./tabsStyles";
import type { TabsPanelProps } from "./tabsTypes";

export const TabsPanel = forwardRef<HTMLDivElement, TabsPanelProps>(function TabsPanel(
  { motion, ...rest },
  ref,
) {
  const parentScope = useOptionalTabsMotionScope();
  const mergedMotion = mergeMotionSlotMaps(
    parentScope?.getRootMotion(),
    motion ? { panel: motion } : undefined,
  );

  return (
    <TabsMotionProvider motion={mergedMotion} defaults={{}}>
      <TabsPanelSurface forwardedRef={ref} itemMotion={motion} {...rest} />
    </TabsMotionProvider>
  );
});

function TabsPanelSurface({
  value: panelValue,
  children,
  className,
  itemMotion,
  forwardedRef,
  ...rest
}: TabsPanelProps & {
  itemMotion?: TabsPanelProps["motion"];
  forwardedRef: ForwardedRef<HTMLDivElement>;
}) {
  const { value, baseId } = useTabsContext();
  const slotClassNames = useTabsClassNames();
  const isSelected = value === panelValue;
  const tabId = tabsTabId(baseId, panelValue);
  const panelId = tabsPanelId(baseId, panelValue);
  const a11y = tabsPanelA11y({ isSelected, tabId });
  const scope = useTabsMotionScope();
  const part = useMotionPart<HTMLDivElement>({
    scope,
    slot: "panel",
    motion: itemMotion,
    forwardedRef,
    pointerPhases: false,
  });
  const { leaving } = useTabsPanelLifecycle(scope, isSelected);
  const hidden = a11y.hidden && !leaving;

  return (
    <div
      ref={part.setRef}
      role="tabpanel"
      id={panelId}
      aria-labelledby={a11y["aria-labelledby"]}
      hidden={hidden}
      tabIndex={a11y.tabIndex}
      className={tabsPanelClass({
        slotClass: slotClassNames.panel,
        className,
      })}
      {...rest}
    >
      {children}
    </div>
  );
}

TabsPanel.displayName = "TabsPanel";

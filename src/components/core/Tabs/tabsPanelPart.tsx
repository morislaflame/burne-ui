import { forwardRef, type ForwardedRef } from "react";
 
import { dataActiveState } from "@/components/core/utils/dataContract";
import {
  mergeMotionRootSiblings,
  mergeMotionSlotMaps,
  useMotionPart,
} from "@/components/core/utils/slotMotion";
 
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
  { motion, motionController, motionState, motionPayload, playInitialState, ...rest },
  ref,
) {
  const parentScope = useOptionalTabsMotionScope();
  const mergedSlots = mergeMotionSlotMaps(
    parentScope?.getRootMotion(),
    motion ? { panel: motion } : undefined,
  );
  const siblings = mergeMotionRootSiblings({
    events: parentScope?.getEvents(),
    states: parentScope?.getStates(),
  });
  const mergedMotion = { ...mergedSlots, ...siblings };
 
  return (
    <TabsMotionProvider motion={mergedMotion} defaults={{}} controller={motionController}
        motionState={motionState}
        motionPayload={motionPayload}
        playInitialState={playInitialState}>
      <TabsPanelSurface forwardedRef={ref} itemMotion={motion} {...rest} />
    </TabsMotionProvider>
  );
});
 
function TabsPanelSurface({
  value: panelValue,
  keepMounted: keepMountedProp,
  children,
  className,
  itemMotion,
  forwardedRef,
  ...rest
}: TabsPanelProps & {
  itemMotion?: TabsPanelProps["motion"];
  forwardedRef: ForwardedRef<HTMLDivElement>;
}) {
  const { value, baseId, keepMounted: rootKeepMounted } = useTabsContext();
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
  const stayMounted = keepMountedProp ?? rootKeepMounted;
  if (!isSelected && !leaving && !stayMounted) return null;
  const hidden = a11y.hidden && !leaving;
 
  return (
    <div
      ref={part.setRef}
      role="tabpanel"
      id={panelId}
      aria-labelledby={a11y["aria-labelledby"]}
      hidden={hidden}
      inert={!isSelected || undefined}
      tabIndex={a11y.tabIndex}
      className={tabsPanelClass({
        hidden,
        slotClass: slotClassNames.panel,
        className,
      })}
      {...rest}
      data-state={dataActiveState(isSelected)}
    >
      {children}
    </div>
  );
}
 
TabsPanel.displayName = "TabsPanel";
 
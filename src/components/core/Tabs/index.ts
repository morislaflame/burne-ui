import { TabsList, TabsPanel, TabsRoot, TabsTab } from "./Tabs";

export const Tabs = Object.assign(TabsRoot, {
  List: TabsList,
  Tab: TabsTab,
  Panel: TabsPanel,
});

export { TabsRoot, TabsList, TabsTab, TabsPanel } from "./Tabs";
export { useTabsContext, useTabsClassNames } from "./tabsContext";

export type {
  TabsProps,
  TabsListProps,
  TabsTabProps,
  TabsPanelProps,
  TabsSize,
  TabsOrientation,
  TabsVariant,
  TabsClassNames,
} from "./tabsTypes";

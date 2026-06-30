import { TabsList, TabsPanel, TabsRoot, TabsTab } from "./tabsParts";

export const Tabs = Object.assign(TabsRoot, {
  Root: TabsRoot,
  List: TabsList,
  Tab: TabsTab,
  Panel: TabsPanel,
});

export { TabsRoot, TabsList, TabsTab, TabsPanel } from "./tabsParts";
export { useTabsContext, useTabsClassNames } from "./tabsContext";

export type {
  TabsRootProps,
  TabsListProps,
  TabsTabProps,
  TabsPanelProps,
  TabsSize,
  TabsOrientation,
  TabsVariant,
  TabsClassNames,
} from "./tabsTypes";

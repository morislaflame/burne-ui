import { TabsList, TabsPanel, TabsRoot, TabsTab } from "./Tabs";

export const Tabs = Object.assign(TabsRoot, {
  Root: TabsRoot,
  List: TabsList,
  Tab: TabsTab,
  Panel: TabsPanel,
});

export { TabsRoot, TabsList, TabsTab, TabsPanel } from "./Tabs";
export { useTabsContext } from "./tabsContext";

export type {
  TabsRootProps,
  TabsListProps,
  TabsTabProps,
  TabsPanelProps,
  TabsSize,
  TabsOrientation,
  TabsVariant,
} from "./Tabs";

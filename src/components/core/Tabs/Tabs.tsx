import { forwardRef } from "react";

import { TabsClassNamesProvider, TabsContext } from "./tabsContext";
import { TabsList, TabsPanel, TabsTab } from "./tabsParts";
import { tabsRootClass } from "./tabsStyles";
import type { TabsProps } from "./tabsTypes";
import { useTabsRootState } from "./useTabsRootState";

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

export const TabsRoot = forwardRef<HTMLDivElement, TabsProps>(function TabsRoot(
  {
    children,
    className,
    classNames,
    value,
    defaultValue,
    onValueChange,
    orientation = "horizontal",
    size = "base",
    variant = "default",
    disabled = false,
    ...rest
  },
  ref,
) {
  const { contextValue } = useTabsRootState({
    value,
    defaultValue,
    onValueChange,
    orientation,
    size,
    variant,
    disabled,
  });

  return (
    <TabsContext.Provider value={contextValue}>
      <TabsClassNamesProvider classNames={classNames}>
        <div
          ref={ref}
          className={tabsRootClass({
            orientation: contextValue.orientation,
            slotClass: classNames?.root,
            className,
          })}
          data-orientation={contextValue.orientation}
          {...rest}
        >
          {children}
        </div>
      </TabsClassNamesProvider>
    </TabsContext.Provider>
  );
});

TabsRoot.displayName = "Tabs";

export { TabsList, TabsTab, TabsPanel };

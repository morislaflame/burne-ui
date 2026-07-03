import { forwardRef } from "react";

import { tabsPanelA11y, tabsPanelId, tabsTabId } from "./tabsA11y";
import { useTabsClassNames, useTabsContext } from "./tabsContext";
import { tabsPanelClass } from "./tabsStyles";
import type { TabsPanelProps } from "./tabsTypes";

export const TabsPanel = forwardRef<HTMLDivElement, TabsPanelProps>(function TabsPanel(
  { value: panelValue, children, className, ...rest },
  ref,
) {
  const { value, baseId } = useTabsContext();
  const slotClassNames = useTabsClassNames();
  const isSelected = value === panelValue;
  const tabId = tabsTabId(baseId, panelValue);
  const panelId = tabsPanelId(baseId, panelValue);
  const a11y = tabsPanelA11y({ isSelected, tabId });

  return (
    <div
      ref={ref}
      role="tabpanel"
      id={panelId}
      aria-labelledby={a11y["aria-labelledby"]}
      hidden={a11y.hidden}
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
});

TabsPanel.displayName = "TabsPanel";

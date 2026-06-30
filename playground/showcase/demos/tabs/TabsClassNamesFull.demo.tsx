import { IoDocumentTextOutline, IoPersonOutline } from "react-icons/io5";

import { Tabs } from "@/components/core/Tabs";

const TAB_ITEMS = [
  { value: "account", label: "Аккаунт", icon: IoPersonOutline },
  { value: "documents", label: "Документы", icon: IoDocumentTextOutline },
] as const;

export function TabsClassNamesFullDemo() {
  return (
    <Tabs
      defaultValue="account"
      classNames={{
        root: "max-w-xl rounded-mid border border-info/25 p-base",
        list: "bg-info/5 ring-1 ring-info/15",
        indicator: "bg-info/30",
        tab: "font-medium",
        tabText: "gap-small",
        panel: "rounded-small bg-info/5 p-mid",
      }}
    >
      <Tabs.List>
        {TAB_ITEMS.map(({ value, label, icon: Icon }) => (
          <Tabs.Tab key={value} value={value}>
            <Icon aria-hidden className="icon-base shrink-0" />
            {label}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {TAB_ITEMS.map(({ value, label }) => (
        <Tabs.Panel key={value} value={value}>
          <p className="text-small text-muted">Контент вкладки «{label}».</p>
        </Tabs.Panel>
      ))}
    </Tabs>
  );
}

import { ListBox } from "@/components/core/ListBox";

export function ListBoxClassNamesFullDemo() {
  return (
    <ListBox
      defaultValue="ru"
      label="Interface language"
      classNames={{
        root: "rounded-mid border border-primary/25 p-base",
        headerText: "text-primary font-medium",
        item: "rounded-lg",
        label: "font-semibold text-foreground",
        hint: "text-muted/80",
      }}
    >
      <ListBox.Section>
        <ListBox.Header>Available languages</ListBox.Header>
        <ListBox.Item value="ru" label="Russian" hint="Cyrillic" />
        <ListBox.Item value="en" label="English" hint="Latin script" />
        <ListBox.Item value="de" label="Deutsch" disabled hint="Soon" />
      </ListBox.Section>
    </ListBox>
  );
}

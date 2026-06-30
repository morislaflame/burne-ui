import { ListBox } from "@/components/core/ListBox";

export function ListBoxClassNamesFullDemo() {
  return (
    <ListBox
      defaultValue="ru"
      label="Язык интерфейса"
      classNames={{
        root: "rounded-mid border border-primary/25 p-base",
        headerText: "text-primary font-medium",
        item: "rounded-lg",
        label: "font-semibold text-foreground",
        hint: "text-muted/80",
      }}
    >
      <ListBox.Section>
        <ListBox.Header>Доступные языки</ListBox.Header>
        <ListBox.Item value="ru" label="Русский" hint="Кириллица" />
        <ListBox.Item value="en" label="English" hint="Latin script" />
        <ListBox.Item value="de" label="Deutsch" disabled hint="Скоро" />
      </ListBox.Section>
    </ListBox>
  );
}

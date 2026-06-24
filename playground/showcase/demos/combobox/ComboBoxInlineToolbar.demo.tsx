import { useMemo, useState } from "react";
import { IoGlobeOutline } from "react-icons/io5";

import { ComboBox } from "@/components/core/ComboBox";
import { useComboBoxContext } from "@/components/core/ComboBox/comboBoxContext";
import { ListBox } from "@/components/core/ListBox";

const RECENT = ["ru", "en"] as const;
const ALL_LANGS = [
  { value: "ru", label: "Русский", hint: "Интерфейс на русском" },
  { value: "en", label: "English", hint: "UI in English" },
  { value: "de", label: "Deutsch", hint: "Demnächst" },
  { value: "fr", label: "Français", hint: "Beta" },
] as const;

const COMBO_OPTIONS = ALL_LANGS.map((lang) => ({
  value: lang.value,
  label: lang.label,
  hint: lang.hint,
  filterText: `${lang.label} ${lang.hint}`,
}));

function GroupedLanguageItems() {
  const { filteredValues } = useComboBoxContext();
  const byValue = useMemo(() => new Map(ALL_LANGS.map((l) => [l.value, l])), []);

  const recent = filteredValues.filter((v) => RECENT.includes(v as (typeof RECENT)[number]));
  const rest = filteredValues.filter((v) => !RECENT.includes(v as (typeof RECENT)[number]));

  if (filteredValues.length === 0) {
    return <ListBox.Empty>Язык не найден</ListBox.Empty>;
  }

  const renderItem = (value: string) => {
    const lang = byValue.get(value as (typeof ALL_LANGS)[number]["value"]);
    if (!lang) return null;

    return (
      <ListBox.Item key={value} value={value}>
        <ListBox.ItemIndicator />
        <ListBox.Label>{lang.label}</ListBox.Label>
        <ListBox.Hint>{lang.hint}</ListBox.Hint>
        <ListBox.Icon>
          <IoGlobeOutline aria-hidden className="text-muted" />
        </ListBox.Icon>
      </ListBox.Item>
    );
  };

  return (
    <>
      {recent.length > 0 ? (
        <ListBox.Section>
          <ListBox.Header>Недавние</ListBox.Header>
          {recent.map(renderItem)}
        </ListBox.Section>
      ) : null}
      {rest.length > 0 ? (
        <ListBox.Section>
          <ListBox.Header>Все языки</ListBox.Header>
          {rest.map(renderItem)}
        </ListBox.Section>
      ) : null}
    </>
  );
}

export function ComboBoxInlineToolbarDemo() {
  const [value, setValue] = useState("ru");

  return (
    <ComboBox
      variant="outline"
      options={COMBO_OPTIONS}
      value={value}
      onValueChange={setValue}
      className="w-full max-w-xs"
    >
      <ComboBox.Label>Язык интерфейса</ComboBox.Label>
      <ComboBox.InputGroup>
        <ComboBox.Input placeholder="Найти язык…" />
        <ComboBox.Trigger />
      </ComboBox.InputGroup>
      <ComboBox.Popover>
        <GroupedLanguageItems />
      </ComboBox.Popover>
    </ComboBox>
  );
}

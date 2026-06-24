import { useMemo, useState } from "react";
import { IoChevronForward } from "react-icons/io5";

import { Badge } from "@/components/core/Badge";
import { ComboBox } from "@/components/core/ComboBox";
import { useComboBoxContext } from "@/components/core/ComboBox/comboBoxContext";
import { ListBox } from "@/components/core/ListBox";

const ACTIONS = [
  { value: "duplicate", label: "Дублировать", hint: "Создать копию компонента" },
  { value: "export", label: "Экспорт в Figma", hint: "Code Connect" },
  { value: "archive", label: "В архив", hint: "Скрыть из каталога" },
] as const;

const COMBO_OPTIONS = ACTIONS.map((a) => ({
  value: a.value,
  label: a.label,
  hint: a.hint,
  filterText: `${a.label} ${a.hint}`,
}));

function ActionListItems() {
  const { filteredValues } = useComboBoxContext();
  const byValue = useMemo(() => new Map(ACTIONS.map((a) => [a.value, a])), []);

  if (filteredValues.length === 0) {
    return <ListBox.Empty>Действие не найдено</ListBox.Empty>;
  }

  return (
    <ListBox.Section>
      <ListBox.Header>Действия с компонентом</ListBox.Header>
      {filteredValues.map((value) => {
        const action = byValue.get(value as (typeof ACTIONS)[number]["value"]);
        if (!action) return null;

        return (
          <ListBox.Item key={value} value={value} className="gap-y-base">
            <ListBox.Label>{action.label}</ListBox.Label>
            <ListBox.Hint>{action.hint}</ListBox.Hint>
            <ListBox.Icon>
              <Badge variant="secondary" size="small">
                ⌘K
              </Badge>
            </ListBox.Icon>
            <span className="col-start-3 row-start-1 justify-self-end text-muted">
              <IoChevronForward aria-hidden />
            </span>
          </ListBox.Item>
        );
      })}
    </ListBox.Section>
  );
}

export function ComboBoxStackPickerDemo() {
  const [value, setValue] = useState("duplicate");

  return (
    <ComboBox
      options={COMBO_OPTIONS}
      value={value}
      onValueChange={setValue}
      className="w-full max-w-sm"
    >
      <ComboBox.Label>Быстрое действие</ComboBox.Label>
      <ComboBox.InputGroup>
        <ComboBox.Input placeholder="Выберите или найдите…" />
        <ComboBox.Trigger />
      </ComboBox.InputGroup>
      <ComboBox.Popover>
        <ActionListItems />
      </ComboBox.Popover>
      <ComboBox.Hint>Кастомный grid пункта — hint, badge и chevron в разных слотах.</ComboBox.Hint>
    </ComboBox>
  );
}

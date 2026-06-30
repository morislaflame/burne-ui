import { DropdownClassNamesFullDemo } from "../demos/dropdown/DropdownClassNamesFull.demo";
import dropdownClassNamesFullSource from "../demos/dropdown/DropdownClassNamesFull.demo.tsx?raw";
import { DropdownActionMenuDemo } from "../demos/dropdown/DropdownActionMenu.demo";
import dropdownActionMenuSource from "../demos/dropdown/DropdownActionMenu.demo.tsx?raw";
import { DropdownGlossDemo } from "../demos/dropdown/DropdownGloss.demo";
import dropdownGlossSource from "../demos/dropdown/DropdownGloss.demo.tsx?raw";
import { DropdownMultipleDemo } from "../demos/dropdown/DropdownMultiple.demo";
import dropdownMultipleSource from "../demos/dropdown/DropdownMultiple.demo.tsx?raw";
import { DropdownSingleSelectDemo } from "../demos/dropdown/DropdownSingleSelect.demo";
import dropdownSingleSelectSource from "../demos/dropdown/DropdownSingleSelect.demo.tsx?raw";
import { DropdownStatusPickerDemo } from "../demos/dropdown/DropdownStatusPicker.demo";
import dropdownStatusPickerSource from "../demos/dropdown/DropdownStatusPicker.demo.tsx?raw";
import { DropdownUserMenuDemo } from "../demos/dropdown/DropdownUserMenu.demo";
import dropdownUserMenuSource from "../demos/dropdown/DropdownUserMenu.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function DropdownShowcase() {
  return (
    <ShowcasePage
      title="Dropdown"
      description="Выпадающее меню с одиночным и множественным выбором значений."
      importPath='import { Dropdown } from "@/components/core/Dropdown";'
      tags={["core", "overlay"]}
    >
      <ShowcaseSection title="Одиночный выбор" description="selectionIndicator и группировка пунктов.">
        <ShowcaseDemoFromFile Demo={DropdownSingleSelectDemo} source={dropdownSingleSelectSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Мультивыбор" description="multiple и массив defaultValue.">
        <ShowcaseDemoFromFile Demo={DropdownMultipleDemo} source={dropdownMultipleSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description='popoverVariant="gloss" — стеклянное выпадающее меню.'>
        <ShowcaseDemoFromFile Demo={DropdownGlossDemo} source={dropdownGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="Полная кастомизация слотов через classNames на Root."
      >
        <ShowcaseDemoFromFile
          Demo={DropdownClassNamesFullDemo}
          source={dropdownClassNamesFullSource}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Меню аккаунта, действия строки и выбор статуса — `demos/dropdown/`."
      >
        <ShowcaseDemoFromFile Demo={DropdownUserMenuDemo} source={dropdownUserMenuSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={DropdownActionMenuDemo} source={dropdownActionMenuSource} />
        <ShowcaseDemoFromFile Demo={DropdownStatusPickerDemo} source={dropdownStatusPickerSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/core/Dropdown" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Dropdown.Trigger, Dropdown.Popover (variant gloss), Group, Item, ItemLabel, ItemHint, ItemIcon, Sub."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Выбор">
          <p>
            <code>defaultValue</code> / <code>value</code> + <code>onValueChange</code> для контролируемого режима.
            <code>multiple</code> переключает на массив значений.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss>
          <p>
            <code>variant=&quot;gloss&quot;</code> на <code>Dropdown.Popover</code>. Пункты с{" "}
            <code>href</code> рендерятся как ссылки с ролью menuitem.
          </p>
        </ShowcaseDoc.Customization>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}

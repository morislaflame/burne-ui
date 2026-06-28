import { ComboBoxDefaultDemo } from "../demos/combobox/ComboBoxDefault.demo";
import comboBoxDefaultSource from "../demos/combobox/ComboBoxDefault.demo.tsx?raw";
import { ComboBoxSizesDemo } from "../demos/combobox/ComboBoxSizes.demo";
import comboBoxSizesSource from "../demos/combobox/ComboBoxSizes.demo.tsx?raw";
import { ComboBoxGlossDemo } from "../demos/combobox/ComboBoxGloss.demo";
import comboBoxGlossSource from "../demos/combobox/ComboBoxGloss.demo.tsx?raw";
import { ComboBoxStackPickerDemo } from "../demos/combobox/ComboBoxStackPicker.demo";
import comboBoxStackPickerSource from "../demos/combobox/ComboBoxStackPicker.demo.tsx?raw";
import { ComboBoxInlineToolbarDemo } from "../demos/combobox/ComboBoxInlineToolbar.demo";
import comboBoxInlineToolbarSource from "../demos/combobox/ComboBoxInlineToolbar.demo.tsx?raw";
import { ComboBoxWorkspacePickerDemo } from "../demos/combobox/ComboBoxWorkspacePicker.demo";
import comboBoxWorkspacePickerSource from "../demos/combobox/ComboBoxWorkspacePicker.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function ComboBoxShowcase() {
  return (
    <ShowcasePage
      title="ComboBox"
      description="Выпадающий список с поиском и controlled value."
      importPath='import { ComboBox } from "@/components/core/ComboBox";'
      tags={["core", "forms"]}
    >
      <ShowcaseSection title="Default" description="options, value и onValueChange — controlled режим.">
        <ShowcaseDemoFromFile align="center" Demo={ComboBoxDefaultDemo} source={comboBoxDefaultSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Размеры" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile align="center" Demo={ComboBoxSizesDemo} source={comboBoxSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant gloss — стеклянная оболочка.">
        <ShowcaseDemoFromFile align="center" Demo={ComboBoxGlossDemo} source={comboBoxGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Compound ListBox в Popover, gradient Fill, segmented TimeField — demo-файлы в `demos/combobox/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={ComboBoxWorkspacePickerDemo} source={comboBoxWorkspacePickerSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={ComboBoxInlineToolbarDemo} source={comboBoxInlineToolbarSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={ComboBoxStackPickerDemo} source={comboBoxStackPickerSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/core/ComboBox" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="options: { value, label }[], value, onValueChange, label, hint, variant."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Опции">
          <p>
            Массив <code>options</code> с полями <code>value</code> и <code>label</code>. Для gloss-стиля
            передайте <code>variant=&quot;gloss&quot;</code>.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}

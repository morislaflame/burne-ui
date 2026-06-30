import { ListBoxClassNamesFullDemo } from "../demos/listBox/ListBoxClassNamesFull.demo";
import listBoxClassNamesFullSource from "../demos/listBox/ListBoxClassNamesFull.demo.tsx?raw";
import { ListBoxCommandPaletteDemo } from "../demos/listBox/ListBoxCommandPalette.demo";
import listBoxCommandPaletteSource from "../demos/listBox/ListBoxCommandPalette.demo.tsx?raw";
import { ListBoxCompoundDemo } from "../demos/listBox/ListBoxCompound.demo";
import listBoxCompoundSource from "../demos/listBox/ListBoxCompound.demo.tsx?raw";
import { ListBoxGlossDemo } from "../demos/listBox/ListBoxGloss.demo";
import listBoxGlossSource from "../demos/listBox/ListBoxGloss.demo.tsx?raw";
import { ListBoxPermissionsDemo } from "../demos/listBox/ListBoxPermissions.demo";
import listBoxPermissionsSource from "../demos/listBox/ListBoxPermissions.demo.tsx?raw";
import { ListBoxSimpleApiDemo } from "../demos/listBox/ListBoxSimpleApi.demo";
import listBoxSimpleApiSource from "../demos/listBox/ListBoxSimpleApi.demo.tsx?raw";
import { ListBoxSizesDemo } from "../demos/listBox/ListBoxSizes.demo";
import listBoxSizesSource from "../demos/listBox/ListBoxSizes.demo.tsx?raw";
import { ListBoxWorkspacePickerDemo } from "../demos/listBox/ListBoxWorkspacePicker.demo";
import listBoxWorkspacePickerSource from "../demos/listBox/ListBoxWorkspacePicker.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function ListBoxShowcase() {
  return (
    <ShowcasePage
      title="ListBox"
      description="Список выбора для встраивания в панели, формы и выпадающие меню."
      importPath='import { ListBox } from "@/components/core/ListBox";'
      tags={["core", "selection"]}
    >
      <ShowcaseSection title="Compound" description="Секции, подсказки и иконки у пунктов.">
        <ShowcaseDemoFromFile align="stretch" Demo={ListBoxCompoundDemo} source={listBoxCompoundSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Simple API" description="label на Item и множественный выбор.">
        <ShowcaseDemoFromFile align="stretch" Demo={ListBoxSimpleApiDemo} source={listBoxSimpleApiSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Размеры" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile align="stretch" Demo={ListBoxSizesDemo} source={listBoxSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant gloss — стеклянная панель списка с hover-lift.">
        <ShowcaseDemoFromFile align="stretch" Demo={ListBoxGlossDemo} source={listBoxGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="Слоты root, section, header, item, label, hint и icon — через prop classNames."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={ListBoxClassNamesFullDemo} source={listBoxClassNamesFullSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Выбор workspace, права доступа и command palette — `demos/listBox/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={ListBoxWorkspacePickerDemo} source={listBoxWorkspacePickerSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={ListBoxPermissionsDemo} source={listBoxPermissionsSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={ListBoxCommandPaletteDemo} source={listBoxCommandPaletteSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/core/ListBox" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Section, Header, Item, ItemIndicator, Label, Hint и Icon — полная разметка списка."
          />
          <ShowcaseDoc.ApiRow
            api="simple"
            description="ListBox.Item с пропами label, hint и disabled — сокращённый вариант."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Выбор">
          <p>
            Одиночный режим — строка в <code>value</code>. <code>multiple</code> — массив строк.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}

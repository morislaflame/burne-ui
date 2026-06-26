import { ToggleButtonGroupEditorBarDemo } from "../demos/toggleButtonGroup/ToggleButtonGroupEditorBar.demo";
import toggleButtonGroupEditorBarSource from "../demos/toggleButtonGroup/ToggleButtonGroupEditorBar.demo.tsx?raw";
import { ToggleButtonGroupMultipleDemo } from "../demos/toggleButtonGroup/ToggleButtonGroupMultiple.demo";
import toggleButtonGroupMultipleSource from "../demos/toggleButtonGroup/ToggleButtonGroupMultiple.demo.tsx?raw";
import { ToggleButtonGroupSingleDemo } from "../demos/toggleButtonGroup/ToggleButtonGroupSingle.demo";
import toggleButtonGroupSingleSource from "../demos/toggleButtonGroup/ToggleButtonGroupSingle.demo.tsx?raw";
import { ToggleButtonGroupSizesDemo } from "../demos/toggleButtonGroup/ToggleButtonGroupSizes.demo";
import toggleButtonGroupSizesSource from "../demos/toggleButtonGroup/ToggleButtonGroupSizes.demo.tsx?raw";
import { ToggleButtonGroupVerticalDemo } from "../demos/toggleButtonGroup/ToggleButtonGroupVertical.demo";
import toggleButtonGroupVerticalSource from "../demos/toggleButtonGroup/ToggleButtonGroupVertical.demo.tsx?raw";
import { ToggleButtonGroupViewToolbarDemo } from "../demos/toggleButtonGroup/ToggleButtonGroupViewToolbar.demo";
import toggleButtonGroupViewToolbarSource from "../demos/toggleButtonGroup/ToggleButtonGroupViewToolbar.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function ToggleButtonGroupShowcase() {
  return (
    <ShowcasePage
      title="ToggleButtonGroup"
      description="Группа кнопок-переключателей: одиночный или множественный выбор."
      importPath='import { ToggleButtonGroup } from "@/components/composite/ToggleButtonGroup";'
      tags={["composite", "forms"]}
    >
      <ShowcaseSection title="Одиночный выбор" description="type=&quot;single&quot; — вид списка.">
        <ShowcaseDemoFromFile Demo={ToggleButtonGroupSingleDemo} source={toggleButtonGroupSingleSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Размеры" description="size: small, base, mid, large — пробрасывается дочерним ToggleButton.">
        <ShowcaseDemoFromFile Demo={ToggleButtonGroupSizesDemo} source={toggleButtonGroupSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Множественный выбор" description="type=&quot;multiple&quot; — форматирование текста.">
        <ShowcaseDemoFromFile Demo={ToggleButtonGroupMultipleDemo} source={toggleButtonGroupMultipleSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Тулбар вида, вертикальная группа и панель форматирования — `demos/toggleButtonGroup/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={ToggleButtonGroupViewToolbarDemo} source={toggleButtonGroupViewToolbarSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={ToggleButtonGroupVerticalDemo} source={toggleButtonGroupVerticalSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={ToggleButtonGroupEditorBarDemo} source={toggleButtonGroupEditorBarSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/composite/ToggleButtonGroup" />
          <ShowcaseDoc.Import path="@/components/core/ToggleButton" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="compound"
            description="ToggleButtonGroup оборачивает ToggleButton с value. type: single | multiple."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Доступность">
          <p>
            Обязательный <code>aria-label</code> на группе. <code>leftIcon</code> на ToggleButton — декоративная
            иконка с <code>aria-hidden</code>.
          </p>
        </ShowcaseDoc.Block>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}

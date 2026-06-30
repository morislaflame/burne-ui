import { ToggleButtonClassNamesFullDemo } from "../demos/toggle-button/ToggleButtonClassNamesFull.demo";
import toggleButtonClassNamesFullSource from "../demos/toggle-button/ToggleButtonClassNamesFull.demo.tsx?raw";
import { ToggleButtonControlledDemo } from "../demos/toggle-button/ToggleButtonControlled.demo";
import toggleButtonControlledSource from "../demos/toggle-button/ToggleButtonControlled.demo.tsx?raw";
import { ToggleButtonGlossDemo } from "../demos/toggle-button/ToggleButtonGloss.demo";
import toggleButtonGlossSource from "../demos/toggle-button/ToggleButtonGloss.demo.tsx?raw";
import { ToggleButtonReactionBarDemo } from "../demos/toggle-button/ToggleButtonReactionBar.demo";
import toggleButtonReactionBarSource from "../demos/toggle-button/ToggleButtonReactionBar.demo.tsx?raw";
import { ToggleButtonSizesDemo } from "../demos/toggle-button/ToggleButtonSizes.demo";
import toggleButtonSizesSource from "../demos/toggle-button/ToggleButtonSizes.demo.tsx?raw";
import { ToggleButtonUncontrolledDemo } from "../demos/toggle-button/ToggleButtonUncontrolled.demo";
import toggleButtonUncontrolledSource from "../demos/toggle-button/ToggleButtonUncontrolled.demo.tsx?raw";
import { ToggleButtonVariantsDemo } from "../demos/toggle-button/ToggleButtonVariants.demo";
import toggleButtonVariantsSource from "../demos/toggle-button/ToggleButtonVariants.demo.tsx?raw";
import { ToggleButtonViewSwitchDemo } from "../demos/toggle-button/ToggleButtonViewSwitch.demo";
import toggleButtonViewSwitchSource from "../demos/toggle-button/ToggleButtonViewSwitch.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function ToggleButtonShowcase() {
  return (
    <ShowcasePage
      title="ToggleButton"
      description="Кнопка с состоянием «нажато»: лайки, закладки и прочие переключаемые действия."
      importPath='import { ToggleButton } from "@/components/core/ToggleButton";'
      tags={["core", "actions"]}
    >
      <ShowcaseSection
        title="Controlled"
        description="pressed и onPressedChange — контролируемый режим."
      >
        <ShowcaseDemoFromFile Demo={ToggleButtonControlledDemo} source={toggleButtonControlledSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Uncontrolled"
        description="defaultPressed — начальное состояние без внешнего state."
      >
        <ShowcaseDemoFromFile Demo={ToggleButtonUncontrolledDemo} source={toggleButtonUncontrolledSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Варианты" description="variant: default, outline, ghost, gloss.">
        <ShowcaseDemoFromFile Demo={ToggleButtonVariantsDemo} source={toggleButtonVariantsSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Размеры" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile Demo={ToggleButtonSizesDemo} source={toggleButtonSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="Стеклянная поверхность в нажатом и покойном состоянии.">
        <ShowcaseDemoFromFile Demo={ToggleButtonGlossDemo} source={toggleButtonGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Полная кастомизация classNames"
        description="Слоты root, fill, content, leftIcon, rightIcon, label через classNames."
      >
        <ShowcaseDemoFromFile Demo={ToggleButtonClassNamesFullDemo} source={toggleButtonClassNamesFullSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Панели реакций и переключатели вида — state внутри demo-файлов."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={ToggleButtonReactionBarDemo} source={toggleButtonReactionBarSource} />
        <ShowcaseDemoFromFile Demo={ToggleButtonViewSwitchDemo} source={toggleButtonViewSwitchSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/core/ToggleButton" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="pressed, defaultPressed, onPressedChange, variant, size, leftIcon, value (в группе)."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Группы">
          <p>
            Для взаимоисключающего или множественного выбора используйте{" "}
            <code>ToggleButtonGroup</code> из <code>@/components/composite/ToggleButtonGroup</code>.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}

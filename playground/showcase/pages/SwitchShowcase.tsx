import { SwitchAccentColorDemo } from "../demos/switch/SwitchAccentColor.demo";
import switchAccentColorSource from "../demos/switch/SwitchAccentColor.demo.tsx?raw";
import { SwitchCompoundThemeDemo } from "../demos/switch/SwitchCompoundTheme.demo";
import switchCompoundThemeSource from "../demos/switch/SwitchCompoundTheme.demo.tsx?raw";
import { SwitchClassNamesFullDemo } from "../demos/switch/SwitchClassNamesFull.demo";
import switchClassNamesFullSource from "../demos/switch/SwitchClassNamesFull.demo.tsx?raw";
import { SwitchDisabledDemo } from "../demos/switch/SwitchDisabled.demo";
import switchDisabledSource from "../demos/switch/SwitchDisabled.demo.tsx?raw";
import { SwitchGlossDemo } from "../demos/switch/SwitchGloss.demo";
import switchGlossSource from "../demos/switch/SwitchGloss.demo.tsx?raw";
import { SwitchNotificationsDemo } from "../demos/switch/SwitchNotifications.demo";
import switchNotificationsSource from "../demos/switch/SwitchNotifications.demo.tsx?raw";
import { SwitchSizesDemo } from "../demos/switch/SwitchSizes.demo";
import switchSizesSource from "../demos/switch/SwitchSizes.demo.tsx?raw";
import { SwitchSettingsPanelDemo } from "../demos/switch/SwitchSettingsPanel.demo";
import switchSettingsPanelSource from "../demos/switch/SwitchSettingsPanel.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function SwitchShowcase() {
  return (
    <ShowcasePage
      title="Switch"
      description="Переключатель вкл/выкл с подписью и состоянием disabled."
      importPath='import { Switch } from "@/components/core/Switch";'
      tags={["core", "forms"]}
    >
      <ShowcaseSection title="Базовый" description="Контролируемый переключатель с label.">
        <ShowcaseDemoFromFile Demo={SwitchNotificationsDemo} source={switchNotificationsSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Размеры" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile Demo={SwitchSizesDemo} source={switchSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Disabled" description="Неактивный переключатель.">
        <ShowcaseDemoFromFile Demo={SwitchDisabledDemo} source={switchDisabledSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="gloss — стеклянный трек и кружок (проп gloss на корне).">
        <ShowcaseDemoFromFile Demo={SwitchGlossDemo} source={switchGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="Полная кастомизация слотов через classNames на root."
      >
        <ShowcaseDemoFromFile
          align="stretch"
          Demo={SwitchClassNamesFullDemo}
          source={switchClassNamesFullSource}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Панель настроек, compound Track и кастомный color — demo-файлы в `demos/switch/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={SwitchSettingsPanelDemo} source={switchSettingsPanelSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={SwitchCompoundThemeDemo} source={switchCompoundThemeSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={SwitchAccentColorDemo} source={switchAccentColorSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/core/Switch" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="label, hint, checked, onChange, disabled, gloss на корне — без children."
          />
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Switch.Label, Switch.Hint, Switch.Track — кастомная разметка переключателя."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss="gloss">
          <p>
            Булевый <code>gloss</code> — стеклянный трек. Цвета активного состояния — CSS-переменные темы.
            Анимация thumb — <code>configureMotion()</code> (<code>switchThumbDuration</code>,{" "}
            <code>switchThumbEase</code>).
          </p>
        </ShowcaseDoc.Customization>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}

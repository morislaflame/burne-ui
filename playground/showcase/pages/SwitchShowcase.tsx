import { SwitchAccentColorDemo } from "../demos/switch/SwitchAccentColor.demo";
import switchAccentColorSource from "../demos/switch/SwitchAccentColor.demo.tsx?raw";
import { SwitchCompoundThemeDemo } from "../demos/switch/SwitchCompoundTheme.demo";
import switchCompoundThemeSource from "../demos/switch/SwitchCompoundTheme.demo.tsx?raw";
import { SwitchDisabledDemo } from "../demos/switch/SwitchDisabled.demo";
import switchDisabledSource from "../demos/switch/SwitchDisabled.demo.tsx?raw";
import { SwitchGlossDemo } from "../demos/switch/SwitchGloss.demo";
import switchGlossSource from "../demos/switch/SwitchGloss.demo.tsx?raw";
import { SwitchNotificationsDemo } from "../demos/switch/SwitchNotifications.demo";
import switchNotificationsSource from "../demos/switch/SwitchNotifications.demo.tsx?raw";
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

      <ShowcaseSection title="Disabled" description="Неактивный переключатель.">
        <ShowcaseDemoFromFile Demo={SwitchDisabledDemo} source={switchDisabledSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="gloss — стеклянный трек и кружок.">
        <ShowcaseDemoFromFile Demo={SwitchGlossDemo} source={switchGlossSource} />
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
            description="label, checked, onChange, disabled на корне — нативный checkbox с визуальным thumb."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Кастомизация">
          <p>
            Размеры через <code>size</code>. Цвета активного состояния — через CSS-переменные темы.
          </p>
        </ShowcaseDoc.Block>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}

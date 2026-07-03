import { SwitchAccentColorDemo } from "../demos/switch/SwitchAccentColor.demo";
import switchAccentColorSource from "../demos/switch/SwitchAccentColor.demo.tsx?raw";
import { SwitchCompoundThemeDemo } from "../demos/switch/SwitchCompoundTheme.demo";
import switchCompoundThemeSource from "../demos/switch/SwitchCompoundTheme.demo.tsx?raw";
import { SwitchClassNamesFullDemo } from "../demos/switch/SwitchClassNamesFull.demo";
import switchClassNamesFullSource from "../demos/switch/SwitchClassNamesFull.demo.tsx?raw";
import { SwitchClassNamesSimpleLabelDemo } from "../demos/switch/SwitchClassNamesSimpleLabel.demo";
import switchClassNamesSimpleLabelSource from "../demos/switch/SwitchClassNamesSimpleLabel.demo.tsx?raw";
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
      description="On/off switch with label and status disabled."
      importPath='import { Switch } from "@/components/core/Switch";'
      tags={["core", "forms"]}
    >
      <ShowcaseSection title="Base" description="Controlled switch with label.">
        <ShowcaseDemoFromFile Demo={SwitchNotificationsDemo} source={switchNotificationsSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Dimensions" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile Demo={SwitchSizesDemo} source={switchSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Disabled" description="Inactive switch.">
        <ShowcaseDemoFromFile Demo={SwitchDisabledDemo} source={switchDisabledSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="gloss — glass track and circle (prop gloss on the root).">
        <ShowcaseDemoFromFile Demo={SwitchGlossDemo} source={switchGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="Full customization of slots via classNames on root."
      >
        <ShowcaseDemoFromFile
          align="stretch"
          Demo={SwitchClassNamesFullDemo}
          source={switchClassNamesFullSource}
        />
        <ShowcaseDemoFromFile
          align="stretch"
          Demo={SwitchClassNamesSimpleLabelDemo}
          source={switchClassNamesSimpleLabelSource}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom Variations"
        description="Settings panel, compound Track and custom color — demo-files in `demos/switch/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={SwitchSettingsPanelDemo} source={switchSettingsPanelSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={SwitchCompoundThemeDemo} source={switchCompoundThemeSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={SwitchAccentColorDemo} source={switchAccentColorSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/Switch" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="label, hint, checked, onChange, disabled, gloss at the root - without children."
          />
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Switch.Label, Switch.Hint, Switch.Track — custom switch layout."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss="gloss">
          <p>
            Boolean <code>gloss</code> — glass track. Active state colors — CSS-topic variables.
            Animation thumb — <code>configureMotion()</code> (<code>switchThumbDuration</code>,{" "}
            <code>switchThumbEase</code>).
          </p>
        </ShowcaseDoc.Customization>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}

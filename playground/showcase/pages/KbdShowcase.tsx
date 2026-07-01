import { KbdClassNamesFullDemo } from "../demos/kbd/KbdClassNamesFull.demo";
import kbdClassNamesFullSource from "../demos/kbd/KbdClassNamesFull.demo.tsx?raw";
import { KbdGlossDemo } from "../demos/kbd/KbdGloss.demo";
import kbdGlossSource from "../demos/kbd/KbdGloss.demo.tsx?raw";
import { KbdVariantsDemo } from "../demos/kbd/KbdVariants.demo";
import kbdVariantsSource from "../demos/kbd/KbdVariants.demo.tsx?raw";
import { KbdSizesDemo } from "../demos/kbd/KbdSizes.demo";
import kbdSizesSource from "../demos/kbd/KbdSizes.demo.tsx?raw";
import { KbdGroupDemo } from "../demos/kbd/KbdGroup.demo";
import kbdGroupSource from "../demos/kbd/KbdGroup.demo.tsx?raw";
import { KbdShortcutsDemo } from "../demos/kbd/KbdShortcuts.demo";
import kbdShortcutsSource from "../demos/kbd/KbdShortcuts.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function KbdShowcase() {
  return (
    <ShowcasePage
      title="Kbd"
      description="Отображение клавиш и сочетаний — варианты как у Badge, без status."
      importPath='import { Kbd } from "@/components/core/Kbd";'
      tags={["core", "typography"]}
    >
      <ShowcaseSection title="Варианты" description="default, primary, secondary, outline, gloss.">
        <ShowcaseDemoFromFile Demo={KbdVariantsDemo} source={kbdVariantsSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Размеры" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile Demo={KbdSizesDemo} source={kbdSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description='variant="gloss" — стеклянная клавиша с hover-lift.'>
        <ShowcaseDemoFromFile Demo={KbdGlossDemo} source={kbdGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Kbd.Group" description="Несколько клавиш с разделителем «+».">
        <ShowcaseDemoFromFile Demo={KbdGroupDemo} source={kbdGroupSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Шорткаты" description="Kbd в кнопках и списках действий.">
        <ShowcaseDemoFromFile Demo={KbdShortcutsDemo} source={kbdShortcutsSource} />
      </ShowcaseSection>

      <ShowcaseSection title="classNames" description="Кастомизация слота root через classNames.">
        <ShowcaseDemoFromFile Demo={KbdClassNamesFullDemo} source={kbdClassNamesFullSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/core/Kbd" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="variant, size, hoverLift на корне. Kbd.Group — compound для сочетаний клавиш."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Кастомизация">
          <p>
            Слоты <code>classNames.root</code>, <code>classNames.group</code>,{" "}
            <code>classNames.separator</code>. Разделитель группы — prop <code>separator</code> (
            <code>null</code> скрывает).
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss='variant="gloss"' />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}

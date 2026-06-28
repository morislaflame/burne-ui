import { ButtonAsyncClickDemo } from "../demos/button/ButtonAsyncClick.demo";
import buttonAsyncClickSource from "../demos/button/ButtonAsyncClick.demo.tsx?raw";
import { ButtonCtaCardDemo } from "../demos/button/ButtonCtaCard.demo";
import buttonCtaCardSource from "../demos/button/ButtonCtaCard.demo.tsx?raw";
import { ButtonDangerBannerDemo } from "../demos/button/ButtonDangerBanner.demo";
import buttonDangerBannerSource from "../demos/button/ButtonDangerBanner.demo.tsx?raw";
import { ButtonFabClusterDemo } from "../demos/button/ButtonFabCluster.demo";
import buttonFabClusterSource from "../demos/button/ButtonFabCluster.demo.tsx?raw";
import { ButtonGlossDemo } from "../demos/button/ButtonGloss.demo";
import buttonGlossSource from "../demos/button/ButtonGloss.demo.tsx?raw";
import { ButtonSizesDemo } from "../demos/button/ButtonSizes.demo";
import buttonSizesSource from "../demos/button/ButtonSizes.demo.tsx?raw";
import { ButtonVariantsDemo } from "../demos/button/ButtonVariants.demo";
import buttonVariantsSource from "../demos/button/ButtonVariants.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function ButtonShowcase() {
  return (
    <ShowcasePage
      title="Button"
      description="Основная кнопка действия: варианты заливки, размеры, статусы, иконки, gloss и асинхронный клик."
      importPath='import { Button } from "@/components/core/Button";'
      tags={["core", "actions"]}
    >
      <ShowcaseSection title="Варианты" description="variant, status, disabled, иконки и встроенный ripple.">
        <ShowcaseDemoFromFile Demo={ButtonVariantsDemo} source={buttonVariantsSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Размеры" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile Demo={ButtonSizesDemo} source={buttonSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant gloss — стеклянная поверхность с motion и опциональным ripple.">
        <ShowcaseDemoFromFile Demo={ButtonGlossDemo} source={buttonGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Асинхронный клик"
        description="onAsyncClick возвращает Promise; ripple и состояния loading/success/error."
      >
        <ShowcaseDemoFromFile Demo={ButtonAsyncClickDemo} source={buttonAsyncClickSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Свой layout и палитра — один `.demo.tsx` на вариацию, код из ?raw."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={ButtonCtaCardDemo} source={buttonCtaCardSource} />
        <ShowcaseDemoFromFile Demo={ButtonFabClusterDemo} source={buttonFabClusterSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={ButtonDangerBannerDemo} source={buttonDangerBannerSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/core/Button" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="variant, size, status, leftIcon, iconOnly, ripple, onAsyncClick, disabled, variant gloss."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Ripple">
          <p>
            Проп <code>ripple</code> монтирует встроенный <code>&lt;Ripple /&gt;</code> с тоном под{" "}
            <code>variant</code>/<code>status</code>. Для кастомного слоя —{" "}
            <code>buttonRippleTone(variant, status)</code> из пакета.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Кастомизация">
          <p>
            Дополнительные стили — <code>className</code>. <code>variant=&quot;gloss&quot;</code> — стеклянная
            поверхность (токены <code>--color-surface</code>, <code>--color-border</code>). В{" "}
            <code>ButtonGroup</code> сегменты скругляются через контекст группы. Ripple и hover/press —{" "}
            <code>configureMotion()</code> и <code>buttonRippleTone(variant, status)</code> из пакета.
          </p>
        </ShowcaseDoc.Block>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}

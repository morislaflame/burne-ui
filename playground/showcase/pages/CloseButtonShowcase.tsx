import { CloseButtonFilterChipDemo } from "../demos/close-button/CloseButtonFilterChip.demo";
import closeButtonFilterChipSource from "../demos/close-button/CloseButtonFilterChip.demo.tsx?raw";
import { CloseButtonGlossDemo } from "../demos/close-button/CloseButtonGloss.demo";
import closeButtonGlossSource from "../demos/close-button/CloseButtonGloss.demo.tsx?raw";
import { CloseButtonInfoBannerDemo } from "../demos/close-button/CloseButtonInfoBanner.demo";
import closeButtonInfoBannerSource from "../demos/close-button/CloseButtonInfoBanner.demo.tsx?raw";
import { CloseButtonPreviewCardDemo } from "../demos/close-button/CloseButtonPreviewCard.demo";
import closeButtonPreviewCardSource from "../demos/close-button/CloseButtonPreviewCard.demo.tsx?raw";
import { CloseButtonSizesDemo } from "../demos/close-button/CloseButtonSizes.demo";
import closeButtonSizesSource from "../demos/close-button/CloseButtonSizes.demo.tsx?raw";
import { CloseButtonVariantsDemo } from "../demos/close-button/CloseButtonVariants.demo";
import closeButtonVariantsSource from "../demos/close-button/CloseButtonVariants.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function CloseButtonShowcase() {
  return (
    <ShowcasePage
      title="CloseButton"
      description="Компактная иконка закрытия с вариантами поверхности как у Button."
      importPath='import { CloseButton } from "@/components/core/CloseButton";'
      tags={["core", "actions"]}
    >
      <ShowcaseSection title="Варианты" description="default и outline.">
        <ShowcaseDemoFromFile Demo={CloseButtonVariantsDemo} source={closeButtonVariantsSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Размеры" description="size совпадает с Button: small … large.">
        <ShowcaseDemoFromFile Demo={CloseButtonSizesDemo} source={closeButtonSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="Стеклянная поверхность на тёмном фоне.">
        <ShowcaseDemoFromFile Demo={CloseButtonGlossDemo} source={closeButtonGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="CloseButton в реальных layout — демо в `demos/close-button/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={CloseButtonInfoBannerDemo} source={closeButtonInfoBannerSource} />
        <ShowcaseDemoFromFile Demo={CloseButtonPreviewCardDemo} source={closeButtonPreviewCardSource} />
        <ShowcaseDemoFromFile Demo={CloseButtonFilterChipDemo} source={closeButtonFilterChipSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/core/CloseButton" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="variant, size, aria-label (обязателен), onClick. Иконка IoClose встроена."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Кастомизация">
          <p>
            Варианты заливки совпадают с <code>Button</code> (без статусных тонов). Для диалогов и
            drawer размещайте в header с достаточной областью нажатия.
          </p>
        </ShowcaseDoc.Block>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}

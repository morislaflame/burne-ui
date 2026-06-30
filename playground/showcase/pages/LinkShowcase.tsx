import { LinkArticleInlineDemo } from "../demos/link/LinkArticleInline.demo";
import linkArticleInlineSource from "../demos/link/LinkArticleInline.demo.tsx?raw";
import { LinkCardActionsDemo } from "../demos/link/LinkCardActions.demo";
import linkCardActionsSource from "../demos/link/LinkCardActions.demo.tsx?raw";
import { LinkClassNamesFullDemo } from "../demos/link/LinkClassNamesFull.demo";
import linkClassNamesFullSource from "../demos/link/LinkClassNamesFull.demo.tsx?raw";
import { LinkFooterNavDemo } from "../demos/link/LinkFooterNav.demo";
import linkFooterNavSource from "../demos/link/LinkFooterNav.demo.tsx?raw";
import { LinkSizesDemo } from "../demos/link/LinkSizes.demo";
import linkSizesSource from "../demos/link/LinkSizes.demo.tsx?raw";
import { LinkVariantsDemo } from "../demos/link/LinkVariants.demo";
import linkVariantsSource from "../demos/link/LinkVariants.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function LinkShowcase() {
  return (
    <ShowcasePage
      title="Link"
      description="Стилизованные ссылки для внутренней и внешней навигации с иконками и подчёркиванием."
      importPath='import { Link } from "@/components/core/Link";'
      tags={["core", "navigation"]}
    >
      <ShowcaseSection title="Варианты" description="Внутренние, внешние ссылки и кастомизация иконок.">
        <ShowcaseDemoFromFile Demo={LinkVariantsDemo} source={linkVariantsSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Размеры" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile Demo={LinkSizesDemo} source={linkSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="Слоты motion, anchor, text, iconStart и iconEnd — через prop classNames."
      >
        <ShowcaseDemoFromFile align="center" Demo={LinkClassNamesFullDemo} source={linkClassNamesFullSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Подвал, inline-ссылки в тексте и действия карточки — `demos/link/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={LinkFooterNavDemo} source={linkFooterNavSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={LinkArticleInlineDemo} source={linkArticleInlineSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={LinkCardActionsDemo} source={linkCardActionsSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/core/Link" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="href, underline, leftIcon и showDefaultIcon на корне — основные пропы для ссылок."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Внешние ссылки">
          <p>
            <code>showDefaultIcon</code> добавляет иконку «открыть в новой вкладке». Для внешних URL используйте{" "}
            <code>target=&quot;_blank&quot;</code> и <code>rel=&quot;noreferrer&quot;</code>.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}

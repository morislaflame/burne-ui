import { AlertCompactStackDemo } from "../demos/alert/AlertCompactStack.demo";
import alertCompactStackSource from "../demos/alert/AlertCompactStack.demo.tsx?raw";
import { AlertClassNamesFullDemo } from "../demos/alert/AlertClassNamesFull.demo";
import alertClassNamesFullSource from "../demos/alert/AlertClassNamesFull.demo.tsx?raw";
import { AlertCompoundBannerDemo } from "../demos/alert/AlertCompoundBanner.demo";
import alertCompoundBannerSource from "../demos/alert/AlertCompoundBanner.demo.tsx?raw";
import { AlertGlossDemo } from "../demos/alert/AlertGloss.demo";
import alertGlossSource from "../demos/alert/AlertGloss.demo.tsx?raw";
import { AlertSizesDemo } from "../demos/alert/AlertSizes.demo";
import alertSizesSource from "../demos/alert/AlertSizes.demo.tsx?raw";
import { AlertStatusesDemo } from "../demos/alert/AlertStatuses.demo";
import alertStatusesSource from "../demos/alert/AlertStatuses.demo.tsx?raw";
import { AlertWithActionDemo } from "../demos/alert/AlertWithAction.demo";
import alertWithActionSource from "../demos/alert/AlertWithAction.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function AlertShowcase() {
  return (
    <ShowcasePage
      title="Alert"
      description="Информационные сообщения с заголовком, описанием и статусами."
      importPath='import { Alert } from "@/components/core/Alert";'
      tags={["core", "feedback"]}
    >
      <ShowcaseSection title="Статусы" description="title и description на корне — Simple API.">
        <ShowcaseDemoFromFile align="stretch" Demo={AlertStatusesDemo} source={alertStatusesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Размеры" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile align="stretch" Demo={AlertSizesDemo} source={alertSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="Стеклянная панель с hover-lift.">
        <ShowcaseDemoFromFile align="stretch" Demo={AlertGlossDemo} source={alertGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Action, стек уведомлений и compound-разметка — demo-файлы в `demos/alert/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={AlertClassNamesFullDemo} source={alertClassNamesFullSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={AlertWithActionDemo} source={alertWithActionSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={AlertCompactStackDemo} source={alertCompactStackSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={AlertCompoundBannerDemo} source={alertCompoundBannerSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/core/Alert" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="title, description, status, variant (в т.ч. gloss), size, icon, action на корне."
          />
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Message, Indicator, Content, Title, Description, Action — для сложной разметки."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Доступность">
          <p>
            Для <code>danger</code> и <code>warning</code> — <code>role=&quot;alert&quot;</code>. Auto-id
            для <code>aria-labelledby</code> / <code>aria-describedby</code>.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Следующий шаг">
          <p>
            Следующим шагом могу пройтись и унифицировать названия слотов (
            <code>root</code>/<code>content</code>/<code>message</code> и т.п.) в общем гайдлайне,
            чтобы одинаково назывались везде по киту.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}

import { AlertCompactStackDemo } from "../demos/alert/AlertCompactStack.demo";
import alertCompactStackSource from "../demos/alert/AlertCompactStack.demo.tsx?raw";
import { AlertCompoundBannerDemo } from "../demos/alert/AlertCompoundBanner.demo";
import alertCompoundBannerSource from "../demos/alert/AlertCompoundBanner.demo.tsx?raw";
import { AlertGlossDemo } from "../demos/alert/AlertGloss.demo";
import alertGlossSource from "../demos/alert/AlertGloss.demo.tsx?raw";
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

      <ShowcaseSection title="Gloss" description="Стеклянная панель с hover-lift.">
        <ShowcaseDemoFromFile align="stretch" Demo={AlertGlossDemo} source={alertGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Action, стек уведомлений и compound-разметка — demo-файлы в `demos/alert/`."
      >
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
            description="title, description, status, icon, action на корне."
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
      </ShowcaseDoc>
    </ShowcasePage>
  );
}

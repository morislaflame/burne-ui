import { ToastDeployPanelDemo } from "../demos/toast/ToastDeployPanel.demo";
import toastDeployPanelSource from "../demos/toast/ToastDeployPanel.demo.tsx?raw";
import { ToastGlossDemo } from "../demos/toast/ToastGloss.demo";
import toastGlossSource from "../demos/toast/ToastGloss.demo.tsx?raw";
import { ToastPromiseFlowDemo } from "../demos/toast/ToastPromiseFlow.demo";
import toastPromiseFlowSource from "../demos/toast/ToastPromiseFlow.demo.tsx?raw";
import { ToastStatusesDemo } from "../demos/toast/ToastStatuses.demo";
import toastStatusesSource from "../demos/toast/ToastStatuses.demo.tsx?raw";
import { ToastUndoActionDemo } from "../demos/toast/ToastUndoAction.demo";
import toastUndoActionSource from "../demos/toast/ToastUndoAction.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function ToastShowcase() {
  return (
    <ShowcasePage
      title="Toast"
      description="Императивные уведомления через useToast — стек до 3 видимых тостов."
      importPath='import { Toast, useToast } from "@/components/core/Toast";'
      tags={["core", "feedback"]}
    >
      <ShowcaseSection title="Статусы" description="toast.show с title, description и status.">
        <ShowcaseDemoFromFile Demo={ToastStatusesDemo} source={toastStatusesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant=&quot;gloss&quot; в toast.show — стеклянное уведомление.">
        <ShowcaseDemoFromFile Demo={ToastGlossDemo} source={toastGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Undo-action, панель деплоя и toast.promise — demo-файлы в `demos/toast/`."
      >
        <ShowcaseDemoFromFile Demo={ToastUndoActionDemo} source={toastUndoActionSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={ToastDeployPanelDemo} source={toastDeployPanelSource} />
        <ShowcaseDemoFromFile Demo={ToastPromiseFlowDemo} source={toastPromiseFlowSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/core/Toast" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="useToast() возвращает toast.show(). Toast.Provider оборачивает каталог приложения, не отдельную страницу."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Провайдер">
          <p>
            <code>Toast.Provider</code> должен быть выше по дереву (в layout каталога). Без него{" "}
            <code>useToast</code> не сможет отображать уведомления.
          </p>
        </ShowcaseDoc.Block>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}

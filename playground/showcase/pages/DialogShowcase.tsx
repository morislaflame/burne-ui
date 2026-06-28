import { DialogBasicDemo } from "../demos/dialog/DialogBasic.demo";
import dialogBasicSource from "../demos/dialog/DialogBasic.demo.tsx?raw";
import { DialogCompactConfirmDemo } from "../demos/dialog/DialogCompactConfirm.demo";
import dialogCompactConfirmSource from "../demos/dialog/DialogCompactConfirm.demo.tsx?raw";
import { DialogGlossDemo } from "../demos/dialog/DialogGloss.demo";
import dialogGlossSource from "../demos/dialog/DialogGloss.demo.tsx?raw";
import { DialogInviteTeamDemo } from "../demos/dialog/DialogInviteTeam.demo";
import dialogInviteTeamSource from "../demos/dialog/DialogInviteTeam.demo.tsx?raw";
import { DialogSettingsModalDemo } from "../demos/dialog/DialogSettingsModal.demo";
import dialogSettingsModalSource from "../demos/dialog/DialogSettingsModal.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function DialogShowcase() {
  return (
    <ShowcasePage
      title="Dialog"
      description="Модальное окно на нативном &lt;dialog&gt; с анимацией и compound API."
      importPath='import { Dialog } from "@/components/core/Dialog";'
      tags={["core", "overlay"]}
    >
      <ShowcaseSection title="Базовый диалог" description="open / onOpenChange, Header, Body, Footer.">
        <ShowcaseDemoFromFile Demo={DialogBasicDemo} source={dialogBasicSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant=&quot;gloss&quot; — стеклянная модальная панель.">
        <ShowcaseDemoFromFile Demo={DialogGlossDemo} source={dialogGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Приглашение в команду, настройки приватности и компактное подтверждение — `demos/dialog/`."
      >
        <ShowcaseDemoFromFile Demo={DialogInviteTeamDemo} source={dialogInviteTeamSource} />
        <ShowcaseDemoFromFile Demo={DialogSettingsModalDemo} source={dialogSettingsModalSource} />
        <ShowcaseDemoFromFile Demo={DialogCompactConfirmDemo} source={dialogCompactConfirmSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/core/Dialog" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Dialog.Header, Dialog.Body, Dialog.Footer, Dialog.Close — полная компоновка панели."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss>
          <p>
            <code>size</code> и <code>variant</code> на корне. Закрытие по Escape и клику на backdrop —
            настраиваемые пропы. Enter/leave — <code>configureMotion()</code>.
          </p>
        </ShowcaseDoc.Customization>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}

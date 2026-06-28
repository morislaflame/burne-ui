import { AlertDialogDeleteAccountDemo } from "../demos/alertDialog/AlertDialogDeleteAccount.demo";
import alertDialogDeleteAccountSource from "../demos/alertDialog/AlertDialogDeleteAccount.demo.tsx?raw";
import { AlertDialogGlossDemo } from "../demos/alertDialog/AlertDialogGloss.demo";
import alertDialogGlossSource from "../demos/alertDialog/AlertDialogGloss.demo.tsx?raw";
import { AlertDialogLogoutDemo } from "../demos/alertDialog/AlertDialogLogout.demo";
import alertDialogLogoutSource from "../demos/alertDialog/AlertDialogLogout.demo.tsx?raw";
import { AlertDialogStatusDemo } from "../demos/alertDialog/AlertDialogStatus.demo";
import alertDialogStatusSource from "../demos/alertDialog/AlertDialogStatus.demo.tsx?raw";
import { AlertDialogSizesDemo } from "../demos/alertDialog/AlertDialogSizes.demo";
import alertDialogSizesSource from "../demos/alertDialog/AlertDialogSizes.demo.tsx?raw";
import { AlertDialogUnsavedChangesDemo } from "../demos/alertDialog/AlertDialogUnsavedChanges.demo";
import alertDialogUnsavedChangesSource from "../demos/alertDialog/AlertDialogUnsavedChanges.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function AlertDialogShowcase() {
  return (
    <ShowcasePage
      title="AlertDialog"
      description="Диалог подтверждения с тоном status и блокировкой закрытия по backdrop."
      importPath='import { AlertDialog } from "@/components/composite/AlertDialog";'
      tags={["composite", "overlay"]}
    >
      <ShowcaseSection title="Статусы" description="status влияет на иконку и тон primary-кнопки.">
        <ShowcaseDemoFromFile Demo={AlertDialogStatusDemo} source={alertDialogStatusSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Размеры" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile Demo={AlertDialogSizesDemo} source={alertDialogSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant=&quot;gloss&quot; — стеклянная панель подтверждения.">
        <ShowcaseDemoFromFile Demo={AlertDialogGlossDemo} source={alertDialogGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Удаление аккаунта, несохранённые изменения и выход — `demos/alertDialog/`."
      >
        <ShowcaseDemoFromFile Demo={AlertDialogDeleteAccountDemo} source={alertDialogDeleteAccountSource} />
        <ShowcaseDemoFromFile Demo={AlertDialogUnsavedChangesDemo} source={alertDialogUnsavedChangesSource} />
        <ShowcaseDemoFromFile Demo={AlertDialogLogoutDemo} source={alertDialogLogoutSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/composite/AlertDialog" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="compound"
            description="AlertDialog.Header, AlertDialog.Footer — фиксированная структура подтверждения."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss>
          <p>
            Тон primary-кнопки — хелпер <code>primaryButtonVariantForAlertTone</code> из пакета.{" "}
            <code>status</code> на корне влияет на иконку и кнопку подтверждения.
          </p>
        </ShowcaseDoc.Customization>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}

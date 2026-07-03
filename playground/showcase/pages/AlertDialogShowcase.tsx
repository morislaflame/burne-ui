import { AlertDialogClassNamesFullDemo } from "../demos/alertDialog/AlertDialogClassNamesFull.demo";
import alertDialogClassNamesFullSource from "../demos/alertDialog/AlertDialogClassNamesFull.demo.tsx?raw";
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
      description="Confirmation dialog with tone status and blocking closing by backdrop."
      importPath='import { AlertDialog } from "@/components/composite/AlertDialog";'
      tags={["composite", "overlay"]}
    >
      <ShowcaseSection title="Statuses" description="status affects icon and tone primary-buttons.">
        <ShowcaseDemoFromFile Demo={AlertDialogStatusDemo} source={alertDialogStatusSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Dimensions" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile Demo={AlertDialogSizesDemo} source={alertDialogSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant=&quot;gloss&quot; — glass confirmation panel.">
        <ShowcaseDemoFromFile Demo={AlertDialogGlossDemo} source={alertDialogGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="Slot customization panel, header, title, description, footer through classNames."
      >
        <ShowcaseDemoFromFile
          Demo={AlertDialogClassNamesFullDemo}
          source={alertDialogClassNamesFullSource}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom Variations"
        description="Deleting an account, unsaved changes and exit — `demos/alertDialog/`."
      >
        <ShowcaseDemoFromFile Demo={AlertDialogDeleteAccountDemo} source={alertDialogDeleteAccountSource} />
        <ShowcaseDemoFromFile Demo={AlertDialogUnsavedChangesDemo} source={alertDialogUnsavedChangesSource} />
        <ShowcaseDemoFromFile Demo={AlertDialogLogoutDemo} source={alertDialogLogoutSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/composite/AlertDialog" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="compound"
            description="AlertDialog.Header, AlertDialog.Footer — fixed confirmation structure."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss>
          <p>
            Tone primary-buttons - helper <code>primaryButtonVariantForAlertTone</code> from the package.{" "}
            <code>status</code> fundamentally affects the icon and confirmation button.
          </p>
        </ShowcaseDoc.Customization>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}

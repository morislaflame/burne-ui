import { TextAreaBasicDemo } from "../demos/textarea/TextAreaBasic.demo";
import textAreaBasicSource from "../demos/textarea/TextAreaBasic.demo.tsx?raw";
import { TextAreaSizesDemo } from "../demos/textarea/TextAreaSizes.demo";
import textAreaSizesSource from "../demos/textarea/TextAreaSizes.demo.tsx?raw";
import { TextAreaCommentThreadDemo } from "../demos/textarea/TextAreaCommentThread.demo";
import textAreaCommentThreadSource from "../demos/textarea/TextAreaCommentThread.demo.tsx?raw";
import { TextAreaGlossDemo } from "../demos/textarea/TextAreaGloss.demo";
import textAreaGlossSource from "../demos/textarea/TextAreaGloss.demo.tsx?raw";
import { TextAreaReleaseNotesDemo } from "../demos/textarea/TextAreaReleaseNotes.demo";
import textAreaReleaseNotesSource from "../demos/textarea/TextAreaReleaseNotes.demo.tsx?raw";
import { TextAreaSupportTicketDemo } from "../demos/textarea/TextAreaSupportTicket.demo";
import textAreaSupportTicketSource from "../demos/textarea/TextAreaSupportTicket.demo.tsx?raw";
import { TextAreaWithErrorDemo } from "../demos/textarea/TextAreaWithError.demo";
import textAreaWithErrorSource from "../demos/textarea/TextAreaWithError.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function TextAreaShowcase() {
  return (
    <ShowcasePage
      title="TextArea"
      description="Многострочное поле ввода с тем же Simple API, что и Input."
      importPath='import { TextArea } from "@/components/core/TextArea";'
      tags={["core", "forms"]}
    >
      <ShowcaseSection title="Базовый" description="label, hint и rows на корне компонента.">
        <ShowcaseDemoFromFile align="center" Demo={TextAreaBasicDemo} source={textAreaBasicSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Размеры" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile align="center" Demo={TextAreaSizesDemo} source={textAreaSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="С ошибкой" description="status danger и prop error для сообщения валидации.">
        <ShowcaseDemoFromFile align="center" Demo={TextAreaWithErrorDemo} source={textAreaWithErrorSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant gloss — стеклянная оболочка с motion.">
        <ShowcaseDemoFromFile align="center" Demo={TextAreaGlossDemo} source={textAreaGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Release notes, support ticket и comment thread — demo-файлы в `demos/textarea/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={TextAreaReleaseNotesDemo} source={textAreaReleaseNotesSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={TextAreaSupportTicketDemo} source={textAreaSupportTicketSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={TextAreaCommentThreadDemo} source={textAreaCommentThreadSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/core/TextArea" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="label, hint, error, rows, placeholder и status — на корне TextArea."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Поведение">
          <p>
            Наследует визуальные variant и status от Input. Поддерживает controlled и uncontrolled режимы
            через value/defaultValue.
          </p>
        </ShowcaseDoc.Block>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}

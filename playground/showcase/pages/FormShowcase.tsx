import { FormInlineSubscribeDemo } from "../demos/form/FormInlineSubscribe.demo";
import formInlineSubscribeSource from "../demos/form/FormInlineSubscribe.demo.tsx?raw";
import { FormLoginPanelDemo } from "../demos/form/FormLoginPanel.demo";
import formLoginPanelSource from "../demos/form/FormLoginPanel.demo.tsx?raw";
import { FormMinimalSubscribeDemo } from "../demos/form/FormMinimalSubscribe.demo";
import formMinimalSubscribeSource from "../demos/form/FormMinimalSubscribe.demo.tsx?raw";
import { FormProfileDemo } from "../demos/form/FormProfile.demo";
import formProfileSource from "../demos/form/FormProfile.demo.tsx?raw";
import { FormSearchToolbarDemo } from "../demos/form/FormSearchToolbar.demo";
import formSearchToolbarSource from "../demos/form/FormSearchToolbar.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function FormShowcase() {
  return (
    <ShowcasePage
      title="Form"
      description="Обёртка формы с нативной отправкой и доступностью для групп полей."
      importPath='import { Form } from "@/components/composite/Form";'
      tags={["composite", "forms"]}
    >
      <ShowcaseSection
        title="Профиль"
        description="Form.Section группирует поля; CheckboxGroup — в отдельной секции с большим отступом."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={FormProfileDemo} source={formProfileSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Минимальная форма"
        description="Form принимает onSubmit и aria-label; кнопки действий размещаются внутри формы."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={FormMinimalSubscribeDemo} source={formMinimalSubscribeSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Inline-подписка, панель входа и поисковый toolbar — demo-файлы в `demos/form/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={FormInlineSubscribeDemo} source={formInlineSubscribeSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={FormLoginPanelDemo} source={formLoginPanelSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={FormSearchToolbarDemo} source={formSearchToolbarSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/composite/Form" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Section — группа полей с плотным gap-small внутри; Form задаёт gap-mid между секциями."
          />
          <ShowcaseDoc.ApiRow
            api="simple"
            description="Корневой Form — нативный &lt;form&gt; с onSubmit. Поля (Input, CheckboxGroup) вкладываются как children."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Связанные компоненты">
          <p>
            <code>Input</code>, <code>CheckboxGroup</code>, <code>Button</code> — импортируются отдельно и
            работают внутри Form через name/value.
          </p>
        </ShowcaseDoc.Block>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}

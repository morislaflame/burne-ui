import { FormInlineSubscribeDemo } from "../demos/form/FormInlineSubscribe.demo";
import formInlineSubscribeSource from "../demos/form/FormInlineSubscribe.demo.tsx?raw";
import { FormErrorSummaryDemo } from "../demos/form/FormErrorSummary.demo";
import formErrorSummarySource from "../demos/form/FormErrorSummary.demo.tsx?raw";
import { FormLoginPanelDemo } from "../demos/form/FormLoginPanel.demo";
import formLoginPanelSource from "../demos/form/FormLoginPanel.demo.tsx?raw";
import { FormMinimalSubscribeDemo } from "../demos/form/FormMinimalSubscribe.demo";
import formMinimalSubscribeSource from "../demos/form/FormMinimalSubscribe.demo.tsx?raw";
import { FormProfileDemo } from "../demos/form/FormProfile.demo";
import formProfileSource from "../demos/form/FormProfile.demo.tsx?raw";
import { FormSearchToolbarDemo } from "../demos/form/FormSearchToolbar.demo";
import formSearchToolbarSource from "../demos/form/FormSearchToolbar.demo.tsx?raw";
import { FormSizesDemo } from "../demos/form/FormSizes.demo";
import formSizesSource from "../demos/form/FormSizes.demo.tsx?raw";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function FormShowcase() {
  return (
    <ShowcasePage
      title="Form"
      description="Form wrapper with native submission and availability for field groups."
      importPath='import { Form } from "@/components/composite/Form";'
      tags={["composite", "forms"]}
    >
      <ShowcaseSection
        title="Profile"
        description="Form.Section groups fields; CheckboxGroup — in a separate section with a large indentation."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={FormProfileDemo} source={formProfileSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Sizes"
        description="size scales Form chrome (Header, Title, Description, Section, Actions). Input and Button keep their own size."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={FormSizesDemo} source={formSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Minimal form"
        description="Form accepts onSubmit and aria-label; action buttons are placed inside the form."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={FormMinimalSubscribeDemo} source={formMinimalSubscribeSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="ErrorSummary render prop"
        description="Form errorSummary / Form.ErrorSummary children — custom list of field errors."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={FormErrorSummaryDemo} source={formErrorSummarySource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom Variations"
        description="Inline-subscription, login panel and search toolbar — demo-files in `demos/form/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={FormInlineSubscribeDemo} source={formInlineSubscribeSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={FormLoginPanelDemo} source={formLoginPanelSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={FormSearchToolbarDemo} source={formSearchToolbarSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/composite/Form" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Header wraps Title + Description; Section groups fields; Actions for submit/cancel."
          />
          <ShowcaseDoc.ApiRow
            api="size"
            description="small | base | mid | large — Form chrome only. Set size on Input / Button explicitly."
          />
          <ShowcaseDoc.ApiRow
            api="simple"
            description="Root Form — native &lt;form&gt; with onSubmit. Fields (Input, CheckboxGroup) are invested as children."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Related Components">
          <p>
            <code>Input</code>, <code>CheckboxGroup</code>, <code>Button</code> — imported separately and
            work inside Form through name/value.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}

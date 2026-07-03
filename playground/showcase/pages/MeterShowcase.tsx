import { MeterClassNamesFullDemo } from "../demos/meter/MeterClassNamesFull.demo";
import meterClassNamesFullSource from "../demos/meter/MeterClassNamesFull.demo.tsx?raw";
import { MeterHorizontalDemo } from "../demos/meter/MeterHorizontal.demo";
import meterHorizontalSource from "../demos/meter/MeterHorizontal.demo.tsx?raw";
import { MeterSizesDemo } from "../demos/meter/MeterSizes.demo";
import meterSizesSource from "../demos/meter/MeterSizes.demo.tsx?raw";
import { MeterQuotaBannerDemo } from "../demos/meter/MeterQuotaBanner.demo";
import meterQuotaBannerSource from "../demos/meter/MeterQuotaBanner.demo.tsx?raw";
import { MeterStorageGridDemo } from "../demos/meter/MeterStorageGrid.demo";
import meterStorageGridSource from "../demos/meter/MeterStorageGrid.demo.tsx?raw";
import { MeterVerticalDemo } from "../demos/meter/MeterVertical.demo";
import meterVerticalSource from "../demos/meter/MeterVertical.demo.tsx?raw";
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function MeterShowcase() {
  return (
    <ShowcasePage
      title="Meter"
      description="Occupancy meter with min, max and displaying the value."
      importPath='import { Meter } from "@/components/core/Meter";'
      tags={["core", "feedback"]}
    >
      <ShowcaseSection title="Horizontal" description="label, value, showValue and color.">
        <ShowcaseDemoFromFile align="stretch" Demo={MeterHorizontalDemo} source={meterHorizontalSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Dimensions" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile align="stretch" Demo={MeterSizesDemo} source={meterSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Vertical" description="orientation=&quot;vertical&quot;.">
        <ShowcaseDemoFromFile Demo={MeterVerticalDemo} source={meterVerticalSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="Slots root, header, value, track, fill, hint and error — through prop classNames."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={MeterClassNamesFullDemo} source={meterClassNamesFullSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom Variations"
        description="Metrics grid and quota banner — demo-files in `demos/meter/`."
      >
        <ShowcaseDemoFromFile align="stretch" Demo={MeterStorageGridDemo} source={meterStorageGridSource} />
        <ShowcaseDemoFromFile align="stretch" Demo={MeterQuotaBannerDemo} source={meterQuotaBannerSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/Meter" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Meter.Header, Meter.Label, Meter.Value, Meter.Track, Meter.Hint, Meter.Error — compound-slots."
          />
          <ShowcaseDoc.ApiRow
            api="simple"
            description="label, value, min, max, showValue, orientation, color on the root."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="Difference from ProgressBar">
          <p>
            Meter — for the current level (disk, memory). ProgressBar — for a process with termination. Both support
            vertical orientation.
          </p>
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization />
      </ShowcaseDoc>
    </ShowcasePage>
  );
}

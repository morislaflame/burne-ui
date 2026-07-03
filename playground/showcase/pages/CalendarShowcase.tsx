import { CalendarBookingPanelDemo } from "../demos/calendar/CalendarBookingPanel.demo";
import calendarBookingPanelSource from "../demos/calendar/CalendarBookingPanel.demo.tsx?raw";
import { CalendarClassNamesFullDemo } from "../demos/calendar/CalendarClassNamesFull.demo";
import calendarClassNamesFullSource from "../demos/calendar/CalendarClassNamesFull.demo.tsx?raw";
import { CalendarCompoundLayoutDemo } from "../demos/calendar/CalendarCompoundLayout.demo";
import calendarCompoundLayoutSource from "../demos/calendar/CalendarCompoundLayout.demo.tsx?raw";
import { CalendarGlossDemo } from "../demos/calendar/CalendarGloss.demo";
import calendarGlossSource from "../demos/calendar/CalendarGloss.demo.tsx?raw";
import { CalendarInlineWidgetDemo } from "../demos/calendar/CalendarInlineWidget.demo";
import calendarInlineWidgetSource from "../demos/calendar/CalendarInlineWidget.demo.tsx?raw";
import { CalendarModesDemo } from "../demos/calendar/CalendarModes.demo";
import calendarModesSource from "../demos/calendar/CalendarModes.demo.tsx?raw";
import { CalendarSizesDemo } from "../demos/calendar/CalendarSizes.demo";
import calendarSizesSource from "../demos/calendar/CalendarSizes.demo.tsx?raw";
import { ShowcaseDemoFromFile } from "../layout/ShowcaseDemoFromFile";
import { ShowcaseDoc } from "../layout/ShowcaseDoc";
import { ShowcasePage } from "../layout/ShowcasePage";
import { ShowcaseSection } from "../layout/ShowcaseSection";

export function CalendarShowcase() {
  return (
    <ShowcasePage
      title="Calendar"
      description="Date picker: single, range, multiple dates and compound API with footer."
      importPath='import { Calendar } from "@/components/core/Calendar";'
      tags={["core", "forms"]}
    >
      <ShowcaseSection title="Selection Modes" description="mode: single, range, multiple and compound with Calendar.Footer.">
        <ShowcaseDemoFromFile align="start" Demo={CalendarModesDemo} source={calendarModesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Dimensions" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile align="start" Demo={CalendarSizesDemo} source={calendarSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant=&quot;gloss&quot; — glass calendar panel.">
        <ShowcaseDemoFromFile align="start" Demo={CalendarGlossDemo} source={calendarGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="classNames"
        description="Full customization of slots via classNames on root."
      >
        <ShowcaseDemoFromFile
          align="start"
          Demo={CalendarClassNamesFullDemo}
          source={calendarClassNamesFullSource}
        />
      </ShowcaseSection>

      <ShowcaseSection
        title="Custom Variations"
        description="Booking in Surface, compound layout and compact widget — `demos/calendar/`."
      >
        <ShowcaseDemoFromFile align="start" Demo={CalendarBookingPanelDemo} source={calendarBookingPanelSource} />
        <ShowcaseDemoFromFile align="start" Demo={CalendarCompoundLayoutDemo} source={calendarCompoundLayoutSource} />
        <ShowcaseDemoFromFile align="start" Demo={CalendarInlineWidgetDemo} source={calendarInlineWidgetSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Import">
          <ShowcaseDoc.Import path="@/components/core/Calendar" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="value / onValueChange on the root with prop mode."
          />
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Calendar.Header, Calendar.Grid, Calendar.Footer for custom layout."
          />
          <ShowcaseDoc.ApiRow
            api="compound"
            description="root, header, grid, dayCell, cell, cellFill, footer and other slots on root."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss>
          <p>
            Localization and restrictions — <code>minValue</code>, <code>maxValue</code>, <code>locale</code>.
            Fill selected cells — <code>configureMotion()</code> (<code>enableToggleButtonFill</code>).
          </p>
        </ShowcaseDoc.Customization>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}

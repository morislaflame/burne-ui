import { CalendarBookingPanelDemo } from "../demos/calendar/CalendarBookingPanel.demo";
import calendarBookingPanelSource from "../demos/calendar/CalendarBookingPanel.demo.tsx?raw";
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
import { ShowcaseDemoFromFile, ShowcaseDoc, ShowcasePage, ShowcaseSection } from "../layout";

export function CalendarShowcase() {
  return (
    <ShowcasePage
      title="Calendar"
      description="Выбор даты: одиночная, диапазон, несколько дат и compound API с футером."
      importPath='import { Calendar } from "@/components/core/Calendar";'
      tags={["core", "forms"]}
    >
      <ShowcaseSection title="Режимы выбора" description="mode: single, range, multiple и compound с Calendar.Footer.">
        <ShowcaseDemoFromFile align="start" Demo={CalendarModesDemo} source={calendarModesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Размеры" description="size: small, base, mid, large.">
        <ShowcaseDemoFromFile align="start" Demo={CalendarSizesDemo} source={calendarSizesSource} />
      </ShowcaseSection>

      <ShowcaseSection title="Gloss" description="variant=&quot;gloss&quot; — стеклянная панель календаря.">
        <ShowcaseDemoFromFile align="start" Demo={CalendarGlossDemo} source={calendarGlossSource} />
      </ShowcaseSection>

      <ShowcaseSection
        title="Кастомные вариации"
        description="Бронирование в Surface, compound layout и компактный виджет — `demos/calendar/`."
      >
        <ShowcaseDemoFromFile align="start" Demo={CalendarBookingPanelDemo} source={calendarBookingPanelSource} />
        <ShowcaseDemoFromFile align="start" Demo={CalendarCompoundLayoutDemo} source={calendarCompoundLayoutSource} />
        <ShowcaseDemoFromFile align="start" Demo={CalendarInlineWidgetDemo} source={calendarInlineWidgetSource} />
      </ShowcaseSection>

      <ShowcaseDoc>
        <ShowcaseDoc.Block title="Импорт">
          <ShowcaseDoc.Import path="@/components/core/Calendar" />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Block title="API">
          <ShowcaseDoc.ApiRow
            api="simple"
            description="value / onValueChange на корне с пропом mode."
          />
          <ShowcaseDoc.ApiRow
            api="compound"
            description="Calendar.Header, Calendar.Grid, Calendar.Footer для кастомной компоновки."
          />
        </ShowcaseDoc.Block>
        <ShowcaseDoc.Customization gloss>
          <p>
            Локализация и ограничения — <code>minValue</code>, <code>maxValue</code>, <code>locale</code>.
            Заливка выбранных ячеек — <code>configureMotion()</code> (<code>enableToggleButtonFill</code>).
          </p>
        </ShowcaseDoc.Customization>
      </ShowcaseDoc>
    </ShowcasePage>
  );
}

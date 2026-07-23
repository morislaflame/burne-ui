import type { ComponentType } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor } from "storybook/test";
import { IoArrowBack, IoArrowForward } from "react-icons/io5";

import { Calendar, useCalendar, type CalendarRangeValue, type CalendarSize, type CalendarVariant } from ".";

function CustomTitleLabel() {
  const { viewDate, view } = useCalendar();
  if (view === "years") {
    const start = Math.floor(viewDate.getFullYear() / 10) * 10;
    return (
      <span>
        {start}–{start + 9}
      </span>
    );
  }
  if (view === "months") {
    return <span>{viewDate.getFullYear()}</span>;
  }
  return (
    <span>
      {viewDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })}
    </span>
  );
}

// ─── decorator ───────────────────────────────────────────────────────────────

const decorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[24rem] w-full flex-col items-center justify-center gap-2xlarge p-2xlarge text-foreground"
      style={{ backgroundColor: "var(--color-background)" }}
    >
      <Story />
    </div>
  ),
];

// ─── meta ─────────────────────────────────────────────────────────────────────

const meta = {
  title: "Core Components/Calendar",
  component: Calendar,
  tags: ["autodocs"],
  decorators: decorator,
  parameters: {
    layout: "fullscreen",
    docs: {
      description: {
        component:
          "Calendar with three selection modes: single date, range, multiple dates. Supports view switching: days → months → years. Slots can be customized via `classNames` on root (`root`, `header`, `grid`, `dayCell`, `cell`, `footer`, etc.).",
      },
    },
  },
  argTypes: {
    variant: { control: "select", options: ["default", "secondary", "outline"] satisfies CalendarVariant[] },
    size:    { control: "select", options: ["small", "base", "mid", "large"] satisfies CalendarSize[] },
    mode:    { control: "select", options: ["single", "range", "multiple"] },
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

// ─── helpers ─────────────────────────────────────────────────────────────────

function formatDate(d: Date | null | undefined): string {
  if (!d) return "—";
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" });
}

// ─── stories ─────────────────────────────────────────────────────────────────

export const Single: Story = {
  name: "Single selection",
  render: function SingleStory() {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <div className="flex flex-col items-center gap-large">
        <Calendar mode="single" value={date} onValueChange={setDate} />
        <p className="text-small text-muted">
          Selected: <span className="font-medium text-foreground">{formatDate(date)}</span>
        </p>
      </div>
    );
  },
};

export const Range: Story = {
  name: "Date range",
  render: function RangeStory() {
    const [range, setRange] = useState<CalendarRangeValue>({ start: null, end: null });
    return (
      <div className="flex flex-col items-center gap-large">
        <Calendar mode="range" value={range} onValueChange={setRange} />
        <p className="text-small text-muted">
          From{" "}
          <span className="font-medium text-foreground">{formatDate(range.start)}</span>
          {" "}to{" "}
          <span className="font-medium text-foreground">{formatDate(range.end)}</span>
        </p>
      </div>
    );
  },
};

export const Multiple: Story = {
  name: "Multiple selection",
  render: function MultipleStory() {
    const [dates, setDates] = useState<Date[]>([]);
    return (
      <div className="flex flex-col items-center gap-large">
        <Calendar mode="multiple" value={dates} onValueChange={setDates} />
        <p className="text-small text-muted">
          Selected:{" "}
          <span className="font-medium text-foreground">
            {dates.length > 0 ? dates.map((d) => formatDate(d)).join(", ") : "—"}
          </span>
        </p>
      </div>
    );
  },
};

export const WithFooter: Story = {
  name: "With Today and Clear buttons",
  render: function WithFooterStory() {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <div className="flex flex-col items-center gap-large">
        <Calendar mode="single" value={date} onValueChange={setDate}>
          <Calendar.Header />
          <Calendar.Grid />
          <Calendar.Footer />
        </Calendar>
        <p className="text-small text-muted">
          Selected: <span className="font-medium text-foreground">{formatDate(date)}</span>
        </p>
      </div>
    );
  },
  play: async ({ canvas, userEvent }) => {
    const today = new Date();
    await userEvent.click(canvas.getByRole("button", { name: "Today" }));
    await waitFor(() => {
      expect(canvas.getByText("Selected:").parentElement?.textContent).toContain(
        String(today.getDate()),
      );
    });
  },
};

export const RangeWithFooter: Story = {
  name: "Range with footer",
  render: function RangeWithFooterStory() {
    const [range, setRange] = useState<CalendarRangeValue>({ start: null, end: null });
    return (
      <div className="flex flex-col items-center gap-large">
        <Calendar mode="range" value={range} onValueChange={setRange}>
          <Calendar.Header />
          <Calendar.Grid />
          <Calendar.Footer />
        </Calendar>
        <p className="text-small text-muted">
          From{" "}
          <span className="font-medium text-foreground">{formatDate(range.start)}</span>
          {" "}to{" "}
          <span className="font-medium text-foreground">{formatDate(range.end)}</span>
        </p>
      </div>
    );
  },
};

export const StartFromMonthView: Story = {
  name: "Open from month picker",
  render: function MonthViewStory() {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <div className="flex flex-col items-center gap-large">
        <Calendar mode="single" value={date} onValueChange={setDate} initialView="months" />
        <p className="text-small text-muted">
          Selected: <span className="font-medium text-foreground">{formatDate(date)}</span>
        </p>
      </div>
    );
  },
};

export const StartFromYearView: Story = {
  name: "Open from year picker",
  render: function YearViewStory() {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <div className="flex flex-col items-center gap-large">
        <Calendar mode="single" value={date} onValueChange={setDate} initialView="years" />
        <p className="text-small text-muted">
          Selected: <span className="font-medium text-foreground">{formatDate(date)}</span>
        </p>
      </div>
    );
  },
};

export const WithMinMax: Story = {
  name: "With date limits (min/max)",
  render: function WithMinMaxStory() {
    const today = new Date();
    const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5);
    const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10);
    const [date, setDate] = useState<Date | null>(null);
    return (
      <div className="flex flex-col items-center gap-large">
        <Calendar
          mode="single"
          value={date}
          onValueChange={setDate}
          minDate={minDate}
          maxDate={maxDate}
        />
        <p className="text-small text-muted">
          Available: {formatDate(minDate)} — {formatDate(maxDate)}
        </p>
      </div>
    );
  },
};

export const Variants: Story = {
  name: "Style variants",
  render: function VariantsStory() {
    const variants: CalendarVariant[] = ["default", "secondary", "outline"];
    return (
      <div className="flex flex-wrap items-start justify-center gap-xlarge">
        {variants.map((variant) => (
          <div key={variant} className="flex flex-col items-center gap-small">
            <span className="text-small text-muted">{variant}</span>
            <Calendar key={variant} mode="single" variant={variant} />
          </div>
        ))}
      </div>
    );
  },
};

export const Sizes: Story = {
  name: "Sizes",
  render: function SizesStory() {
    const sizes: CalendarSize[] = ["small", "base", "mid", "large"];
    return (
      <div className="flex flex-wrap items-start justify-center gap-xlarge">
        {sizes.map((size) => (
          <div key={size} className="flex flex-col items-center gap-small">
            <span className="text-small text-muted">{size}</span>
            <Calendar mode="single" size={size} />
          </div>
        ))}
      </div>
    );
  },
};

export const Uncontrolled: Story = {
  name: "Uncontrolled (defaultValue)",
  render: () => {
    const today = new Date();
    const defaultDate = new Date(today.getFullYear(), today.getMonth(), 15);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const props: any = { mode: "single", defaultValue: defaultDate };
    return <Calendar {...props} />;
  },
};

export const CustomClassNames: Story = {
  name: "Full classNames customization",
  parameters: {
    docs: {
      description: {
        story: "classNames customization for Calendar",
      },
    },
  },
  render: () => (
    <Calendar
      mode="range"
      classNames={{
        root: "rounded-large border-primary/30 bg-primary/5 shadow-token-mid",
        header: "gap-small",
        navPrev: "text-primary",
        navNext: "text-primary",
        navIcon: "icon-small",
        headerTitle: "font-semibold text-primary",
        grid: "mt-small",
        weekdayCell: "text-primary/70 uppercase tracking-wide",
        dayEmpty: "opacity-30",
        dayCell: "rounded-full",
        cellFill: "rounded-full bg-primary",
        rangeHalfFill: "bg-primary/15",
        footer: "border-primary/20",
        footerToday: "text-primary",
        footerClear: "font-medium",
      }}
    >
      <Calendar.Header />
      <Calendar.Grid />
      <Calendar.Footer />
    </Calendar>
  ),
};

export const CustomNavIcons: Story = {
  name: "Custom nav icons",
  parameters: {
    docs: {
      description: {
        story:
          "`navPrevIcon` / `navNextIcon` on root replace default chevrons. Pass `null` to hide. Slot `classNames.navIcon` styles the default icons.",
      },
    },
  },
  render: () => (
    <Calendar
      mode="single"
      navPrevIcon={<IoArrowBack aria-hidden className="icon-xsmall text-primary" />}
      navNextIcon={<IoArrowForward aria-hidden className="icon-xsmall text-primary" />}
    />
  ),
};

export const RenderDay: Story = {
  name: "renderDay — event badges",
  parameters: {
    docs: {
      description: {
        story:
          "`renderDay(date, state)` customizes day cell content (e.g. event dots). `Calendar.Day` is also exported for compound use.",
      },
    },
  },
  render: function RenderDayStory() {
    const eventDays = new Set([3, 12, 18, 25]);
    return (
      <Calendar
        mode="single"
        renderDay={(date, { day, selected }) => (
          <span className="relative inline-flex flex-col items-center gap-[2px]">
            <span>{day}</span>
            {eventDays.has(date.getDate()) ? (
              <span
                aria-hidden
                className={
                  selected
                    ? "h-1 w-1 rounded-full bg-primary-foreground"
                    : "h-1 w-1 rounded-full bg-primary"
                }
              />
            ) : null}
          </span>
        )}
      />
    );
  },
};

export const CustomHeaderNav: Story = {
  name: "Compound Header (Title / Nav)",
  parameters: {
    docs: {
      description: {
        story:
          "`Calendar.Header` accepts children. Rebuild order with `NavPrev` / `Title` / `NavNext`. `Title` children replace the default formatted label.",
      },
    },
  },
  render: function CustomHeaderNavStory() {
    return (
      <Calendar mode="single">
        <Calendar.Header>
          <Calendar.NavNext />
          <Calendar.Title className="font-semibold text-primary" />
          <Calendar.NavPrev />
        </Calendar.Header>
        <Calendar.Grid />
      </Calendar>
    );
  },
};

export const CustomTitleFormat: Story = {
  name: "Custom Title format",
  parameters: {
    docs: {
      description: {
        story: "`Calendar.Title` children override the default month/year label.",
      },
    },
  },
  render: function CustomTitleFormatStory() {
    return (
      <Calendar mode="single">
        <Calendar.Header>
          <Calendar.NavPrev />
          <Calendar.Title>
            <CustomTitleLabel />
          </Calendar.Title>
          <Calendar.NavNext />
        </Calendar.Header>
        <Calendar.Grid />
      </Calendar>
    );
  },
};

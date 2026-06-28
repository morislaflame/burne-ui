import type { ComponentType } from "react";
import { useState } from "react";
import type { Meta, StoryObj } from "@storybook/react-vite";
import { expect, waitFor } from "storybook/test";

import { Calendar, type CalendarRangeValue, type CalendarSize, type CalendarVariant } from ".";

// ─── decorator ───────────────────────────────────────────────────────────────

const decorator = [
  (Story: ComponentType) => (
    <div
      className="box-border flex min-h-[24rem] w-full flex-col items-center justify-center gap-xlarge p-xlarge text-foreground"
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
          "Календарь с тремя режимами выбора: одна дата, диапазон, несколько дат. Поддерживает переключение вида: дни → месяцы → годы.",
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
  name: "Одиночный выбор",
  render: function SingleStory() {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <div className="flex flex-col items-center gap-mid">
        <Calendar mode="single" value={date} onValueChange={setDate} />
        <p className="text-small text-muted">
          Выбрано: <span className="font-medium text-foreground">{formatDate(date)}</span>
        </p>
      </div>
    );
  },
};

export const Range: Story = {
  name: "Диапазон дат",
  render: function RangeStory() {
    const [range, setRange] = useState<CalendarRangeValue>({ start: null, end: null });
    return (
      <div className="flex flex-col items-center gap-mid">
        <Calendar mode="range" value={range} onValueChange={setRange} />
        <p className="text-small text-muted">
          От{" "}
          <span className="font-medium text-foreground">{formatDate(range.start)}</span>
          {" "}до{" "}
          <span className="font-medium text-foreground">{formatDate(range.end)}</span>
        </p>
      </div>
    );
  },
};

export const Multiple: Story = {
  name: "Множественный выбор",
  render: function MultipleStory() {
    const [dates, setDates] = useState<Date[]>([]);
    return (
      <div className="flex flex-col items-center gap-mid">
        <Calendar mode="multiple" value={dates} onValueChange={setDates} />
        <p className="text-small text-muted">
          Выбрано:{" "}
          <span className="font-medium text-foreground">
            {dates.length > 0 ? dates.map((d) => formatDate(d)).join(", ") : "—"}
          </span>
        </p>
      </div>
    );
  },
};

export const WithFooter: Story = {
  name: "С кнопками «Сегодня» и «Очистить»",
  render: function WithFooterStory() {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <div className="flex flex-col items-center gap-mid">
        <Calendar mode="single" value={date} onValueChange={setDate}>
          <Calendar.Header />
          <Calendar.Grid />
          <Calendar.Footer />
        </Calendar>
        <p className="text-small text-muted">
          Выбрано: <span className="font-medium text-foreground">{formatDate(date)}</span>
        </p>
      </div>
    );
  },
  play: async ({ canvas, userEvent }) => {
    const today = new Date();
    await userEvent.click(canvas.getByRole("button", { name: "Сегодня" }));
    await waitFor(() => {
      expect(canvas.getByText("Выбрано:").parentElement?.textContent).toContain(
        String(today.getDate()),
      );
    });
  },
};

export const RangeWithFooter: Story = {
  name: "Диапазон с подвалом",
  render: function RangeWithFooterStory() {
    const [range, setRange] = useState<CalendarRangeValue>({ start: null, end: null });
    return (
      <div className="flex flex-col items-center gap-mid">
        <Calendar mode="range" value={range} onValueChange={setRange}>
          <Calendar.Header />
          <Calendar.Grid />
          <Calendar.Footer />
        </Calendar>
        <p className="text-small text-muted">
          От{" "}
          <span className="font-medium text-foreground">{formatDate(range.start)}</span>
          {" "}до{" "}
          <span className="font-medium text-foreground">{formatDate(range.end)}</span>
        </p>
      </div>
    );
  },
};

export const StartFromMonthView: Story = {
  name: "Открыть с выбора месяца",
  render: function MonthViewStory() {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <div className="flex flex-col items-center gap-mid">
        <Calendar mode="single" value={date} onValueChange={setDate} initialView="months" />
        <p className="text-small text-muted">
          Выбрано: <span className="font-medium text-foreground">{formatDate(date)}</span>
        </p>
      </div>
    );
  },
};

export const StartFromYearView: Story = {
  name: "Открыть с выбора года",
  render: function YearViewStory() {
    const [date, setDate] = useState<Date | null>(null);
    return (
      <div className="flex flex-col items-center gap-mid">
        <Calendar mode="single" value={date} onValueChange={setDate} initialView="years" />
        <p className="text-small text-muted">
          Выбрано: <span className="font-medium text-foreground">{formatDate(date)}</span>
        </p>
      </div>
    );
  },
};

export const WithMinMax: Story = {
  name: "С ограничением дат (min/max)",
  render: function WithMinMaxStory() {
    const today = new Date();
    const minDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 5);
    const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 10);
    const [date, setDate] = useState<Date | null>(null);
    return (
      <div className="flex flex-col items-center gap-mid">
        <Calendar
          mode="single"
          value={date}
          onValueChange={setDate}
          minDate={minDate}
          maxDate={maxDate}
        />
        <p className="text-small text-muted">
          Доступно: {formatDate(minDate)} — {formatDate(maxDate)}
        </p>
      </div>
    );
  },
};

export const Variants: Story = {
  name: "Варианты оформления",
  render: function VariantsStory() {
    const variants: CalendarVariant[] = ["default", "secondary", "outline"];
    return (
      <div className="flex flex-wrap items-start justify-center gap-large">
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
  name: "Размеры",
  render: function SizesStory() {
    const sizes: CalendarSize[] = ["small", "base", "mid", "large"];
    return (
      <div className="flex flex-wrap items-start justify-center gap-large">
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
  name: "Неконтролируемый (defaultValue)",
  render: () => {
    const today = new Date();
    const defaultDate = new Date(today.getFullYear(), today.getMonth(), 15);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const props: any = { mode: "single", defaultValue: defaultDate };
    return <Calendar {...props} />;
  },
};

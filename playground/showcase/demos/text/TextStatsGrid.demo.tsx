import { Text } from "@/components/core/Text";

const STATS = [
  { label: "Пользователи", value: "12.4k" },
  { label: "Конверсия", value: "3.8%" },
  { label: "Uptime", value: "99.9%" },
] as const;

export function TextStatsGridDemo() {
  return (
    <div className="grid w-full max-w-md grid-cols-3 gap-small rounded-mid bg-secondary p-mid">
      {STATS.map((stat) => (
        <div key={stat.label} className="flex flex-col gap-xsmall text-center">
          <Text as="span" variant="header-2" className="tabular-nums text-primary">
            {stat.value}
          </Text>
          <Text as="span" variant="tools" className="text-muted">
            {stat.label}
          </Text>
        </div>
      ))}
    </div>
  );
}

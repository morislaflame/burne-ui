import { TimeField } from "@/components/core/TimeField";

export function TimeFieldSizesDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-small">
      <TimeField size="small" label="Small" defaultValue="09:00" />
      <TimeField size="base" label="Base" defaultValue="09:30" />
      <TimeField size="mid" label="Mid" defaultValue="10:00" />
      <TimeField size="large" label="Large" defaultValue="10:30" />
    </div>
  );
}

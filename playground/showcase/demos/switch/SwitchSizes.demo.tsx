import { Switch } from "@/components/core/Switch";

export function SwitchSizesDemo() {
  return (
    <div className="flex flex-wrap items-center gap-mid">
      <Switch size="small" defaultChecked label="Small" />
      <Switch size="base" defaultChecked label="Base" />
      <Switch size="mid" defaultChecked label="Mid" />
      <Switch size="large" defaultChecked label="Large" />
    </div>
  );
}

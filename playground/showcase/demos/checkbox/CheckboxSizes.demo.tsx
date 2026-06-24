import { Checkbox } from "@/components/core/Checkbox";

export function CheckboxSizesDemo() {
  return (
    <div className="flex flex-wrap items-center gap-mid">
      <Checkbox size="small" defaultChecked label="Small" />
      <Checkbox size="base" defaultChecked label="Base" />
      <Checkbox size="mid" defaultChecked label="Mid" />
      <Checkbox size="large" defaultChecked label="Large" />
      <Checkbox disabled label="Disabled" />
    </div>
  );
}

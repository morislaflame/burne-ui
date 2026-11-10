import { ComboBox } from "@/components/core/ComboBox";

const options = [
  { value: "react", label: "React" },
  { value: "svelte", label: "Svelte" },
  { value: "vue", label: "Vue" },
];

export function ComboBoxMotionInstantHoverDemo() {
  return (
    <ComboBox
      className="w-64"
      label="Instant hover"
      items={options}
      defaultValue="react"
      hint="shell.hoverIn / hoverOut: false"
      motion={{
        shell: { hoverIn: false, hoverOut: false },
      }}
    />
  );
}

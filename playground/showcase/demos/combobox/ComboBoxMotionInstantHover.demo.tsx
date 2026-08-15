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
      options={options}
      defaultValue="react"
      hint="inputGroup.hoverIn / hoverOut: false"
      motion={{
        inputGroup: { hoverIn: false, hoverOut: false },
      }}
    />
  );
}

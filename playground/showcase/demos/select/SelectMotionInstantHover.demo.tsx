import { Select } from "@/components/core/Select";

const options = [
  { value: "react", label: "React" },
  { value: "svelte", label: "Svelte" },
  { value: "vue", label: "Vue" },
];

export function SelectMotionInstantHoverDemo() {
  return (
    <Select
      className="w-64"
      label="Instant hover"
      options={options}
      defaultValue="react"
      hint="triggerGroup.hoverIn / hoverOut: false"
      motion={{
        triggerGroup: { hoverIn: false, hoverOut: false },
      }}
    />
  );
}

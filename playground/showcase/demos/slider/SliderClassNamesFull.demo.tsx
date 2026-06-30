import { Slider } from "@/components/core/Slider";

export function SliderClassNamesFullDemo() {
  return (
    <Slider
      defaultValue={62}
      min={0}
      max={100}
      gloss
      classNames={{
        root: "max-w-md rounded-mid border border-info/25 p-base",
        value: "text-info font-semibold",
        track: "ring-1 ring-info/20",
        rail: "bg-info/10",
        fill: "bg-info",
        thumbShell: "ring-info/30",
        hint: "text-muted/80",
      }}
    >
      <Slider.Header>
        <Slider.Label>Яркость</Slider.Label>
        <Slider.Value />
      </Slider.Header>
      <Slider.Track />
      <Slider.Hint>Настройка слотов через classNames на root.</Slider.Hint>
    </Slider>
  );
}

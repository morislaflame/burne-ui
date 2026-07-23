import { useState } from "react";

import { ColorPicker, ColorSlider, useColorPicker } from "@/components/core/ColorPicker";
import { Text } from "@/components/core/Text";

function HueOnlySlider() {
  const { hsva, setHsva } = useColorPicker();
  return (
    <ColorSlider.Track
      channel="hue"
      color={hsva}
      value={hsva.h}
      size="base"
      onValueChange={(h) => setHsva({ ...hsva, h })}
    />
  );
}

/** Presets above area, no hex — custom Content children. */
export function ColorPickerCompoundContentDemo() {
  const [color, setColor] = useState("#22c55e");

  return (
    <div className="flex flex-col items-center gap-large">
      <Text as="p" variant="small" className="text-muted">
        Custom layout: presets → area → hue (hex removed).
      </Text>
      <ColorPicker value={color} onValueChange={setColor} defaultOpen>
        <ColorPicker.Trigger />
        <ColorPicker.Content className="min-w-[16rem]">
          <ColorPicker.Presets
            presets={["#22c55e", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6"]}
            className="border-t-0 border-b-token pb-small pt-0"
          />
          <ColorPicker.Area />
          <HueOnlySlider />
        </ColorPicker.Content>
      </ColorPicker>
      <Text as="p" variant="small" className="font-mono text-muted">
        {color}
      </Text>
    </div>
  );
}

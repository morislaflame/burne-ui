import { useState } from "react";

import { ColorPicker } from "@/components/core/ColorPicker";
import { Text } from "@/components/core/Text";

const SIZES = ["small", "base", "mid"] as const;

export function ColorPickerSizesDemo() {
  const [small, setSmall] = useState("#3b82f6");
  const [base, setBase] = useState("#22c55e");
  const [mid, setMid] = useState("#f59e0b");

  const values = { small, base, mid } as const;
  const setters = { small: setSmall, base: setBase, mid: setMid } as const;

  return (
    <div className="flex flex-wrap items-center gap-mid">
      {SIZES.map((size) => (
        <div key={size} className="flex flex-col items-center gap-xsmall">
          <ColorPicker size={size} value={values[size]} onValueChange={setters[size]}>
            <ColorPicker.Trigger />
            <ColorPicker.Content />
          </ColorPicker>
          <Text as="span" variant="xsmall" className="text-muted">
            {size}
          </Text>
        </div>
      ))}
    </div>
  );
}

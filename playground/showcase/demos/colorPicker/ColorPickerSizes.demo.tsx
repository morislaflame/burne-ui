import { useState } from "react";

import { ColorPicker } from "@/components/core/ColorPicker";
import { Text } from "@/components/core/Text";

const SIZES = ["small", "base", "mid", "large"] as const;

export function ColorPickerSizesDemo() {
  const [small, setSmall] = useState("#3b82f6");
  const [base, setBase] = useState("#22c55e");
  const [mid, setMid] = useState("#f59e0b");
  const [large, setLarge] = useState("#ec4899");

  const values = { small, base, mid, large } as const;
  const setters = {
    small: setSmall,
    base: setBase,
    mid: setMid,
    large: setLarge,
  } as const;

  return (
    <div className="flex flex-wrap items-end justify-center gap-2xlarge py-large">
      {SIZES.map((size) => (
        <div key={size} className="flex flex-col items-center gap-xsmall">
          <Text as="span" variant="xsmall" className="capitalize text-muted">
            {size}
          </Text>
          <ColorPicker
            size={size}
            value={values[size]}
            onValueChange={setters[size]}
          >
            <ColorPicker.Trigger />
            <ColorPicker.Content />
          </ColorPicker>
        </div>
      ))}
    </div>
  );
}

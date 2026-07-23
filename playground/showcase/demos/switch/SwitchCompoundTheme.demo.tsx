import { IoMoon, IoSunny } from "react-icons/io5";

import { Switch } from "@/components/core/Switch";
import { Text } from "@/components/core/Text";

export function SwitchCompoundThemeDemo() {
  return (
    <div className="flex w-full max-w-sm flex-col gap-large">
      <Text as="p" variant="small" className="font-medium">
        Theme
      </Text>
      <Switch>
        <Switch.Control defaultChecked>
          <Switch.Track size="mid">
            <Switch.Fill />
            <Switch.Thumb>
              <Switch.Icon when="off">
                <IoMoon aria-hidden className="size-full" />
              </Switch.Icon>
              <Switch.Icon when="on">
                <IoSunny aria-hidden className="size-full" />
              </Switch.Icon>
            </Switch.Thumb>
          </Switch.Track>
        </Switch.Control>
        <Switch.Content>
          <Switch.Label>Dark theme</Switch.Label>
          <Switch.Hint>Switch.Track, Thumb and Icon — compound API.</Switch.Hint>
        </Switch.Content>
      </Switch>
    </div>
  );
}

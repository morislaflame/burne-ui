import { IoShieldCheckmark } from "react-icons/io5";

import { Checkbox } from "@/components/core/Checkbox";
import { Text } from "@/components/core/Text";

export function CheckboxIndicatorCompoundDemo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-mid">
      <Text as="p" variant="small" className="font-medium">
        Compound: Fill + Mark
      </Text>
      <Checkbox variant="outline" defaultChecked>
        <Checkbox.Control>
          <Checkbox.Indicator classNames={{ root: "rounded-mid" }}>
            <Checkbox.Indicator.Fill/>
            <Checkbox.Indicator.Mark>
              <IoShieldCheckmark aria-hidden />
            </Checkbox.Indicator.Mark>
          </Checkbox.Indicator>
        </Checkbox.Control>
        <Checkbox.Content>
          <Checkbox.Label>2FA</Checkbox.Label>
          <Checkbox.Hint>
            Square indicator through compound Fill/Mark and rounded-mid on shell.
          </Checkbox.Hint>
        </Checkbox.Content>
      </Checkbox>
    </div>
  );
}

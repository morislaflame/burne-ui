import { Checkbox } from "@/components/core/Checkbox";
import { Text } from "@/components/core/Text";

export function CheckboxIndicatorShapeDemo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-mid">
      <Text as="p" variant="small" className="font-medium">
        Indicator shape
      </Text>
      <div className="flex flex-wrap items-start gap-xlarge">
        <Checkbox size="large" defaultChecked label="Round (default)" />
        <Checkbox size="large" defaultChecked>
          <Checkbox.Control>
            <Checkbox.Indicator
              classNames={{
                shell: "rounded-mid",
                fill: "rounded-base",
              }}
            />
          </Checkbox.Control>
          <Checkbox.Content>
            <Checkbox.Label>rounded-mid</Checkbox.Label>
            <Checkbox.Hint>
              classNames.shell + fill with rounded-[inherit] — the filling follows the shape of the shell.
            </Checkbox.Hint>
          </Checkbox.Content>
        </Checkbox>
      </div>
    </div>
  );
}

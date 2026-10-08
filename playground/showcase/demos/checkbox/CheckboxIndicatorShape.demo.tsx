import { Checkbox } from "@/components/core/Checkbox";
import { Text } from "@/components/core/Text";

export function CheckboxIndicatorShapeDemo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-large">
      <Text as="p" variant="small" className="font-medium">
        Indicator shape
      </Text>
      <div className="flex flex-wrap items-start gap-2xlarge">
        <Checkbox size="large" defaultChecked label="Round (default)" />
        <Checkbox size="large" defaultChecked>
          <Checkbox.Control>
            <Checkbox.Indicator
              classNames={{
                root: "rounded-large",
              }}
            />
          </Checkbox.Control>
          <Checkbox.Content>
            <Checkbox.Label>rounded-large</Checkbox.Label>
            <Checkbox.Hint>
              classNames.root with rounded-large — fill follows via rounded-[inherit].
            </Checkbox.Hint>
          </Checkbox.Content>
        </Checkbox>
      </div>
    </div>
  );
}

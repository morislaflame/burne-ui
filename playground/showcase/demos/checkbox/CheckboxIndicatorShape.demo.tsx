import { Checkbox } from "@/components/core/Checkbox";
import { Text } from "@/components/core/Text";

export function CheckboxIndicatorShapeDemo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-mid">
      <Text as="p" variant="small" className="font-medium">
        Форма индикатора
      </Text>
      <div className="flex flex-wrap items-start gap-xlarge">
        <Checkbox size="large" defaultChecked label="Круглый (default)" />
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
              classNames.shell + fill с rounded-[inherit] — заливка повторяет форму оболочки.
            </Checkbox.Hint>
          </Checkbox.Content>
        </Checkbox>
      </div>
    </div>
  );
}

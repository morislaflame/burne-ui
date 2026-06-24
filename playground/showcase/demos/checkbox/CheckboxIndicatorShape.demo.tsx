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
            <Checkbox.Indicator className="rounded-mid" />
          </Checkbox.Control>
          <Checkbox.Content>
            <Checkbox.Label>rounded-mid</Checkbox.Label>
            <Checkbox.Hint>className на Indicator — заливка обрезается оболочкой.</Checkbox.Hint>
          </Checkbox.Content>
        </Checkbox>
      </div>
    </div>
  );
}

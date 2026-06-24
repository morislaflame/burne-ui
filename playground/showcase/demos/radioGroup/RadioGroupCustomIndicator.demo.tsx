import { RadioGroup } from "@/components/composite/RadioGroup";
import { Radio } from "@/components/core/Radio";

export function RadioGroupCustomIndicatorDemo() {
  return (
    <RadioGroup defaultValue="design" className="w-full max-w-sm">
      <RadioGroup.Legend>
        <RadioGroup.Label>Отдел</RadioGroup.Label>
        <RadioGroup.Hint>Квадратный индикатор через Radio.Indicator className.</RadioGroup.Hint>
      </RadioGroup.Legend>
      <RadioGroup.List>
        <Radio value="design">
          <Radio.Control>
            <Radio.Indicator className="rounded-mid" />
          </Radio.Control>
          <Radio.Content>
            <Radio.Label>Дизайн</Radio.Label>
          </Radio.Content>
        </Radio>
        <Radio value="dev">
          <Radio.Control>
            <Radio.Indicator className="rounded-mid" />
          </Radio.Control>
          <Radio.Content>
            <Radio.Label>Разработка</Radio.Label>
          </Radio.Content>
        </Radio>
        <Radio value="qa">
          <Radio.Control>
            <Radio.Indicator className="rounded-mid" />
          </Radio.Control>
          <Radio.Content>
            <Radio.Label>Тестирование</Radio.Label>
          </Radio.Content>
        </Radio>
      </RadioGroup.List>
    </RadioGroup>
  );
}

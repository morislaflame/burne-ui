import { Input } from "@/components/core/Input";
import { Text } from "@/components/core/Text";

export function InputInlinePairDemo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-small">
      <Text as="p" variant="small" className="font-medium">
        Контактное лицо
      </Text>
      <div className="grid grid-cols-1 gap-mid sm:grid-cols-2">
        <Input label="Имя" name="firstName" placeholder="Иван" autoComplete="given-name" />
        <Input label="Фамилия" name="lastName" placeholder="Иванов" autoComplete="family-name" />
      </div>
    </div>
  );
}

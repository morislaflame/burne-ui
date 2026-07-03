import { Input } from "@/components/core/Input";
import { Text } from "@/components/core/Text";

export function InputInlinePairDemo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-small">
      <Text as="p" variant="small" className="font-medium">
        Contact person
      </Text>
      <div className="grid grid-cols-1 gap-mid sm:grid-cols-2">
        <Input label="Name" name="firstName" placeholder="Ivan" autoComplete="given-name" />
        <Input label="Surname" name="lastName" placeholder="Ivanov" autoComplete="family-name" />
      </div>
    </div>
  );
}

import { Input } from "@/components/core/Input";

export function InputCompoundDemo() {
  return (
    <Input isRequired className="w-64">
      <Input.Label>Telephone (compound)</Input.Label>
      <Input.Control placeholder="+7 900 000-00-00" />
      <Input.Hint>For SMS-confirmation.</Input.Hint>
    </Input>
  );
}

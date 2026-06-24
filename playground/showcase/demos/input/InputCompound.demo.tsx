import { Input } from "@/components/core/Input";

export function InputCompoundDemo() {
  return (
    <Input isRequired className="w-64">
      <Input.Label>Телефон (compound)</Input.Label>
      <Input.Control placeholder="+7 900 000-00-00" />
      <Input.Hint>Для SMS-подтверждения.</Input.Hint>
    </Input>
  );
}

import { Input } from "@/components/core/Input";

export function InputStatusesDemo() {
  return (
    <div className="flex flex-col gap-mid items-center w-full">
      <Input
        label="Ошибка"
        status="danger"
        defaultValue="bad@"
        error="Некорректный email."
        className="w-64"
      />
      <Input
        label="Успех"
        status="success"
        defaultValue="verified@mail.ru"
        className="w-64"
      />
      <Input
        label="Предупреждение"
        status="warning"
        defaultValue="temp@…"
        hint="Проверьте домен."
        className="w-64"
      />
    </div>
  );
}

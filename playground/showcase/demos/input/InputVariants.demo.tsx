import { Input } from "@/components/core/Input";

export function InputVariantsDemo() {
  return (
    <div className="flex flex-col gap-mid items-center w-full">
      <Input
        label="Email"
        placeholder="you@example.com"
        hint="Мы не рассылаем спам."
        className="w-64"
      />
      <Input
        label="Outline"
        variant="outline"
        placeholder="variant outline"
        hint="Прозрачный фон с обводкой."
        className="w-64"
      />
    </div>
  );
}

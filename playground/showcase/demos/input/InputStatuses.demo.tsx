import { Input } from "@/components/core/Input";

export function InputStatusesDemo() {
  return (
    <div className="flex flex-col gap-large items-center w-full">
      <Input
        label="Error"
        status="danger"
        defaultValue="bad@"
        error="Incorrect email."
        className="w-64"
      />
      <Input
        label="Success"
        status="success"
        defaultValue="verified@mail.ru"
        className="w-64"
      />
      <Input
        label="Warning"
        status="warning"
        defaultValue="temp@…"
        hint="Check the domain."
        className="w-64"
      />
    </div>
  );
}

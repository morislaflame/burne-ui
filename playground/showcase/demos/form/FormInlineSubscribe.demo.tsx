import { useCallback, type FormEvent } from "react";

import { Form } from "@/components/composite/Form";
import { Button } from "@/components/core/Button";
import { Input } from "@/components/core/Input";

export function FormInlineSubscribeDemo() {
  const onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }, []);

  return (
    <Form
      onSubmit={onSubmit}
      aria-label="Подписка на рассылку"
      className="flex w-full max-w-lg flex-col gap-small sm:flex-row sm:items-end"
    >
      <Input
        label="Email"
        name="email"
        placeholder="you@example.com"
        autoComplete="email"
        className="min-w-0 flex-1"
      />
      <Button type="submit" variant="primary" className="w-full shrink-0 sm:w-auto">
        Подписаться
      </Button>
    </Form>
  );
}

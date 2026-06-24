import { useCallback, type FormEvent } from "react";

import { Form } from "@/components/composite/Form";
import { Button } from "@/components/core/Button";
import { Input } from "@/components/core/Input";

export function FormMinimalSubscribeDemo() {
  const onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }, []);

  return (
    <Form onSubmit={onSubmit} aria-label="Быстрая подписка" className="max-w-sm">
      <Input label="Email" name="subscribe" placeholder="you@example.com" autoComplete="email" />
      <div className="flex justify-end pt-small">
        <Button type="submit" size="base">
          Подписаться
        </Button>
      </div>
    </Form>
  );
}

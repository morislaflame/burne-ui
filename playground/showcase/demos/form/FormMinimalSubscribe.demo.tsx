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
      <Form.Section>
        <Input label="Email" name="subscribe" placeholder="you@example.com" autoComplete="email" />
      </Form.Section>
      <div className="flex justify-end">
        <Button type="submit" variant="primary" className="w-full">
          Подписаться
        </Button>
      </div>
    </Form>
  );
}

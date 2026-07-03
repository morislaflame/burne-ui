import { useCallback } from "react";

import { Form, type FormValues } from "@/components/composite/Form";
import { Button } from "@/components/core/Button";
import { Input } from "@/components/core/Input";

export function FormInlineSubscribeDemo() {
  const onSubmit = useCallback((values: FormValues) => {
    void values;
  }, []);

  return (
    <Form
      onSubmit={onSubmit}
      aria-label="Subscribe to the newsletter"
      className="flex w-full max-w-lg flex-col gap-small sm:flex-row sm:items-end"
      rules={{
        email: {
          required: "Email required",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Incorrect email",
          },
        },
      }}
    >
      <Form.Section className="min-w-0 flex-1">
        <Form.Field name="email">
          <Input
            label="Email"
            name="email"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </Form.Field>
      </Form.Section>
      <Button type="submit" variant="primary" className="w-full shrink-0 sm:w-auto">
        Subscribe
      </Button>
    </Form>
  );
}

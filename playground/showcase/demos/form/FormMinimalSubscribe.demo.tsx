import { useCallback } from "react";

import { Form, type FormValues } from "@/components/composite/Form";
import { Button } from "@/components/core/Button";
import { Input } from "@/components/core/Input";

export function FormMinimalSubscribeDemo() {
  const onSubmit = useCallback((values: FormValues) => {
    void values;
  }, []);

  return (
    <Form
      onSubmit={onSubmit}
      aria-label="Quick subscription"
      className="max-w-sm"
      rules={{ subscribe: { required: "Specify email" } }}
    >
      <Form.Section>
        <Form.Field name="subscribe">
          <Input label="Email" name="subscribe" placeholder="you@example.com" autoComplete="email" />
        </Form.Field>
      </Form.Section>
      <Form.Actions>
        <Button type="submit" variant="primary" className="w-full">
          Subscribe
        </Button>
      </Form.Actions>
    </Form>
  );
}

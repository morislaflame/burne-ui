import { useCallback } from "react";

import { Form, type FormValues } from "@/components/composite/Form";
import { Button } from "@/components/core/Button";
import { Input } from "@/components/core/Input";
import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";

export function FormLoginPanelDemo() {
  const onSubmit = useCallback((values: FormValues) => {
    void values;
  }, []);

  return (
    <Surface variant="secondary" padding="mid" className="w-full max-w-sm">
      <div className="mb-mid flex flex-col gap-xsmall">
        <Text as="h3" variant="header-2">
          Entrance
        </Text>
        <Text as="p" variant="small" className="text-muted">
          Demo account for playground
        </Text>
      </div>
      <Form
        onSubmit={onSubmit}
        aria-label="Login"
        className="gap-xlarge"
        rules={{
          login: { required: "Specify email" },
          password: { required: "Enter your password" },
        }}
      >
        <Form.Section>
          <Form.Field name="login">
            <Input isRequired label="Email" name="login" autoComplete="email" />
          </Form.Field>
          <Form.Field name="password">
            <Input
              isRequired
              label="Password"
              name="password"
              inputType="password"
              autoComplete="current-password"
            />
          </Form.Field>
        </Form.Section>
        <Form.Actions>
          <Button type="submit" variant="primary" className="w-full">
            Login
          </Button>
        </Form.Actions>
      </Form>
    </Surface>
  );
}

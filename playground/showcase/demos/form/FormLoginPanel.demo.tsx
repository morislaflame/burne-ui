import { useCallback, type FormEvent } from "react";

import { Form } from "@/components/composite/Form";
import { Button } from "@/components/core/Button";
import { Input } from "@/components/core/Input";
import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";

export function FormLoginPanelDemo() {
  const onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }, []);

  return (
    <Surface variant="secondary" padding="mid" className="w-full max-w-sm">
      <div className="mb-mid flex flex-col gap-xsmall">
        <Text as="h3" variant="header-2">
          Вход
        </Text>
        <Text as="p" variant="small" className="text-muted">
          Демо-аккаунт для playground
        </Text>
      </div>
      <Form onSubmit={onSubmit} aria-label="Вход в аккаунт" className="gap-xlarge">
        <Form.Section>
          <Input isRequired label="Email" name="login" autoComplete="email" />
          <Input
            isRequired
            label="Пароль"
            name="password"
            inputType="password"
            autoComplete="current-password"
          />
        </Form.Section>
        <Button type="submit" variant="primary" className="w-full">
          Войти
        </Button>
      </Form>
    </Surface>
  );
}

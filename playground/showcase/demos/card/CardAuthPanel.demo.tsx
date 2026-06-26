import { useCallback, useState, type FormEvent } from "react";

import { Form } from "@/components/composite/Form";
import { Button } from "@/components/core/Button";
import { Card } from "@/components/core/Card";
import { Checkbox } from "@/components/core/Checkbox";
import { Input } from "@/components/core/Input";
import { Link } from "@/components/core/Link";
import { Tabs } from "@/components/core/Tabs";
import { Text } from "@/components/core/Text";

export function CardAuthPanelDemo() {
  const [tab, setTab] = useState("login");

  const onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }, []);

  return (
    <Card variant="secondary" className="w-full max-w-sm">
      <Card.Header>
        <Card.Title>Аккаунт</Card.Title>
        <Card.Description>Войдите или создайте новый профиль</Card.Description>
      </Card.Header>
      <Card.Body>
        <Tabs value={tab} onValueChange={setTab}>
          <Tabs.List className="w-full">
            <Tabs.Tab value="login" className="flex-1">
              Вход
            </Tabs.Tab>
            <Tabs.Tab value="register" className="flex-1">
              Регистрация
            </Tabs.Tab>
          </Tabs.List>

          <Tabs.Panel value="login" className="">
            <Form onSubmit={onSubmit} aria-label="Вход в аккаунт" className="gap-large">
              <Form.Section>
                <Input isRequired label="Email" name="login-email" autoComplete="email" placeholder="you@example.com" />
                <Input
                  isRequired
                  label="Пароль"
                  name="login-password"
                  inputType="password"
                  autoComplete="current-password"
                  placeholder="••••••••"
                />
                <div className="flex">
                  <Link href="#" size="small" className="text-muted">
                    Забыли пароль?
                  </Link>
                </div>
              </Form.Section>
              <Button type="submit" variant="primary" className="w-full">
                Войти
              </Button>
            </Form>
          </Tabs.Panel>

          <Tabs.Panel value="register">
            <Form onSubmit={onSubmit} aria-label="Регистрация" className="gap-large">
              <Form.Section>
                <Input isRequired label="Имя" name="register-name" autoComplete="name" placeholder="Иван"/>
                <Input isRequired label="Email" name="register-email" autoComplete="email" placeholder="you@example.com" />
                <Input
                  isRequired
                  label="Пароль"
                  name="register-password"
                  inputType="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                />
              </Form.Section>
              <Form.Section>
                <Checkbox
                  required
                  name="terms"
                  value="accepted"
                  label="Принимаю условия использования"
                />
              </Form.Section>
              <Button type="submit" variant="primary" className="w-full">
                Создать аккаунт
              </Button>
            </Form>
          </Tabs.Panel>
        </Tabs>
      </Card.Body>
      <Card.Footer className="justify-center border-t border-token flex flex-col gap-xsmall">
        <Link href="#" size="small" className="text-muted">
          Политика конфиденциальности
        </Link>
      </Card.Footer>
    </Card>
  );
}

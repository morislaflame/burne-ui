import { useCallback } from "react";

import { CheckboxGroup } from "@/components/composite/CheckboxGroup";
import { Form, type FormValues } from "@/components/composite/Form";
import { Button } from "@/components/core/Button";
import { Checkbox } from "@/components/core/Checkbox";
import { Input } from "@/components/core/Input";

export function FormProfileDemo() {
  const onSubmit = useCallback((values: FormValues) => {
    void values;
  }, []);

  return (
    <Form
      onSubmit={onSubmit}
      aria-label="Пример формы"
      className="max-w-md"
      rules={{
        name: { required: "Введите имя" },
        email: {
          required: "Email обязателен",
          pattern: {
            value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
            message: "Некорректный email",
          },
        },
      }}
    >
      <Form.Title>Профиль</Form.Title>
      <Form.Section>
        <Form.Field name="name">
          <Input isRequired name="name" label="Имя" placeholder="Иван" autoComplete="name" />
        </Form.Field>
        <Form.Field name="email">
          <Input
            isRequired
            name="email"
            label="Email"
            placeholder="you@example.com"
            autoComplete="email"
          />
        </Form.Field>
      </Form.Section>
      <Form.Section>
        <CheckboxGroup>
          <CheckboxGroup.Legend>
            <CheckboxGroup.Label>Способ доставки</CheckboxGroup.Label>
          </CheckboxGroup.Legend>
          <CheckboxGroup.List>
            <Checkbox name="ship" value="courier" label="Курьер" />
            <Checkbox name="ship" value="pickup" label="Самовывоз" />
          </CheckboxGroup.List>
        </CheckboxGroup>
      </Form.Section>
      <Form.Actions>
        <Button type="button" variant="outline">
          Отмена
        </Button>
        <Button type="submit">Сохранить</Button>
      </Form.Actions>
    </Form>
  );
}

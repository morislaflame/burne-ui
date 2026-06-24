import { useCallback, type FormEvent } from "react";

import { CheckboxGroup } from "@/components/composite/CheckboxGroup";
import { Form } from "@/components/composite/Form";
import { Button } from "@/components/core/Button";
import { Checkbox } from "@/components/core/Checkbox";
import { Input } from "@/components/core/Input";

export function FormProfileDemo() {
  const onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }, []);

  return (
    <Form onSubmit={onSubmit} aria-label="Пример формы" className="max-w-md">
      <Input isRequired label="Имя" name="name" placeholder="Иван" autoComplete="name" />
      <Input
        isRequired
        label="Email"
        name="email"
        placeholder="you@example.com"
        autoComplete="email"
      />
      <CheckboxGroup>
        <CheckboxGroup.Legend>
          <CheckboxGroup.Label>Способ доставки</CheckboxGroup.Label>
        </CheckboxGroup.Legend>
        <CheckboxGroup.List>
          <Checkbox name="ship" value="courier" label="Курьер" />
          <Checkbox name="ship" value="pickup" label="Самовывоз" />
        </CheckboxGroup.List>
      </CheckboxGroup>
      <div className="flex justify-end gap-small pt-small">
        <Button type="button" variant="outline">
          Отмена
        </Button>
        <Button type="submit">Сохранить</Button>
      </div>
    </Form>
  );
}

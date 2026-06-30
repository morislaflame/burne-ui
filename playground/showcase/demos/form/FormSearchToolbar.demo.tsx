import { useCallback } from "react";
import { IoSearchOutline } from "react-icons/io5";

import { Form, type FormValues } from "@/components/composite/Form";
import { Button } from "@/components/core/Button";
import { Input } from "@/components/core/Input";

export function FormSearchToolbarDemo() {
  const onSubmit = useCallback((values: FormValues) => {
    void values;
  }, []);

  return (
    <Form
      onSubmit={onSubmit}
      aria-label="Поиск по каталогу"
      className="flex w-full max-w-xl items-center gap-small flex-row rounded-mid border-token bg-tertiary p-xsmall"
    >
      <Form.Section className="min-w-0 flex-1">
        <Input
          name="q"
          placeholder="Найти компонент…"
          className="[&_label]:sr-only"
          label="Поиск"
        />
      </Form.Section>
      <Button type="submit" variant="primary" iconOnly aria-label="Искать">
        <IoSearchOutline aria-hidden />
      </Button>
    </Form>
  );
}

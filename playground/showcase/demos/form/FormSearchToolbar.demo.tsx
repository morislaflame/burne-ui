import { useCallback, type FormEvent } from "react";
import { IoSearchOutline } from "react-icons/io5";

import { Form } from "@/components/composite/Form";
import { Button } from "@/components/core/Button";
import { Input } from "@/components/core/Input";

export function FormSearchToolbarDemo() {
  const onSubmit = useCallback((e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  }, []);

  return (
    <Form
      onSubmit={onSubmit}
      aria-label="Поиск по каталогу"
      className="flex w-full max-w-xl items-center gap-small rounded-mid border-token bg-tertiary p-xsmall"
    >
      <Input
        name="q"
        placeholder="Найти компонент…"
        className="min-w-0 flex-1 [&_label]:sr-only"
        label="Поиск"
      />
      <Button type="submit" variant="primary" iconOnly aria-label="Искать">
        <IoSearchOutline aria-hidden />
      </Button>
    </Form>
  );
}

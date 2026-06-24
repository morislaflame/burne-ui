import { useState } from "react";

import { SearchInput } from "@/components/core/SearchInput";

export function SearchInputWithResultDemo() {
  const [search, setSearch] = useState("");

  return (
    <>
      <SearchInput
        aria-label="Поиск с подсказкой"
        placeholder="Введите запрос…"
        value={search}
        onValueChange={setSearch}
        className="w-64"
      />
      {search ? (
        <p className="mt-mid text-sm text-muted">
          Запрос: <span className="font-medium text-foreground">{search}</span>
        </p>
      ) : null}
    </>
  );
}

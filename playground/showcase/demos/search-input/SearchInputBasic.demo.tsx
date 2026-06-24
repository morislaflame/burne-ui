import { useState } from "react";

import { SearchInput } from "@/components/core/SearchInput";

export function SearchInputBasicDemo() {
  const [search, setSearch] = useState("");

  return (
    <SearchInput
      aria-label="Поиск"
      placeholder="Найти компонент…"
      value={search}
      onValueChange={setSearch}
      className="w-64"
    />
  );
}

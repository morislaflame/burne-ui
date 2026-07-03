import { useState } from "react";

import { SearchInput } from "@/components/core/SearchInput";

export function SearchInputBasicDemo() {
  const [search, setSearch] = useState("");

  return (
    <SearchInput
      aria-label="Search"
      placeholder="Find component…"
      value={search}
      onValueChange={setSearch}
      className="w-64"
    />
  );
}

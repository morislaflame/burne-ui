import { useState } from "react";

import { SearchInput } from "@/components/core/SearchInput";

export function SearchInputGlossDemo() {
  const [search, setSearch] = useState("");

  return (
    <SearchInput
      variant="gloss"
      aria-label="Search gloss"
      placeholder="Find…"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-64"
    />
  );
}

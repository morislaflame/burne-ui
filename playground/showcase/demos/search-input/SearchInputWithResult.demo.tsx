import { useState } from "react";

import { SearchInput } from "@/components/core/SearchInput";

export function SearchInputWithResultDemo() {
  const [search, setSearch] = useState("");

  return (
    <>
      <SearchInput
        aria-label="Search with hint"
        placeholder="Enter your request…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-64"
      />
      {search ? (
        <p className="mt-mid text-sm text-muted">
          Request: <span className="font-medium text-foreground">{search}</span>
        </p>
      ) : null}
    </>
  );
}

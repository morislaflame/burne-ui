import { useState } from "react";

import { SearchInput } from "@/components/core/SearchInput";

export function SearchInputClassNamesFullDemo() {
  const [search, setSearch] = useState("component");

  return (
    <SearchInput
      defaultExpanded
      aria-label="Search with custom slot styles"
      placeholder="Find component…"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      classNames={{
        root: "border-primary/40 ring-1 ring-primary/15",
        icon: "text-primary",
        input: "text-primary placeholder:text-primary/50",
        clear: "text-primary hover:text-primary/70",
      }}
    />
  );
}

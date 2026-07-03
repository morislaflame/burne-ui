import { useState } from "react";

import { SearchInput } from "@/components/core/SearchInput";
import { Text } from "@/components/core/Text";

export function SearchInputGlossHeroDemo() {
  const [query, setQuery] = useState("");

  return (
    <div className="flex w-full max-w-lg flex-col items-center gap-mid rounded-large border border-primary/20 bg-gradient-to-b from-primary/10 to-surface px-mid py-large text-center">
      <Text as="h3" variant="header-2">
        Catalog Burne UI
      </Text>
      <Text as="p" variant="small" className="max-w-sm text-muted">
        Gloss SearchInput in hero-block - for landing and documentation.
      </Text>
      <SearchInput
        variant="gloss"
        aria-label="Catalog search"
        placeholder="Find component…"
        value={query}
        onValueChange={setQuery}
        className="w-full max-w-sm"
      />
    </div>
  );
}

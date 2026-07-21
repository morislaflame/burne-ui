import { useState } from "react";

import { SearchInput } from "@/components/core/SearchInput";
import { Text } from "@/components/core/Text";

export function SearchInputCommandBarDemo() {
  const [query, setQuery] = useState("");

  return (
    <div className="flex w-full max-w-xl flex-col gap-small rounded-mid border-token bg-secondary p-mid shadow-sm">
      <Text as="p" variant="tools" className="uppercase tracking-wide text-muted">
        Command palette
      </Text>
      <SearchInput
        aria-label="Search commands"
        placeholder="Go to component or action…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        variant="default"
        className="w-full"
      />
    </div>
  );
}

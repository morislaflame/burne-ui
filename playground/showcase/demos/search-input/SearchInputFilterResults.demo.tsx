import { useMemo, useState } from "react";

import { Badge } from "@/components/core/Badge";
import { SearchInput } from "@/components/core/SearchInput";
import { Text } from "@/components/core/Text";

const COMPONENTS = ["Button", "Input", "Tabs", "Dialog", "Toast", "Slider"];

export function SearchInputFilterResultsDemo() {
  const [query, setQuery] = useState("in");

  const results = useMemo(
    () => COMPONENTS.filter((name) => name.toLowerCase().includes(query.trim().toLowerCase())),
    [query],
  );

  return (
    <div className="flex w-full max-w-md flex-col gap-mid">
      <SearchInput
        aria-label="Component filter"
        placeholder="Filter by name…"
        value={query}
        onValueChange={setQuery}
        className="w-full"
      />
      <div className="flex flex-wrap items-center gap-small">
        <Text as="span" variant="small" className="text-muted">
          Found:
        </Text>
        <Badge variant="primary">{results.length}</Badge>
        {results.map((name) => (
          <Badge key={name} status="info">
            {name}
          </Badge>
        ))}
      </div>
    </div>
  );
}

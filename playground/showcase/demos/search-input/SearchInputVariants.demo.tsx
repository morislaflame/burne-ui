import { useState } from "react";

import { SearchInput } from "@/components/core/SearchInput";
import { Text } from "@/components/core/Text";

const VARIANTS = ["default", "outline", "secondary", "gloss"] as const;

export function SearchInputVariantsDemo() {
  const [search, setSearch] = useState("");

  return (
    <div className="grid w-full max-w-2xl gap-xlarge sm:grid-cols-2">
      {VARIANTS.map((variant) => (
        <div key={variant} className="flex flex-col gap-small">
          <Text as="span" variant="small" className="font-w-mid text-muted">
            {variant}
          </Text>
          <SearchInput
            aria-label={`Search ${variant}`}
            variant={variant}
            placeholder={`variant="${variant}"`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>
      ))}
    </div>
  );
}

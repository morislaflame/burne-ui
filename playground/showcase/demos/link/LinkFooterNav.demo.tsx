import { Link } from "@/components/core/Link";
import { Text } from "@/components/core/Text";

import { preventNav } from "../../shared/utils";

const FOOTER_LINKS = ["About the project", "Documentation", "GitHub", "Support"] as const;

export function LinkFooterNavDemo() {
  return (
    <footer className="flex max-w-lg flex-col gap-large px-mid py-plus">
      <Text as="p" variant="small" className="text-muted">
        Bottom navigation
      </Text>
      <nav aria-label="Footer Links" className="flex flex-wrap gap-x-mid gap-y-plus flex-col">
        {FOOTER_LINKS.map((label) => (
            <Link href="#" key={label} onClick={preventNav} size="small" underline>
              {label}
            </Link>
        ))}
      </nav>
    </footer>
  );
}

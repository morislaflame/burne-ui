import { Link } from "@/components/core/Link";
import { Text } from "@/components/core/Text";

import { preventNav } from "../../shared/utils";

const FOOTER_LINKS = ["О проекте", "Документация", "GitHub", "Поддержка"] as const;

export function LinkFooterNavDemo() {
  return (
    <footer className="flex max-w-lg flex-col gap-large px-mid py-plus">
      <Text as="p" variant="small" className="text-muted">
        Нижняя навигация
      </Text>
      <nav aria-label="Ссылки подвала" className="flex flex-wrap gap-x-mid gap-y-plus flex-col">
        {FOOTER_LINKS.map((label) => (
            <Link href="#" key={label} onClick={preventNav} size="small" underline>
              {label}
            </Link>
        ))}
      </nav>
    </footer>
  );
}

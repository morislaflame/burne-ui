import { Link } from "@/components/core/Link";
import { Text } from "@/components/core/Text";

import { preventNav } from "../../shared/utils";

const FOOTER_LINKS = ["О проекте", "Документация", "GitHub", "Поддержка"] as const;

export function LinkFooterNavDemo() {
  return (
    <footer className="flex w-full max-w-lg flex-col gap-small rounded-mid border-token bg-surface px-mid py-plus">
      <Text as="p" variant="tools" className="text-muted">
        Нижняя навигация
      </Text>
      <nav aria-label="Ссылки подвала" className="flex flex-wrap items-center gap-x-mid gap-y-small">
        {FOOTER_LINKS.map((label, i) => (
          <span key={label} className="inline-flex items-center gap-mid">
            {i > 0 ? (
              <span className="text-muted" aria-hidden>
                ·
              </span>
            ) : null}
            <Link href="#" onClick={preventNav} size="small" underline>
              {label}
            </Link>
          </span>
        ))}
      </nav>
    </footer>
  );
}

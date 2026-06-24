import { Link } from "@/components/core/Link";
import { Text } from "@/components/core/Text";

import { preventNav } from "../../shared/utils";

export function LinkArticleInlineDemo() {
  return (
    <article className="w-full max-w-lg">
      <Text as="p" variant="base">
        Burne UI — библиотека компонентов с compound API. Подробнее в{" "}
        <Link href="#" onClick={preventNav} underline>
          документации
        </Link>{" "}
        или на{" "}
        <Link href="https://github.com" target="_blank" rel="noreferrer" showDefaultIcon>
          GitHub
        </Link>
        .
      </Text>
    </article>
  );
}

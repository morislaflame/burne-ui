import { IoOpenOutline, IoShareSocialOutline } from "react-icons/io5";

import { Link } from "@/components/core/Link";
import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";

import { preventNav } from "../../shared/utils";

export function LinkCardActionsDemo() {
  return (
    <Surface variant="secondary" padding="mid" className="flex w-full max-w-sm flex-col gap-mid">
      <div className="flex flex-col gap-xsmall">
        <Text as="p" variant="small" className="font-medium">
          Релиз 1.2.0
        </Text>
        <Text as="p" variant="tools" className="text-muted">
          Обновление компонентов форм и gloss-вариантов.
        </Text>
      </div>
      <div className="flex flex-wrap gap-mid">
        <Link href="#" onClick={preventNav} leftIcon={<IoOpenOutline aria-hidden />} underline>
          Changelog
        </Link>
        <Link href="#" onClick={preventNav} leftIcon={<IoShareSocialOutline aria-hidden />}>
          Поделиться
        </Link>
      </div>
    </Surface>
  );
}

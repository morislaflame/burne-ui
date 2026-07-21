import { IoOpenOutline, IoShareSocialOutline } from "react-icons/io5";

import { Link } from "@/components/core/Link";
import { Surface } from "@/components/core/Surface";
import { Text } from "@/components/core/Text";

import { preventNav } from "../../shared/utils";

export function LinkCardActionsDemo() {
  return (
    <Surface variant="secondary" padding="mid" className="flex w-full max-w-sm flex-col gap-mid">
      <div className="flex flex-col gap-xsmall">
        <Text as="p" variant="base" className="font-medium">
          Release 1.2.0
        </Text>
        <Text as="p" variant="tools" className="text-muted">
          Updating form components and gloss-options.
        </Text>
      </div>
      <div className="flex flex-wrap gap-mid">
        <Link href="#" onClick={preventNav} icon={<IoOpenOutline aria-hidden />} size="small" underline>
          Changelog
        </Link>
        <Link href="#" onClick={preventNav} icon={<IoShareSocialOutline aria-hidden />} size="small">
          Share
        </Link>
      </div>
    </Surface>
  );
}

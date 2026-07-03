import { IoRocketOutline } from "react-icons/io5";

import { Link } from "@/components/core/Link";

import { preventNav } from "../../shared/utils";

export function LinkVariantsDemo() {
  return (
    <div className="flex flex-wrap gap-mid">
      <Link href="#" onClick={preventNav}>
        Internal link
      </Link>
      <Link href="https://github.com" target="_blank" rel="noreferrer" showDefaultIcon>
        External link
      </Link>
      <Link href="#" onClick={preventNav} underline leftIcon={<IoRocketOutline aria-hidden />}>
        With icon
      </Link>
      <Link href="#" onClick={preventNav} underline showDefaultIcon>
        Underlined
      </Link>
    </div>
  );
}

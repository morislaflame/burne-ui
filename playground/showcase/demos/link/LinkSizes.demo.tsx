import { Link } from "@/components/core/Link";

import { preventNav } from "../../shared/utils";

export function LinkSizesDemo() {
  return (
    <div className="flex flex-wrap items-center gap-large">
      <Link href="#" onClick={preventNav} size="small">
        Small
      </Link>
      <Link href="#" onClick={preventNav} size="base">
        Base
      </Link>
      <Link href="#" onClick={preventNav} size="mid">
        Mid
      </Link>
      <Link href="#" onClick={preventNav} size="large">
        Large
      </Link>
    </div>
  );
}

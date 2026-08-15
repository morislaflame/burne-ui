import { Link } from "@/components/core/Link";

import { preventNav } from "../../shared/utils";

export function LinkMotionInstantHoverDemo() {
  return (
    <Link
      href="#"
      onClick={preventNav}
      underline
      showDefaultIcon
      motion={{
        root: { hoverIn: false, hoverOut: false },
      }}
    >
      Instant hover
    </Link>
  );
}

import { Link } from "@/components/core/Link";
import { IoOpenOutline } from "react-icons/io5";

export function LinkCompoundApiDemo() {
  return (
    <div className="flex flex-col items-start gap-small">
      <Link href="#" onClick={(e) => e.preventDefault()}>
        Icon at end (default)
        <Link.Icon />
      </Link>
      <Link href="#" onClick={(e) => e.preventDefault()}>
        <Link.Icon position="start" />
        Icon at start
      </Link>
      <Link href="#" onClick={(e) => e.preventDefault()}>
        Custom icon
        <Link.Icon>
          <IoOpenOutline aria-hidden className="icon-base" />
        </Link.Icon>
      </Link>
    </div>
  );
}

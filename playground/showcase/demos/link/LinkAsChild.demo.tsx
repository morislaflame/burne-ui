import { Link } from "@/components/core/Link";

export function LinkAsChildDemo() {
  return (
    <div className="flex flex-col items-start gap-large">
      <Link asChild underline showDefaultIcon>
        <a href="#docs">Router-ready styled link</a>
      </Link>
      <Link asChild>
        <a href="#about" className="text-muted">
          Muted custom anchor
        </a>
      </Link>
    </div>
  );
}

import { Badge } from "@/components/core/Badge";

const TAGS = ["React", "TypeScript", "Tailwind", "GSAP", "a11y"] as const;

export function BadgeTagCloudDemo() {
  return (
    <div className="flex w-full max-w-md flex-wrap gap-xsmall">
      {TAGS.map((tag) => (
        <Badge
          key={tag}
          variant="outline"
          size="small"
          className="rounded-full border-dashed bg-surface/50 px-small capitalize"
        >
          {tag}
        </Badge>
      ))}
    </div>
  );
}

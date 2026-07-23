import { Avatar } from "@/components/core/Avatar";
import { PIN_IMAGE1, PIN_IMAGE2 } from "@/stories-utils/mockImages";

export function AvatarClassNamesGlossDemo() {
  return (
    <div className="flex flex-wrap items-center gap-large">
      <Avatar
        variant="gloss"
        size="base"
        label="Root"
        src={PIN_IMAGE1}
        alt=""
        loading="lazy"
        classNames={{
          root: "ring-2 ring-primary ring-offset-2 ring-offset-background",
          glossWrap: "rounded-full",
        }}
      />
      <Avatar
        variant="gloss"
        size="mid"
        label="Wrap"
        src={PIN_IMAGE2}
        alt=""
        loading="lazy"
        classNames={{
          root: "border border-info/40",
          glossWrap: "p-0.5 ring-1 ring-info/30 rounded-full",
        }}
      />
      <Avatar
        variant="gloss"
        size="large"
        label="Fallback"
        className="text-primary"
        classNames={{
          root: "bg-primary/10 text-primary font-semibold",
          glossWrap: "shadow-token-mid",
        }}
      />
    </div>
  );
}

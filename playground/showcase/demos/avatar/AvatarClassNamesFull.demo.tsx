import { Avatar } from "@/components/core/Avatar";

export function AvatarClassNamesFullDemo() {
  return (
    <div className="flex flex-col items-start gap-large">
      <div className="flex flex-wrap items-center gap-mid">
        <Avatar
          size="mid"
          label="Root"
          classNames={{
            root: "ring-2 ring-primary ring-offset-2 ring-offset-background",
          }}
        />
        <Avatar
          size="mid"
          label="Fallback"
          classNames={{
            root: "bg-primary/10",
            fallback: "text-primary font-w-strong",
          }}
        />
      </div>
      <Avatar.Group classNames={{ group: "gap-small", groupItem: "ring-2 ring-background" }}>
        <Avatar size="base" label="Ada Lovelace" />
        <Avatar size="base" label="Lin" />
      </Avatar.Group>
    </div>
  );
}

import { Surface } from "@/components/core/Surface";

export function SurfaceClassNamesFullDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-large">
      <Surface
        padding="base"
        classNames={{ root: "border border-primary/30 ring-1 ring-primary/10" }}
      >
        Default surface with custom root slot
      </Surface>
      <Surface
        variant="gloss"
        padding="base"
        classNames={{
          root: "ring-1 ring-primary/20",
          glossContent: "gap-small text-primary",
        }}
      >
        Gloss surface with glossContent slot
      </Surface>
    </div>
  );
}

import { Surface } from "@/components/core/Surface";

export function SurfaceClassNamesFullDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-xlarge">
      <Surface
        padding="base"
        classNames={{ root: "border border-primary/30 ring-1 ring-primary/10" }}
      >
        Default surface with custom root slot
      </Surface>
      <Surface
        variant="default"
        padding="base"
        classNames={{
          root: "ring-1 ring-primary/20",
        }}
      >
        Default surface with a custom root ring
      </Surface>
    </div>
  );
}

import { Button } from "@/components/core/Button";

export function ButtonMotionHoverYDemo() {
  return (
    <Button
      variant="outline"
      motion={{
        root: {
          hoverIn: { y: -3, duration: 0.18 },
          hoverOut: { y: 0, duration: 0.16 },
        },
      }}
    >
      Custom hover y
    </Button>
  );
}

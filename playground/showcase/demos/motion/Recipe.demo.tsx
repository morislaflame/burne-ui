import { Button } from "@/components/core/Button";

export function MotionRecipeDemo() {
  return <Button motion={{ root: { hoverIn: "pressSqueeze" } }}>Squeeze</Button>;
}

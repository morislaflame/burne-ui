import { Button } from "@/components/core/Button";

export function MotionOffDemo() {
  return <Button motion={{ root: { hoverIn: false } }}>Still on hover</Button>;
}

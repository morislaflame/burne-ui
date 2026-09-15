import { Button } from "@/components/core/Button";

export function ButtonMotionNoPressDemo() {
  return (
    <Button variant="primary" motion={{ root: { pressIn: false, pressOut: false } }}>
      No press
    </Button>
  );
}

import { Button } from "@/components/core/Button";
import { Card } from "@/components/core/Card";
import { useMotionControllerHandle } from "@/components/core/utils/slotMotion";

export function CardMotionControllerSetDemo() {
  const controller = useMotionControllerHandle();

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => controller.set("root", { y: -10, rotation: -3 })}>
          Snap
        </Button>
        <Button size="small" variant="ghost" onClick={() => controller.set("root", { y: 0, rotation: 0 })}>
          Zero
        </Button>
      </div>
      <Card motionController={controller} className="max-w-xs">
        <Card.Header>
          <Card.Title>set()</Card.Title>
          <Card.Description>Compositor snap — no MotionRun, no finished.</Card.Description>
        </Card.Header>
      </Card>
    </div>
  );
}

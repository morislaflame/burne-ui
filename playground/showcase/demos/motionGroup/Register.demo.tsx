import { Alert } from "@/components/core/Alert";
import { Button } from "@/components/core/Button";
import { Card } from "@/components/core/Card";
import {
  useMotionControllerHandle,
  useMotionGroupHandle,
  useMotionGroupMember,
} from "@/components/core/utils/slotMotion";

const pulse = {
  root: {
    hoverIn: { y: -6, duration: 0.28, replay: "rest" as const },
    hoverOut: { y: 0, duration: 0.2 },
  },
};

export function MotionGroupRegisterDemo() {
  const group = useMotionGroupHandle();
  const alert = useMotionControllerHandle();
  const card = useMotionControllerHandle();
  useMotionGroupMember("alert", alert, group);
  useMotionGroupMember("card", card, group);

  return (
    <div className="flex flex-col gap-2xlarge">
      <div className="flex flex-wrap gap-small">
        <Button size="small" variant="outline" onClick={() => group.play("alert", "hoverIn")}>
          Pulse alert
        </Button>
        <Button size="small" variant="outline" onClick={() => group.play("card", "hoverIn")}>
          Pulse card
        </Button>
        <Button size="small" variant="ghost" onClick={() => void group.playAll("hoverIn", { stagger: 0.12 })}>
          Stagger all
        </Button>
      </div>
      <Alert
        status="info"
        title="Alert"
        description="Registered as alert — group.play(id)."
        hoverLift={false}
        motionController={alert}
        motion={pulse}
      />
      <Card motionController={card} motion={pulse} className="max-w-xs">
        <Card.Header>
          <Card.Title>Card</Card.Title>
          <Card.Description>Registered as card.</Card.Description>
        </Card.Header>
      </Card>
    </div>
  );
}

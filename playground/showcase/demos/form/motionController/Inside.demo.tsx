import { Form } from "@/components/composite/Form";
import { createMotionEvents, useMotionController } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "form:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

function TitlePulse() {
  const controller = useMotionController();
  return (
    <Form.Title onPointerEnter={() => controller.playSlot("title", "form:nudge")}>
      Hover the title
    </Form.Title>
  );
}

export function FormMotionControllerInsideDemo() {
  return (
    <div className="w-full max-w-sm">
      <Form aria-label="Inside tree" motion={{ events }}>
        <Form.Header>
          <TitlePulse />
          <Form.Description>Hook is on the Form scope, not nested Text.</Form.Description>
        </Form.Header>
      </Form>
    </div>
  );
}

import { Toast } from "@/components/core/Toast";
import { createMotionEvents, useMotionController } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "toast:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

function TitlePulse() {
  const controller = useMotionController();
  return (
    <Toast.Title onPointerEnter={() => controller.playSlot("title", "toast:nudge")}>
      Saved
    </Toast.Title>
  );
}

export function ToastMotionControllerInsideDemo() {
  return (
    <div className="flex min-h-[22rem] w-full max-w-lg flex-col">
      <Toast motion={{ events }}>
        <Toast.Indicator />
        <Toast.Content>
          <TitlePulse />
          <Toast.Description>Hover the title.</Toast.Description>
        </Toast.Content>
      </Toast>
    </div>
  );
}

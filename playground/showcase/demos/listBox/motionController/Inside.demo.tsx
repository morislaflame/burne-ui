import { ListBox } from "@/components/core/ListBox";
import { createMotionEvents, useMotionController } from "@/components/core/utils/slotMotion";

const events = createMotionEvents({
  "listbox:nudge": { y: -6, duration: 0.16, yoyo: true, repeat: 1, ease: "power2.out" },
});

function HeaderPulse() {
  const controller = useMotionController();
  return (
    <ListBox.Header onPointerEnter={() => controller.playSlot("header", "listbox:nudge")}>
      Hover the header
    </ListBox.Header>
  );
}

export function ListBoxMotionControllerInsideDemo() {
  return (
    <ListBox aria-label="Lang" motion={{ item: { pressIn: false, pressOut: false }, events }}>
      <ListBox.Section>
        <HeaderPulse />
        <ListBox.Item value="ada" label="Ada" />
        <ListBox.Item value="lin" label="Lin" />
      </ListBox.Section>
    </ListBox>
  );
}

import { ButtonGroup } from "@/components/composite/ButtonGroup";
import { Button } from "@/components/core/Button";

export function ButtonGroupMotionRootWaveDemo() {
  return (
    <ButtonGroup
      motion={{
        root: {
          enter: (ctx) =>
            ctx.fromTo({ opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.3 }),
        },
        text: {
          enter: (ctx) => ctx.fromTo({ y: 4 }, { y: 0, duration: 0.22 }),
        },
      }}
    >
      <Button>Cut</Button>
      <ButtonGroup.Text>or</ButtonGroup.Text>
      <Button>Copy</Button>
    </ButtonGroup>
  );
}

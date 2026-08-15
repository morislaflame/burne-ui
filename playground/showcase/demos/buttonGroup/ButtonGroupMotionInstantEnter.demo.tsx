import { ButtonGroup } from "@/components/composite/ButtonGroup";
import { Button } from "@/components/core/Button";

export function ButtonGroupMotionInstantEnterDemo() {
  return (
    <ButtonGroup motion={{ root: { enter: false } }}>
      <Button>One</Button>
      <Button>Two</Button>
    </ButtonGroup>
  );
}

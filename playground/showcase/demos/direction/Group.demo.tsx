import { Button } from "@/components/core/Button";
import { Text } from "@/components/core/Text";
import { ButtonGroup } from "@/components/composite/ButtonGroup";

import { RtlPair } from "./rtlPair";

export function DirectionGroupDemo() {
  return (
    <RtlPair>
      {() => (
        <>
          <Text variant="base">The line starts on this side.</Text>
          <ButtonGroup aria-label="Document actions">
            <Button variant="outline">Save</Button>
            <Button variant="outline">Edit</Button>
            <Button variant="primary">Send</Button>
          </ButtonGroup>
        </>
      )}
    </RtlPair>
  );
}

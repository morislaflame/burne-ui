import { Input } from "@/components/core/Input";

import { RtlPair } from "./rtlPair";

export function DirectionFieldDemo() {
  return (
    <RtlPair>
      {() => (
        <Input>
          <Input.Label>Site</Input.Label>
          <Input.Control prefix="https://" suffix=".com" placeholder="example" />
        </Input>
      )}
    </RtlPair>
  );
}

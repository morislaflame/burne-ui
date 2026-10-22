import { useEffect, useState } from "react";

import { Tabs } from "@/components/core/Tabs";
import { Text } from "@/components/core/Text";

function OpenFor() {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    const id = window.setInterval(() => setSeconds((current) => current + 1), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <Text as="p" textStyle="small" className="text-muted">
      Mounted for {seconds}s
    </Text>
  );
}

export function TabsActivationDemo() {
  const [manual, setManual] = useState<string | null>("one");
  const [kept, setKept] = useState<string | null>("alpha");

  return (
    <div className="flex w-full flex-col gap-2xlarge">
      <Tabs activationMode="manual" value={manual} onValueChange={setManual}>
        <Tabs.List aria-label="Manual activation">
          <Tabs.Tab value="one">One</Tabs.Tab>
          <Tabs.Tab value="two">Two</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="one" className="pt-large">
          <Text as="p" textStyle="small">
            Arrow keys move focus. Enter or a click selects.
          </Text>
        </Tabs.Panel>
        <Tabs.Panel value="two" className="pt-large">
          <Text as="p" textStyle="small">
            This panel selects only after Enter or a click.
          </Text>
        </Tabs.Panel>
      </Tabs>

      <Tabs keepMounted={false} value={kept} onValueChange={setKept}>
        <Tabs.List aria-label="Unmount inactive panels">
          <Tabs.Tab value="alpha">Alpha</Tabs.Tab>
          <Tabs.Tab value="beta">Beta</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="alpha" className="pt-large">
          <OpenFor />
        </Tabs.Panel>
        <Tabs.Panel value="beta" className="pt-large">
          <OpenFor />
        </Tabs.Panel>
      </Tabs>
    </div>
  );
}

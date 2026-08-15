import gsap from "gsap";

import { Accordion } from "@/components/composite/Accordion";

export function AccordionMotionChevronDemo() {
  return (
    <Accordion className="w-full max-w-lg" defaultOpenIndex={0}>
      <Accordion.Item value="0">
        <Accordion.Heading>
          <Accordion.Trigger>
            <Accordion.Message>
              <Accordion.Content>
                <Accordion.Title>Compound chevron</Accordion.Title>
                <Accordion.Description>Part prop on Accordion.Chevron</Accordion.Description>
              </Accordion.Content>
              <Accordion.Chevron
                motion={{
                  enter: (ctx) =>
                    gsap.to(ctx.el, {
                      rotation: 180,
                      duration: 0.45,
                      ease: "back.out(1.6)",
                      overwrite: "auto",
                      force3D: false,
                    }),
                  leave: (ctx) =>
                    gsap.to(ctx.el, {
                      rotation: 0,
                      duration: 0.28,
                      overwrite: "auto",
                      force3D: false,
                    }),
                }}
              />
            </Accordion.Message>
          </Accordion.Trigger>
        </Accordion.Heading>
        <Accordion.Panel>
          <Accordion.Body>Custom chevron easing via the part prop. Height stays the kit recipe.</Accordion.Body>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}

import { IoInformationCircleOutline } from "react-icons/io5";

import { Accordion } from "@/components/composite/Accordion";

export function AccordionMotionChevronDemo() {
  return (
    <Accordion className="w-full max-w-lg" defaultOpenIndex={0}>
      <Accordion.Item value="0">
        <Accordion.Heading>
          <Accordion.Trigger>
            <Accordion.Message>
              <Accordion.Icon className="text-info">
                <IoInformationCircleOutline aria-hidden />
              </Accordion.Icon>
              <Accordion.Content>
                <Accordion.Title>Compound chevron</Accordion.Title>
                <Accordion.Description>
                  Chevron factory reaches Title/Icon via ctx.getTarget
                </Accordion.Description>
              </Accordion.Content>
            </Accordion.Message>
            <Accordion.Chevron
              motion={{
                enter: (ctx) => {
                  const tl = ctx.timeline();
                  const icon = ctx.getTarget("icon");
                  const title = ctx.getTarget("title");
                  tl.to(
                    ctx.el,
                    { rotation: 180, duration: 0.45, ease: "back.out(1.6)" },
                    0,
                  );
                  if (icon) {
                    tl.to(
                      icon,
                      { scale: 1.12, rotate: -8, duration: 0.32, ease: "back.out(1.8)" },
                      0,
                    );
                  }
                  if (title) tl.to(title, { x: 2, duration: 0.28 }, 0);
                  return tl;
                },
                leave: (ctx) => {
                  const tl = ctx.timeline();
                  const icon = ctx.getTarget("icon");
                  const title = ctx.getTarget("title");
                  tl.to(ctx.el, { rotation: 0, duration: 0.28 }, 0);
                  if (icon) tl.to(icon, { scale: 1, rotate: 0, duration: 0.22 }, 0);
                  if (title) tl.to(title, { x: 0, duration: 0.22 }, 0);
                  return tl;
                },
              }}
            />
          </Accordion.Trigger>
        </Accordion.Heading>
        <Accordion.Panel>
          <Accordion.Body>
            Same Expandable slots (`title` / `icon`). Height stays the kit recipe.
          </Accordion.Body>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}

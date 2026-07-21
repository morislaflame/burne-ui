import { Accordion } from "@/components/composite/Accordion";
import { Badge } from "@/components/core/Badge";

import { EXPANDABLE_INFO_ICON } from "../../shared/constants";

const CHANGES = [
  {
    version: "1.2.0",
    badge: "Latest",
    title: "Gloss and playground",
    items: ["Custom variations in showcase", "SelectionIndicator rounded-mid", "Slider thumbClassName"],
  },
  {
    version: "1.1.0",
    badge: null,
    title: "Forms and calendar",
    items: ["Calendar compound Footer", "TimeField segmented", "ComboBox Popover API"],
  },
] as const;

export function AccordionReleaseNotesDemo() {
  return (
    <Accordion className="w-full max-w-lg" defaultOpenIndex={0}>
      {CHANGES.map((release) => (
        <Accordion.Item key={release.version}>
          <Accordion.Heading>
            <Accordion.Trigger>
              <Accordion.Message>
                <Accordion.Icon>{EXPANDABLE_INFO_ICON}</Accordion.Icon>
                <Accordion.Content>
                  <Accordion.Title>
                    {release.version}
                    {release.badge ? (
                      <Badge size="small" variant="secondary" className="ml-small">
                        {release.badge}
                      </Badge>
                    ) : null}
                  </Accordion.Title>
                  <Accordion.Description>{release.title}</Accordion.Description>
                </Accordion.Content>
                <Accordion.Chevron />
              </Accordion.Message>
            </Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel>
            <Accordion.Body>
              <ul className="list-disc space-y-xsmall pl-mid text-sm text-muted">
                {release.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </Accordion.Body>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}

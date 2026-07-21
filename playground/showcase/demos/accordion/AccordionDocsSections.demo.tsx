import { IoCodeSlashOutline, IoColorPaletteOutline, IoLayersOutline } from "react-icons/io5";

import { Accordion } from "@/components/composite/Accordion";

const SECTIONS = [
  {
    icon: <IoLayersOutline aria-hidden className="size-full" />,
    title: "Components",
    description: "Core and composite",
    body: "Button, Input, Dialog, Accordion and other primitives with compound API.",
  },
  {
    icon: <IoColorPaletteOutline aria-hidden className="size-full" />,
    title: "Theme",
    description: "Tokens and gloss",
    body: "CSS-variables, surface-options and glass gloss-panels.",
  },
  {
    icon: <IoCodeSlashOutline aria-hidden className="size-full" />,
    title: "Playground",
    description: "Live examples",
    body: "Catalog of components with custom variations and source code.",
  },
] as const;

export function AccordionDocsSectionsDemo() {
  return (
    <Accordion className="w-full max-w-lg" defaultOpenIndex={0}>
      {SECTIONS.map((section) => (
        <Accordion.Item key={section.title}>
          <Accordion.Heading>
            <Accordion.Trigger>
              <Accordion.Message>
                <Accordion.Icon>{section.icon}</Accordion.Icon>
                <Accordion.Content>
                  <Accordion.Title>{section.title}</Accordion.Title>
                  <Accordion.Description>{section.description}</Accordion.Description>
                </Accordion.Content>
                <Accordion.Chevron />
              </Accordion.Message>
            </Accordion.Trigger>
          </Accordion.Heading>
          <Accordion.Panel>
            <Accordion.Body>{section.body}</Accordion.Body>
          </Accordion.Panel>
        </Accordion.Item>
      ))}
    </Accordion>
  );
}

import { IoCodeSlashOutline, IoColorPaletteOutline, IoLayersOutline } from "react-icons/io5";

import { Accordion } from "@/components/composite/Accordion";

const SECTIONS = [
  {
    icon: <IoLayersOutline aria-hidden className="size-full" />,
    title: "Компоненты",
    description: "Core и composite",
    body: "Button, Input, Dialog, Accordion и другие примитивы с compound API.",
  },
  {
    icon: <IoColorPaletteOutline aria-hidden className="size-full" />,
    title: "Тема",
    description: "Токены и gloss",
    body: "CSS-переменные, surface-варианты и стеклянные gloss-панели.",
  },
  {
    icon: <IoCodeSlashOutline aria-hidden className="size-full" />,
    title: "Playground",
    description: "Живые примеры",
    body: "Каталог компонентов с кастомными вариациями и исходным кодом.",
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
                <Accordion.Indicator />
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

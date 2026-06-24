import { Text } from "@/components/core/Text";

export function TextHeroBlockDemo() {
  return (
    <div className="flex w-full max-w-lg flex-col gap-small rounded-mid border border-primary/20 bg-gradient-to-br from-primary/10 via-surface to-surface p-mid">
      <Text as="span" variant="tools" className="uppercase tracking-widest text-primary">
        Burne UI · Showcase
      </Text>
      <Text
        as="h2"
        variant="accent-header"
        className="bg-gradient-to-r from-primary via-info to-success bg-clip-text text-transparent"
      >
        Кастомный hero-блок
      </Text>
      <Text as="p" variant="large" className="max-w-md text-muted">
        Градиент на заголовке и фоновая плашка — через utility-классы поверх preset variant.
      </Text>
    </div>
  );
}

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
      >
        Кастомный hero-блок
      </Text>
      <Text as="p" variant="mid" className="max-w-md text-muted">
        Градиент на заголовке и фоновая плашка — через utility-классы поверх preset variant.
      </Text>
    </div>
  );
}

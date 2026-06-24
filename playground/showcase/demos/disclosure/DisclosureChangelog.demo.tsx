import { Disclosure, DisclosureGroup } from "@/components/core/Disclosure";
import { Text } from "@/components/core/Text";

const RELEASES = [
  { value: "v1-2", title: "v1.2.0 — Июнь 2026", notes: "Gloss-варианты, SelectionIndicator и playground." },
  { value: "v1-1", title: "v1.1.0 — Май 2026", notes: "Calendar, TimeField и улучшения форм." },
  { value: "v1-0", title: "v1.0.0 — Апрель 2026", notes: "Первый стабильный релиз библиотеки." },
] as const;

export function DisclosureChangelogDemo() {
  return (
    <DisclosureGroup variant="card" defaultValue="v1-2" className="w-full max-w-lg">
      {RELEASES.map((release) => (
        <Disclosure key={release.value} value={release.value}>
          <Disclosure.Trigger>{release.title}</Disclosure.Trigger>
          <Disclosure.Content>
            <Text as="p" variant="small" className="text-muted">
              {release.notes}
            </Text>
          </Disclosure.Content>
        </Disclosure>
      ))}
    </DisclosureGroup>
  );
}

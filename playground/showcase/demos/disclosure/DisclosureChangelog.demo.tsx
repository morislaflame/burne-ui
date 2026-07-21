import { Disclosure } from "@/components/core/Disclosure";
import { Text } from "@/components/core/Text";

const RELEASES = [
  { value: "v1-2", title: "v1.2.0 — June 2026", notes: "Gloss-options, SelectionIndicator and playground." },
  { value: "v1-1", title: "v1.1.0 — May 2026", notes: "Calendar, TimeField and form improvements." },
  { value: "v1-0", title: "v1.0.0 — April 2026", notes: "First stable release of the library." },
] as const;

export function DisclosureChangelogDemo() {
  return (
    <Disclosure.Group variant="card" defaultValue="v1-2" className="w-full max-w-lg">
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
    </Disclosure.Group>
  );
}

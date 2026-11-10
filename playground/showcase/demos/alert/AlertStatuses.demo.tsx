import { Alert } from "@/components/core/Alert";

export function AlertStatusesDemo() {
  return (
    <div className="flex flex-col gap-large">
      <Alert title="Hint" description="Components are imported from the library through the alias @." />
      <Alert title="Warning" description="Playground is not included in the npm package dist/." />
      <Alert title="Done" description="All Alert statuses are available out of the box." />
      <Alert status="info" title="Information" description="Neutral system message." />
      <Alert status="danger" title="Error" description="Critical problem with connection." />
    </div>
  );
}

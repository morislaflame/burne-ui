import { TextArea } from "@/components/core/TextArea";

export function TextAreaSizesDemo() {
  return (
    <div className="flex w-full max-w-xs flex-col gap-small">
      <TextArea size="small" label="Small" placeholder="Small" rows={2} />
      <TextArea size="base" label="Base" placeholder="Base" rows={2} />
      <TextArea size="mid" label="Mid" placeholder="Mid" rows={2} />
      <TextArea size="large" label="Large" placeholder="Large" rows={2} />
    </div>
  );
}

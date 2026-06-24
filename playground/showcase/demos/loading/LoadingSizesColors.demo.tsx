import { Loading } from "@/components/core/Loading";

export function LoadingSizesColorsDemo() {
  return (
    <div className="flex flex-wrap items-center gap-mid">
      <Loading size="small" />
      <Loading size="base" color="primary" />
      <Loading size="mid" color="success" />
      <Loading size="large" color="muted" />
    </div>
  );
}

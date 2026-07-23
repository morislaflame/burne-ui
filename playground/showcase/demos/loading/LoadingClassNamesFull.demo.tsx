import { Loading } from "@/components/core/Loading";

export function LoadingClassNamesFullDemo() {
  return (
    <div className="flex flex-wrap items-center gap-2xlarge">
      <Loading
        type="spinner"
        size="mid"
        classNames={{
          root: "rounded-mid border border-primary/20 p-base",
          spinner: "border-t-info",
        }}
      />
      <Loading
        type="dots"
        size="mid"
        classNames={{
          root: "rounded-mid border border-primary/20 p-base",
          dots: "gap-small",
          dot: "bg-info",
        }}
      />
    </div>
  );
}

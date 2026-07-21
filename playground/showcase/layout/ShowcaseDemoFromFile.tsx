import type { ComponentType } from "react";

import { formatShowcaseSource, type FormatShowcaseSourceOptions } from "../utils/formatShowcaseSource";

import { ShowcaseDemo } from "./ShowcaseDemo";
import type { SurfacePadding } from "@/components/core/Surface";

export type ShowcaseDemoFromFileProps = {
  Demo: ComponentType;
  /** Content demo-file (`import ...?raw`). */
  source: string;
  format?: FormatShowcaseSourceOptions;
  className?: string;
  align?: "start" | "center" | "stretch";
  padding?: SurfacePadding;
};

/**
 * Demo from separate `.demo.tsx`: UI and code in one file, without duplication in showcase-page.
 */
export function ShowcaseDemoFromFile({
  Demo,
  source,
  format,
  ...rest
}: ShowcaseDemoFromFileProps) {
  return (
    <ShowcaseDemo code={formatShowcaseSource(source, format)} {...rest}>
      <Demo />
    </ShowcaseDemo>
  );
}

import type { ComponentType } from "react";

import {
  formatShowcaseSource,
  type FormatShowcaseSourceOptions,
} from "../utils/formatShowcaseSource";

import { ShowcaseDemo } from "./ShowcaseDemo";
import type { SurfacePadding } from "@/components/core/Surface";

export type ShowcaseDemoFromFileProps = {
  Demo: ComponentType;
  /** Содержимое demo-файла (`import ...?raw`). */
  source: string;
  format?: FormatShowcaseSourceOptions;
  className?: string;
  align?: "start" | "center" | "stretch";
  padding?: SurfacePadding;
};

/**
 * Демо из отдельного `.demo.tsx`: UI и код в одном файле, без дублирования в showcase-странице.
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

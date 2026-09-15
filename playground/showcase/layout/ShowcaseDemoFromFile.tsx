import type { ComponentType } from "react";

import {
  formatShowcaseSource,
  showcaseSourcePlaysEnter,
  type FormatShowcaseSourceOptions,
} from "../utils/formatShowcaseSource";

import type { SurfacePadding } from "@/components/core/Surface";

import { ShowcaseDemo } from "./ShowcaseDemo";
import type { ShowcaseDemoAlign } from "./ShowcaseDemoStage";

export type ShowcaseDemoFromFileProps = {
  Demo: ComponentType;
  /** Content demo-file (`import ...?raw`). */
  source: string;
  format?: FormatShowcaseSourceOptions;
  className?: string;
  align?: ShowcaseDemoAlign;
  padding?: SurfacePadding;
  /**
   * Remount chrome for mount `enter`. Default: on when source plays `enter`
   * (not `enter: false`). Pass `true` to remount skip-enter demos too.
   */
  replay?: boolean;
};

/**
 * Demo from separate `.demo.tsx`: UI and code in one file, without duplication in showcase-page.
 */
export function ShowcaseDemoFromFile({
  Demo,
  source,
  format,
  replay,
  ...rest
}: ShowcaseDemoFromFileProps) {
  return (
    <ShowcaseDemo
      code={formatShowcaseSource(source, format)}
      replay={replay ?? showcaseSourcePlaysEnter(source)}
      {...rest}
    >
      <Demo />
    </ShowcaseDemo>
  );
}

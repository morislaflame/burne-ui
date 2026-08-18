import { TableMotionInstantEnterDemo } from "./TableMotionInstantEnter.demo";
import { TableMotionRootWaveDemo } from "./TableMotionRootWave.demo";
import { TableMotionRowCheckDemo } from "./TableMotionRowCheck.demo";
import { TableMotionColumnLabelDemo } from "./TableMotionColumnLabel.demo";
import { TableMotionEmptyDemo } from "./TableMotionEmpty.demo";
import { TableMotionHeaderBodyDemo } from "./TableMotionHeaderBody.demo";

export function TableMotionDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-large">
      <TableMotionInstantEnterDemo />
      <TableMotionRootWaveDemo />
      <TableMotionRowCheckDemo />
      <TableMotionColumnLabelDemo />
      <TableMotionHeaderBodyDemo />
      <TableMotionEmptyDemo />
    </div>
  );
}

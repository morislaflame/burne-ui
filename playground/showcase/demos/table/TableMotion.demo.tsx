import { TableMotionInstantEnterDemo } from "./TableMotionInstantEnter.demo";
import { TableMotionRootWaveDemo } from "./TableMotionRootWave.demo";
import { TableMotionRowCheckDemo } from "./TableMotionRowCheck.demo";

export function TableMotionDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-large">
      <TableMotionInstantEnterDemo />
      <TableMotionRootWaveDemo />
      <TableMotionRowCheckDemo />
    </div>
  );
}

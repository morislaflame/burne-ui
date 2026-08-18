import { RadioGroupMotionInstantEnterDemo } from "./RadioGroupMotionInstantEnter.demo";
import { RadioGroupMotionChangeTintDemo } from "./RadioGroupMotionChangeTint.demo";
import { RadioGroupMotionHintEnterDemo } from "./RadioGroupMotionHintEnter.demo";

export function RadioGroupMotionDemo() {
  return (
    <div className="flex w-full flex-col items-start gap-large">
      <RadioGroupMotionInstantEnterDemo />
      <RadioGroupMotionChangeTintDemo />
      <RadioGroupMotionHintEnterDemo />
    </div>
  );
}

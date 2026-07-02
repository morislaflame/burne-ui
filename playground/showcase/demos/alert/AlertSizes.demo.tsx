import { Alert, type AlertSize } from "@/components/core/Alert";

const SIZES: AlertSize[] = ["small", "base", "mid", "large"];

export function AlertSizesDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-plus">
      {SIZES.map((size) => (
        <Alert key={size} status="info" size={size} className="w-full">
          <Alert.Message>
            <Alert.Indicator />
            <Alert.Content>
              <Alert.Title>size={size}</Alert.Title>
              <Alert.Description>
                Padding, иконка и типографика масштабируются по размерной сетке.
              </Alert.Description>
            </Alert.Content>
          </Alert.Message>
        </Alert>
      ))}
    </div>
  );
}

import { Text } from "@/components/core/Text";

export const SCROLL_AREA_CITIES = [
  "Oslo",
  "Bergen",
  "Trondheim",
  "Stavanger",
  "Tromsø",
  "Ålesund",
  "Bodø",
  "Kristiansand",
  "Drammen",
  "Lillehammer",
  "Molde",
  "Harstad",
] as const;

export function ScrollAreaCityList() {
  return (
    <ul className="flex flex-col gap-small p-base">
      {SCROLL_AREA_CITIES.map((city) => (
        <li key={city}>
          <Text variant="base">{city}</Text>
        </li>
      ))}
    </ul>
  );
}

export function ScrollAreaCityRow() {
  return (
    <ul className="flex w-max gap-base p-base">
      {SCROLL_AREA_CITIES.map((city) => (
        <li key={city} className="shrink-0">
          <Text variant="base">{city}</Text>
        </li>
      ))}
    </ul>
  );
}

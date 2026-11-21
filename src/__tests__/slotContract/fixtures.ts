import { REST_FIXTURES } from "./fixturesRest";
import { SECTION_31_FIXTURES } from "./fixturesSection31";
import type { SlotContractFixture } from "./types";

export const SLOT_CONTRACT_FIXTURES: SlotContractFixture[] = [
  ...SECTION_31_FIXTURES,
  ...REST_FIXTURES,
];

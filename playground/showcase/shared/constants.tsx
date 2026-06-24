export const COMBO_OPTIONS = [
  { value: "react", label: "React" },
  { value: "svelte", label: "Svelte" },
  { value: "vue", label: "Vue" },
];

export type TableRow = {
  id: number;
  name: string;
  role: string;
  status: "Active" | "On Leave";
};

export const TABLE_ROWS: TableRow[] = [
  { id: 1, name: "Kate Moore", role: "CEO", status: "Active" },
  { id: 2, name: "John Smith", role: "CTO", status: "Active" },
  { id: 3, name: "Sara Johnson", role: "CMO", status: "On Leave" },
];

export const STATUS_BADGE: Record<TableRow["status"], "success" | "warning"> = {
  Active: "success",
  "On Leave": "warning",
};

export const EXPANDABLE_INFO_ICON = (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden
    className="size-full"
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 16v-4M12 8h.01" />
  </svg>
);

export const SELECTION_INDICATOR_SIZES = ["small", "base", "mid", "large"] as const;

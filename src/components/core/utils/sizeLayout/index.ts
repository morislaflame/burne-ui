/**
 * Shared size grids for kit components.
 *
 * Families:
 * - `control` — Button, Input, Tabs, …
 * - `option` — Checkbox, Radio, Switch, ListBox rows
 * - `banner` — Alert, Toast
 * - `panel` — Dialog, AlertDialog, Popover, Card, Drawer
 * - `collapsible` — Disclosure, Expandable (Accordion)
 */

export {
  type ComponentSize,
  COMPONENT_SIZES,
  resolveComponentSize,
} from "./componentSize";

export {
  type ControlSizeLayout,
  CONTROL_SIZE_LAYOUT,
} from "./control";

export {
  type OptionControlSizeLayout,
  OPTION_CONTROL_SIZE_LAYOUT,
} from "./option";

export {
  type MessageBannerSize,
  type MessageBannerLoadingSize,
  type MessageBannerSizePreset,
  MESSAGE_BANNER_SIZE,
  resolveMessageBannerSize,
  messageBannerSizePreset,
  alertRootShellClass,
  toastViewportWidthPx,
} from "./banner";

export {
  type PanelSize,
  type PanelSizeLayout,
  type CardSize,
  PANEL_SIZE_LAYOUT,
  CARD_SIZE_LAYOUT,
  resolvePanelSize,
  resolveCardSize,
  panelSizeLayout,
  cardSizeLayout,
} from "./panel";

export {
  type CollapsibleSize,
  type CollapsibleSizeLayout,
  COLLAPSIBLE_SIZE_LAYOUT,
  resolveCollapsibleSize,
  collapsibleSizeLayout,
} from "./collapsible";

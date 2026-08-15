import {
  SelectionThumb as SelectionThumbRoot,
  SelectionThumbIcon,
} from "./SelectionThumb";

export const SelectionThumb = Object.assign(SelectionThumbRoot, {
  Icon: SelectionThumbIcon,
});

export type {
  SelectionThumbIconProps,
  SelectionThumbProps,
  SelectionThumbClassNames,
  SelectionThumbIconClassNames,
  SelectionThumbMotion,
  SelectionThumbPartMotion,
} from "./SelectionThumb";

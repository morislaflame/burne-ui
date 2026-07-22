import {
  SelectionThumb as SelectionThumbRoot,
  SelectionThumbIcon,
  type SelectionThumbIconProps,
  type SelectionThumbProps,
  type SelectionThumbClassNames,
  type SelectionThumbIconClassNames,
} from "./SelectionThumb";

export const SelectionThumb = Object.assign(SelectionThumbRoot, {
  Icon: SelectionThumbIcon,
});

export type {
  SelectionThumbIconProps,
  SelectionThumbProps,
  SelectionThumbClassNames,
  SelectionThumbIconClassNames,
};

import {
  CardBody,
  CardDescription,
  CardFooter,
  CardHeader,
  CardHeadingBlock,
  CardRoot,
  CardTitle,
} from "./Card";

export const Card = Object.assign(CardRoot, {
  Header: CardHeader,
  HeadingBlock: CardHeadingBlock,
  Title: CardTitle,
  Description: CardDescription,
  Body: CardBody,
  Footer: CardFooter,
});

export type {
  CardPressEvent,
  CardProps,
  CardVariant,
  CardHeaderProps,
  CardBodyProps,
  CardTitleProps,
  CardDescriptionProps,
  CardFooterProps,
} from "./Card";

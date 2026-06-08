import {
  CardBody,
  CardContent,
  CardDescription,
  CardFooter,
  CardRoot,
  CardTitle,
} from "./Card";

export const Card = Object.assign(CardRoot, {
  Content: CardContent,
  Title: CardTitle,
  Description: CardDescription,
  Body: CardBody,
  Footer: CardFooter,
});

export type {
  CardPressEvent,
  CardProps,
  CardVariant,
  CardContentProps,
  CardTitleProps,
  CardDescriptionProps,
  CardBodyProps,
  CardFooterProps,
} from "./Card";

import { IoLinkOutline } from "react-icons/io5";

import { Input } from "@/components/core/Input";

export function InputUrlAffixesDemo() {
  return (
    <div className="flex w-full max-w-md flex-col gap-small rounded-mid border-token bg-secondary p-mid">
      <Input className="w-full">
        <Input.Label>Домен проекта</Input.Label>
        <Input.Control placeholder="my-app" prefix="https://" suffix=".vercel.app" />
        <Input.Hint>Префикс и суффикс через prefix / suffix.</Input.Hint>
      </Input>
      <Input variant="outline" className="w-full">
        <Input.Label>Ссылка на превью</Input.Label>
        <Input.Control
          defaultValue="burne-ui-playground"
          prefix={<IoLinkOutline className="icon-base shrink-0 text-muted" aria-hidden />}
          suffix="/docs"
        />
      </Input>
    </div>
  );
}

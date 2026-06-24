import { IoRocketOutline } from "react-icons/io5";

import { Link } from "@/components/core/Link";

import { preventNav } from "../../shared/utils";

export function LinkVariantsDemo() {
  return (
    <div className="flex flex-wrap gap-mid">
      <Link href="#" onClick={preventNav}>
        Внутренняя ссылка
      </Link>
      <Link href="https://github.com" target="_blank" rel="noreferrer" showDefaultIcon>
        Внешняя ссылка
      </Link>
      <Link href="#" onClick={preventNav} underline leftIcon={<IoRocketOutline aria-hidden />}>
        С иконкой
      </Link>
      <Link href="#" onClick={preventNav} underline showDefaultIcon>
        Подчёркнутая
      </Link>
    </div>
  );
}

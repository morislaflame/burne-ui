import { useMemo, useState } from "react";
import { IoMenuOutline } from "react-icons/io5";

import { Button } from "@/components/core/Button";
import { Drawer } from "@/components/core/Drawer";
import { Text } from "@/components/core/Text";
import { Toast } from "@/components/core/Toast";
import { cn } from "@/utils/cn";

import {
  DEFAULT_SHOWCASE_PAGE_ID,
  findShowcasePage,
  SHOWCASE_GROUPS,
  type ShowcaseGroup,
} from "./registry";

function ShowcaseNavButton({
  label,
  active,
  onClick,
  className,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  className?: string;
}) {
  return (
    <Button
      type="button"
      variant={active ? "secondary" : "ghost"}
      className={cn(
        "justify-start text-left font-normal h-9 px-mid",
        !active && "text-muted hover:text-foreground",
        className,
      )}
      onClick={onClick}
    >
      {label}
    </Button>
  );
}

function ShowcaseSidebar({
  activePageId,
  onPageChange,
  className,
}: {
  activePageId: string;
  onPageChange: (pageId: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-mid overflow-y-auto min-h-0 flex-1 p-mid", className)}>
      {SHOWCASE_GROUPS.map((group: ShowcaseGroup) => (
        <div key={group.id} className="flex flex-col gap-xsmall">
          <Text
            as="span"
            variant="tools"
            className="px-small font-semibold uppercase tracking-wider mb-small underline-offset-4 underline"
          >
            {group.label}
          </Text>
          {group.pages.map((page) => (
            <ShowcaseNavButton
              key={page.id}
              label={page.label}
              active={activePageId === page.id}
              onClick={() => onPageChange(page.id)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}

function ComponentsCatalogBody({ embedded = false }: { embedded?: boolean }) {
  const [activePageId, setActivePageId] = useState(DEFAULT_SHOWCASE_PAGE_ID);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const currentPage = useMemo(
    () => findShowcasePage(activePageId) ?? findShowcasePage(DEFAULT_SHOWCASE_PAGE_ID)!,
    [activePageId],
  );

  const PageComponent = currentPage.Page;

  return (
    <div className={cn("flex h-full w-full overflow-hidden", embedded ? "max-w-none" : "max-w-7xl mx-auto")}>
      <aside className="hidden lg:flex h-full w-64 shrink-0 flex-col overflow-hidden border-r-token bg-surface">
        <ShowcaseSidebar activePageId={activePageId} onPageChange={setActivePageId} />
      </aside>

      <div className="lg:hidden fixed top-12 left-0 right-0 z-10 flex items-center justify-between border-b border-token bg-surface/90 px-mid py-xsmall backdrop-blur-md">
        <Text as="span" variant="base" className="font-semibold text-foreground">
          {currentPage.label}
        </Text>
        <Button
          size="small"
          variant="outline"
          leftIcon={<IoMenuOutline className="size-4" />}
          onClick={() => setMobileMenuOpen(true)}
        >
          Компоненты
        </Button>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden min-h-0 min-w-0">
        <div className="flex-1 overflow-y-auto px-mid py-xlarge lg:py-xlarge max-lg:pt-24">
          {!embedded && (
            <header className="flex flex-col gap-xsmall mb-large max-lg:hidden">
              <Text as="h1" variant="header-1">
                Burne UI
              </Text>
              <Text as="p" variant="base" className="text-muted">
                Локальный каталог компонентов из <code className="text-primary">src/</code> — то же API,
                что в Storybook.
              </Text>
            </header>
          )}

          <div className="max-w-4xl mx-auto w-full">
            <PageComponent key={currentPage.id} />
          </div>
        </div>
      </div>

      <Drawer open={mobileMenuOpen} onOpenChange={setMobileMenuOpen} placement="left" size="default">
        <Drawer.Header>
          <Drawer.HeadingBlock>
            <Drawer.Title>Компоненты</Drawer.Title>
            <Drawer.Description>Выберите компонент для просмотра.</Drawer.Description>
          </Drawer.HeadingBlock>
          <Drawer.Close />
        </Drawer.Header>
        <Drawer.Body className="p-0">
          <ShowcaseSidebar
            activePageId={activePageId}
            onPageChange={(pageId) => {
              setActivePageId(pageId);
              setMobileMenuOpen(false);
            }}
          />
        </Drawer.Body>
      </Drawer>
    </div>
  );
}

export function ComponentsCatalog({ embedded = false }: { embedded?: boolean } = {}) {
  return (
    <Toast.Provider>
      <ComponentsCatalogBody embedded={embedded} />
    </Toast.Provider>
  );
}

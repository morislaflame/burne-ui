import { type FormEvent, useState } from "react";

import { Button, Input, Toast, useToast } from "burne-ui";

function ToastRenameForm({ onSubmit }: { onSubmit: (name: string) => void }) {
  const [name, setName] = useState("");

  return (
    <form
      className="mt-small flex flex-col gap-small w-full"
      onSubmit={(e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const value = name.trim();
        if (!value) return;
        onSubmit(value);
      }}
    >
      <Input.Control
        size="small"
        placeholder="New name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        autoComplete="off"
      />
      <Button type="submit" size="small" variant="primary" disabled={!name.trim()}>
        Save
      </Button>
    </form>
  );
}

export function ToastClassNamesFullDemo() {
  const { toast } = useToast();

  return (
    <Button
      onClick={() => {
        let id = "";
        id = toast.show({
          title: "Rename item",
          description: (
            <ToastRenameForm
              onSubmit={() => {
                toast.dismiss(id);
              }}
            />
          ),
          timeout: 0,
          classNames: {
            root: "rounded-large",
            indicator: "text-primary",
            title: "font-semibold text-primary text-large",
            description: "text-foreground/80",
          },
        });
      }}
    >
      Show toast with form
    </Button>
  );
}

export function ToastClassNamesCompoundDemo() {
  return (
    <Toast
      status="success"
      classNames={{
        root: "rounded-large border-success/40 bg-success/10",
        title: "font-semibold text-success",
        description: "text-foreground/80",
        close: "text-success",
      }}
      onClose={() => {}}
      title="Compound toast"
      description="classNames on Toast root for declarative API."
    />
  );
}

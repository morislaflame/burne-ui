import { describe, expect, it } from "vitest";

import { Breadcrumbs } from "@/components/core/Breadcrumbs";
import { Calendar } from "@/components/core/Calendar";
import { Card } from "@/components/core/Card";
import { ComboBox } from "@/components/core/ComboBox";
import { ContextMenu } from "@/components/core/ContextMenu";
import { Dialog } from "@/components/core/Dialog";
import { Dropdown } from "@/components/core/Dropdown";
import { Pagination } from "@/components/core/Pagination";
import { PinInput } from "@/components/core/PinInput";
import { Select } from "@/components/core/Select";
import { TagsInput } from "@/components/core/TagsInput";
import { TimeField } from "@/components/core/TimeField";
import { AlertDialog } from "@/components/composite/AlertDialog";
import { Drawer } from "@/components/core/Drawer";

describe("displayName Xxx.Part", () => {
  it("uses one dotted name on the parts this release renamed", () => {
    expect(Select.Shell.displayName).toBe("Select.Shell");
    expect(ComboBox.Shell.displayName).toBe("ComboBox.Shell");
    expect(PinInput.Shell.displayName).toBe("PinInput.Shell");
    expect(PinInput.Control.displayName).toBe("PinInput.Control");
    expect(TagsInput.Shell.displayName).toBe("TagsInput.Shell");
    expect(TimeField.Control.displayName).toBe("TimeField.Control");
    expect(Dropdown.SubPopover.displayName).toBe("Dropdown.SubPopover");
    expect(ContextMenu.SubPopover.displayName).toBe("Dropdown.SubPopover");
    expect(Dialog.Overlay.displayName).toBe("Dialog.Overlay");
    expect(Drawer.Overlay.displayName).toBe("Drawer.Overlay");
    expect(AlertDialog.Overlay.displayName).toBe("AlertDialog.Overlay");
    expect(AlertDialog.Action.displayName).toBe("AlertDialog.Action");
    expect(AlertDialog.Cancel.displayName).toBe("AlertDialog.Cancel");
    expect(Calendar.Title.displayName).toBe("Calendar.Title");
    expect(Calendar.Day.displayName).toBe("Calendar.Day");
    expect(Breadcrumbs.Item.displayName).toBe("Breadcrumbs.Item");
    expect(Pagination.Page.displayName).toBe("Pagination.Page");
    expect(Card.displayName).toBe("Card");
  });
});

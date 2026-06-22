import focusGuard from "./focus-guard";

const dialogs = document.querySelectorAll(`[c-type="dialog"]`);

function getDialogTrigger(dialog: HTMLElement): HTMLElement | null {
  let children = dialog.children;

  for (const node of children) {
    const role = node.getAttribute("c-role");
    if (role === "dialog-trigger") return node as HTMLElement;
  }

  return null;
}

function getDialogContent(dialog: HTMLElement): HTMLElement | null {
  let children = dialog.children;

  for (const node of children) {
    const role = node.getAttribute("c-role");
    if (role === "dialog-content") return node as HTMLElement;
  }

  return null;
}
function closeDialog(modal: HTMLElement, modalBackdrop: HTMLElement) {
  modal.remove();
  modalBackdrop.remove();
  //focusGuard.close();
}

function buildDialog(dialog: HTMLElement) {
  const dialogTrigger = getDialogTrigger(dialog);
  const dialogContent = getDialogContent(dialog);

  const modal = document.createElement("div");
  const modalBackdrop = document.createElement("div");

  modal.tabIndex = -1;

  modal.setAttribute("role", "dialog");
  modal.setAttribute("aria-modal", "true");

  modal.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeDialog(modal, modalBackdrop);
    }
  });

  modalBackdrop.addEventListener("click", () => {
    closeDialog(modal, modalBackdrop);
  });

  dialogTrigger?.addEventListener("click", () => {
    modal.classList.add("dialog");
    modalBackdrop.classList.add("dialog-backdrop");

    modal.innerHTML = dialogContent?.innerHTML!;

    document.body.appendChild(modalBackdrop);
    document.body.appendChild(modal);

    modal.focus();

    //focusGuard.open(modal);
  });
}

export function initDialogs() {
  dialogs.forEach((dialog) => buildDialog(dialog as HTMLElement));
}

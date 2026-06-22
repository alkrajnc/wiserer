import { Aligment, Position } from "./common";

const OFFSET_FROM_ELEMENT = 5 as const;

const menus = document.querySelectorAll(`[c-type="dropdown"]`);

function getDropdownContent(menu: HTMLElement): HTMLElement | null {
  let children = menu.children;

  for (const node of children) {
    const role = node.getAttribute("c-role");
    if (role === "dropdown-content") return node as HTMLElement;
  }

  return null;
}

function getDropdownTrigger(menu: HTMLElement): HTMLElement | null {
  let children = menu.children;

  for (const node of children) {
    const role = node.getAttribute("c-role");
    if (role === "dropdown-trigger") return node as HTMLElement;
  }

  return null;
}

function getData<T>(menu: HTMLElement): T | null {
  const cData = menu.getAttribute("c-data");
  if (!cData) return null;

  return JSON.parse(cData) as T;
}

interface DropdownData {
  position: Position;
  aligment: Aligment;
}

function positionDropdownMenu(
  position: Position,
  dropdown: HTMLElement,
  target: HTMLElement,
) {
  const dropdownPos = { top: 0, left: 0 };
  const dropdownBoundingBox = dropdown.getBoundingClientRect();
  const targetBoundingBox = target.getBoundingClientRect();

  switch (position) {
    case "top": {
      dropdownPos.top =
        targetBoundingBox.top -
        dropdownBoundingBox.height -
        OFFSET_FROM_ELEMENT;
      dropdownPos.left =
        targetBoundingBox.left +
        targetBoundingBox.width / 2 -
        dropdownBoundingBox.width / 2;
      if (dropdownPos.left < 0) {
        dropdownPos.left = targetBoundingBox.left;
      }
      break;
    }
    case "bottom": {
      dropdownPos.top = targetBoundingBox.bottom + OFFSET_FROM_ELEMENT;
      dropdownPos.left =
        targetBoundingBox.left +
        targetBoundingBox.width / 2 -
        dropdownBoundingBox.width / 2;

      if (dropdownPos.left < 0) {
        dropdownPos.left = targetBoundingBox.left;
      }
      break;
    }
    case "left": {
      dropdownPos.top =
        targetBoundingBox.top +
        targetBoundingBox.height / 2 -
        dropdownBoundingBox.height / 2;
      dropdownPos.left =
        targetBoundingBox.left -
        dropdownBoundingBox.width -
        OFFSET_FROM_ELEMENT;
      break;
    }
    case "right": {
      dropdownPos.top =
        targetBoundingBox.top +
        targetBoundingBox.height / 2 -
        dropdownBoundingBox.height / 2;
      dropdownPos.left = targetBoundingBox.right + OFFSET_FROM_ELEMENT;
      break;
    }
  }

  dropdown.style.left = `${dropdownPos.left}px`;
  dropdown.style.top = `${dropdownPos.top}px`;
}

function createDropdownMenu(menu: HTMLElement) {
  const menuContent = getDropdownContent(menu)!;
  const menuTrigger = getDropdownTrigger(menu)!;
  const data: DropdownData = getData<DropdownData>(menu) ?? {
    position: "bottom",
    aligment: "center",
  };

  const dropdown = document.createElement("div");
  dropdown.classList.add("dropdown");
  dropdown.innerHTML = menuContent.innerHTML;

  menuTrigger.addEventListener("click", (e) => {
    positionDropdownMenu(data.position, dropdown, menu);
    document.body.appendChild(dropdown);
    dropdown.style.opacity = "1";
    e.stopPropagation();
    e.stopImmediatePropagation();
    document.addEventListener("click", (e) => {
      console.log(e);
      if (e.target !== dropdown) {
        dropdown.remove();
      }
    });
  });
}

export function initDropdownMenus() {
  menus.forEach((menu) => createDropdownMenu(menu as HTMLElement));
}

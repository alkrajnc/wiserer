import { CloseDialog } from "./dialog";
import focusGuard from "./focus-guard";

const sidebarToggleButton = document.getElementById("sidebar-toggle-button");
const programList = document.getElementById("programs-list");

const sidebar = document.getElementById("sidebar")!;
const newProgramButton = document.getElementById("program-add-button");
const programSelectDialog = document.getElementById("program-select-dialog");

const SIDEBAR_STATE_KEY = "ui.sidebar";

function saveValue(key: string, value: string) {
  localStorage.setItem(key, value);
}

function getValue<T>(key: string): T | null {
  const value = localStorage.getItem(key);
  if (!value) {
    return null;
  }
  return JSON.parse(value);
}

interface SidebarState {
  collapsed: boolean;
}

class ProgramList {
  private _programs: string[] = [];

  get programs() {
    return this._programs;
  }

  set programs(value: string[]) {
    this._programs = value;
    this.onChange();
  }

  private onChange() {
    saveValue("programs", JSON.stringify(this._programs));
  }

  constructor() {
    const storedPrograms = getValue<string[]>("programs");
    if (storedPrograms) {
      this._programs = storedPrograms;
      return;
    }
    this.programs = [];
  }

  private createElement(program: string): HTMLElement {
    const params = new URLSearchParams(window.location.search);

    const slug = params.get("program");
    console.log(slug);
    const deleteProgramIcon = document.createElement("i");
    deleteProgramIcon.dataset.lucide = "trash-2";
    deleteProgramIcon.style.width = "18";
    deleteProgramIcon.style.height = "18";
    deleteProgramIcon.classList.add("delete-program-icon", "hidden-child");
    deleteProgramIcon.innerText = "D";

    const deleteProgramButton = document.createElement("div");
    deleteProgramButton.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      this.remove(program);
    });
    deleteProgramButton.append(deleteProgramIcon);

    const programChip = document.createElement("div");
    programChip.classList.add("surface", "program-chip", "parent");
    programChip.dataset.value = program;
    programChip.innerText = program;
    programChip.append(deleteProgramButton);
    if (program === slug) {
      programChip.dataset.active = "true";
    }

    const programChipLink = document.createElement("a");
    programChipLink.href = `?program=${program}`;
    programChipLink.append(programChip);

    return programChipLink;
  }

  render() {
    const params = new URLSearchParams(window.location.search);
    const program = params.get("program");
    if (program && this.programs.length === 0) {
      this.add(program);
      return;
    }
    this.programs.forEach((it) => {
      programList?.append(this.createElement(it));
    });
  }

  add(slug: string) {
    if (this.programs.find((it) => it === slug)) return;
    this.programs = [...this.programs, slug];
    programList?.appendChild(this.createElement(slug));
    programSelectDialog?.dispatchEvent(CloseDialog);
  }
  remove(slug: string) {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(`a > div.program-chip`),
    );

    const activeIdx = elements.findIndex((el) => el.dataset.active === "true");
    if (activeIdx === -1) return;

    elements[activeIdx].remove();

    if (elements.length === 1) {
      history.replaceState({}, "", `/`);
      document.location.reload();
    }

    const nextElement = elements[activeIdx + 1] ?? elements[activeIdx - 1];
    if (nextElement) {
      nextElement.dataset.active = "true";
      const params = new URLSearchParams(window.location.search);
      params.set("program", nextElement.dataset.value ?? "");
      history.replaceState({}, "", `?${params}`);
      document.location.reload();
    }

    this.programs = this.programs.filter((it) => it !== slug);
  }
}

const Programs = new ProgramList();

export function toggleSidebar() {
  if (sidebar?.dataset.collapsed === "true") {
    sidebar.dataset.collapsed = "false";
    saveValue(SIDEBAR_STATE_KEY, JSON.stringify({ collapsed: false }));
  } else {
    sidebar.dataset.collapsed = "true";
    saveValue(SIDEBAR_STATE_KEY, JSON.stringify({ collapsed: true }));
  }
}

function handleNewProgramSelect() {
  const choices = document.querySelectorAll(
    "div.dialog > ul.program-list > li.program-item",
  );

  choices.forEach((el) => {
    const target = el as HTMLElement;
    const slug = target.dataset.value;
    if (!slug) return;
    el.addEventListener("click", () => {
      Programs.add(slug);
    });
  });
}

export function initSidebar() {
  Programs.render();

  newProgramButton?.addEventListener("click", () => {
    setTimeout(() => {
      handleNewProgramSelect();
    }, 100);
  });

  document.body.addEventListener("keydown", (e) => {
    if (focusGuard.isOpen) return;
    if (e.ctrlKey) {
      switch (e.key) {
        case "\\": {
          toggleSidebar();
          break;
        }
      }
    }
  });

  const sidebarState = getValue<SidebarState>(SIDEBAR_STATE_KEY);

  if (sidebarState?.collapsed) {
    sidebar.dataset.collapsed = "true";
  }

  sidebarToggleButton?.addEventListener("click", () => {
    toggleSidebar();
  });
}

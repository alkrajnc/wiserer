import focusGuard from "./focus-guard";

const sidebarToggleButton = document.getElementById("sidebar-toggle-button");

const sidebar = document.getElementById("sidebar")!;

const SIDEBAR_STATE_KEY = "ui.sidebar";

function saveState(key: string, value: string) {
  localStorage.setItem(key, value);
}

function getState<T>(key: string): T | null {
  const value = localStorage.getItem(key);
  if (!value) {
    return null;
  }
  return JSON.parse(value);
}

interface SidebarState {
  collapsed: boolean;
}

export function toggleSidebar() {
  if (sidebar?.dataset["collapsed"] === "true") {
    sidebar.dataset["collapsed"] = "false";
    saveState(SIDEBAR_STATE_KEY, JSON.stringify({ collapsed: false }));
  } else {
    sidebar.dataset["collapsed"] = "true";
    saveState(SIDEBAR_STATE_KEY, JSON.stringify({ collapsed: true }));
  }
}

export function initSidebar() {
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

  const sidebarState = getState<SidebarState>(SIDEBAR_STATE_KEY);

  if (sidebarState?.collapsed) {
    sidebar.dataset["collapsed"] = "true";
  }

  sidebarToggleButton?.addEventListener("click", () => {
    toggleSidebar();
  });
}

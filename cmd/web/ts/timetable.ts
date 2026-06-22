import { attachTooltip } from "./components";
import focusGuard from "./focus-guard";

const nextWeekButton = document.getElementById("next-week-button")!;
const prevWeekButton = document.getElementById("prev-week-button")!;

export function initTimetable() {
  document.body.addEventListener("keydown", (e) => {
    if (focusGuard.isOpen) return;
    if (e.ctrlKey) {
      switch (e.key) {
        case "ArrowRight": {
          nextWeekButton.click();
          break;
        }
        case "ArrowLeft": {
          prevWeekButton.click();
          break;
        }
      }
    }
  });
}

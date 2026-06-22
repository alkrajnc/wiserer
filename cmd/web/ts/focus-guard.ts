const focusGuard = (() => {
  let open = false;
  let trapElement: HTMLElement | null = null;

  const guard = document.createElement("div");
  guard.id = "focus-guard";
  guard.dataset.focusGuard = "true";
  guard.setAttribute("aria-hidden", "true");
  guard.tabIndex = 0;

  guard.style.position = "fixed";
  guard.style.width = "1px";
  guard.style.height = "1px";
  guard.style.overflow = "hidden";
  guard.style.clip = "rect(0 0 0 0)";
  guard.style.whiteSpace = "nowrap";

  guard.addEventListener("focus", () => {
    if (open && trapElement) {
      trapElement.focus();
    }
  });

  document.body.appendChild(guard);

  return {
    element: guard,

    get isOpen() {
      return open;
    },

    /**
     * Activate the guard.
     * @param {HTMLElement} [returnFocusTo] element to refocus if the guard catches Tab focus
     */
    open(returnFocusTo: HTMLElement) {
      open = true;
      trapElement = returnFocusTo ?? null;
      guard.setAttribute("data-open", "true");
    },

    close() {
      open = false;
      trapElement = null;
      guard.removeAttribute("data-open");
    },
  };
})();

export default focusGuard;

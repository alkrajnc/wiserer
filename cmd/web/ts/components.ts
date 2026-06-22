type TooltipPosition = "top" | "bottom" | "left" | "right";

export const TOOLTIP_MIN_HOVER_TIME = 200;

interface TooltipOptions {
  text: string;
  target: HTMLElement;
  position?: TooltipPosition;
  keys?: string[];
}

export function createTooltip(options: TooltipOptions) {
  const OFFSET_FROM_ELEMENT = 5;
  const pos = options.position ?? "top";

  document.querySelectorAll(".tooltip").forEach((el) => el.remove());

  const boundingBox = options.target.getBoundingClientRect();

  const tooltip = document.createElement("div");
  tooltip.id = "tooltip";
  tooltip.classList.add("tooltip");

  const describedBy = options.target.getAttribute("aria-describedby");
  if (describedBy) {
    tooltip.classList.add(describedBy);
  }

  tooltip.innerText = options.text;
  tooltip.style.position = "absolute";
  tooltip.style.opacity = "0";
  if (options.keys) {
    for (const key of options.keys) {
      const kbd = document.createElement("kbd");
      kbd.innerHTML = key;
      tooltip.appendChild(kbd);
    }
  }

  document.body.appendChild(tooltip);
  const tooltipBoundingBox = tooltip.getBoundingClientRect();

  const tooltipPosition = {
    left: 0,
    top: 0,
  };

  switch (pos) {
    case "top": {
      tooltipPosition.top =
        boundingBox.top - tooltipBoundingBox.height - OFFSET_FROM_ELEMENT;
      tooltipPosition.left =
        boundingBox.left + boundingBox.width / 2 - tooltipBoundingBox.width / 2;
      if (tooltipPosition.left < 0) {
        tooltipPosition.left = boundingBox.left;
      }
      break;
    }
    case "bottom": {
      tooltipPosition.top = boundingBox.bottom + OFFSET_FROM_ELEMENT;
      tooltipPosition.left =
        boundingBox.left + boundingBox.width / 2 - tooltipBoundingBox.width / 2;

      if (tooltipPosition.left < 0) {
        tooltipPosition.left = boundingBox.left;
      }
      break;
    }
    case "left": {
      tooltipPosition.top =
        boundingBox.top +
        boundingBox.height / 2 -
        tooltipBoundingBox.height / 2;
      tooltipPosition.left =
        boundingBox.left - tooltipBoundingBox.width - OFFSET_FROM_ELEMENT;
      break;
    }
    case "right": {
      tooltipPosition.top =
        boundingBox.top +
        boundingBox.height / 2 -
        tooltipBoundingBox.height / 2;
      tooltipPosition.left = boundingBox.right + OFFSET_FROM_ELEMENT;
      break;
    }
  }

  tooltip.style.left = `${tooltipPosition.left}px`;
  tooltip.style.top = `${tooltipPosition.top}px`;

  tooltip.style.opacity = "1";
}

export function destroyTooltip() {
  const tooltip = document.getElementById("tooltip");
  tooltip?.remove();
}

interface AttachTooltipOptions {
  keys?: string[];
}

export function attachTooltip(
  element: HTMLElement,
  text: string,
  position: TooltipPosition = "top",
  opts?: AttachTooltipOptions,
) {
  let hoverTimer: number | undefined;

  element.setAttribute("aria-label", text);

  element.addEventListener("mouseenter", () => {
    hoverTimer = setTimeout(() => {
      createTooltip({
        text,
        target: element,
        position,
        keys: opts?.keys,
      });
    }, TOOLTIP_MIN_HOVER_TIME);
  });

  element.addEventListener("mouseleave", () => {
    clearTimeout(hoverTimer);
    destroyTooltip();
  });
}

export function attachDynamicTooltip(
  element: HTMLElement,
  getText: () => string,
  position: TooltipPosition = "top",
  opts?: AttachTooltipOptions,
) {
  let hoverTimer: number | undefined;

  const updateLabel = () => {
    element.setAttribute("aria-label", getText());
  };
  updateLabel();

  element.addEventListener("mouseenter", () => {
    updateLabel();
    hoverTimer = setTimeout(() => {
      createTooltip({
        text: getText(),
        target: element,
        position,
        keys: opts?.keys,
      });
    }, TOOLTIP_MIN_HOVER_TIME);
  });
  element.addEventListener("mouseleave", () => {
    clearTimeout(hoverTimer);
    destroyTooltip();
  });
}

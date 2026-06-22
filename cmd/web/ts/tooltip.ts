const targets = document.querySelectorAll(`[c-type="tooltip"]`);

type TooltipPosition = "top" | "bottom" | "left" | "right";

const TOOLTIP_MIN_HOVER_TIME = 180 as const;
const OFFSET_FROM_ELEMENT = 5 as const;

interface TooltipOptions {
  position: TooltipPosition;
  content: string;
}

function getTooltipOptions(target: HTMLElement): TooltipOptions | null {
  const opts = target.getAttribute("c-data");
  if (!opts) return null;
  return JSON.parse(opts) as TooltipOptions;
}

function createTooltip(target: HTMLElement): HTMLElement {
  const { position, content } = getTooltipOptions(target)!;

  const tooltip = document.createElement("div");
  tooltip.classList.add("tooltip");
  tooltip.innerHTML = content;
  const boundingBox = target.getBoundingClientRect();
  document.body.appendChild(tooltip);
  const tooltipBoundingBox = tooltip.getBoundingClientRect();

  const tooltipPosition = {
    left: 0,
    top: 0,
  };

  switch (position) {
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

  return tooltip;
}

export function destroyTooltip(tooltip?: HTMLElement) {
  tooltip?.remove();
}

function instanciateTooltip(target: HTMLElement) {
  let hoverTimer: number | undefined;

  let tooltip: HTMLElement | undefined;

  target.addEventListener("mouseenter", () => {
    hoverTimer = setTimeout(() => {
      tooltip = createTooltip(target);
    }, TOOLTIP_MIN_HOVER_TIME);
  });

  target.addEventListener("mouseleave", () => {
    clearTimeout(hoverTimer);
    destroyTooltip(tooltip);
  });
}

export function initTooltips() {
  targets.forEach((target) => instanciateTooltip(target as HTMLElement));
}

import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stringToColor(input: string): string {
  let hash = 0x811c9dc5; // FNV offset basis

  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash +=
      (hash << 1) + (hash << 4) + (hash << 7) + (hash << 8) + (hash << 24);
  }

  hash ^= hash >>> 16;
  hash *= 0x85ebca6b;
  hash ^= hash >>> 13;
  hash *= 0xc2b2ae35;
  hash ^= hash >>> 16;

  const hue = Math.abs(hash % 360);
  const saturation = 50 + (Math.abs(hash) % 30);
  const lightness = 20 + (Math.abs(hash >> 8) % 20);

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

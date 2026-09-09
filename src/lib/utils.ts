import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function formatSourceType(type: string): string {
  switch (type) {
    case "OFFICIAL":
      return "Official source";
    case "SECONDARY":
      return "Secondary source";
    case "USER":
      return "User-contributed";
    default:
      return type;
  }
}

export function isSecondary(sourceType?: string | null): boolean {
  return sourceType === "SECONDARY" || sourceType === "USER";
}

export const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
export const DAY_FULL = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

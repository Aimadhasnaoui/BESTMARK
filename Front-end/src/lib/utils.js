import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Resolves a relative image path returned by the API (e.g. "/uploads/employees/...")
// into an absolute URL pointing at the backend (VITE_IMG_URL has no "/api" prefix, unlike VITE_BASE_URL).
export function getImageUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//i.test(path) || path.startsWith("blob:")) return path;
  const origin = (import.meta.env.VITE_IMG_URL || "").replace(/\/+$/, "");
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${origin}${cleanPath}`;
}

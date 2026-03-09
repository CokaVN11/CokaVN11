import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function repeat<T>(count: number, fn: (index: number) => T): T[] {
  return Array.from({ length: count }, (_, i) => fn(i));
}

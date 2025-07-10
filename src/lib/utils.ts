import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function isError(err: unknown): err is Error {
  return typeof err === 'object' && err !== null && 'message' in err;
}

export function getErrorMessage(error: unknown): string {
  if (isError(error)) {
    return error.message || "An unknown error occurred.";
  }
  // Fallback for non-Error objects.
  if (typeof error === 'string') {
    return error;
  }
  // For numbers, booleans, null, undefined, or objects without a 'message' property
  return "An unexpected error occurred. Please try again.";
}
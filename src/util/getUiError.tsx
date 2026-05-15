import type { ApiError } from "../api/apiClient";

export interface UiError {
  message: string;
  fieldErrors?: Record<string, string>;
}

function isApiError(e: unknown): e is ApiError {
  return (
    typeof e === "object" &&
    e !== null &&
    "message" in e &&
    typeof (e as ApiError).message === "string"
  );
}

// can only handle unknown to e
export function getUiError(e: unknown): UiError {
  if (isApiError(e)) {
    return {
      message: e.message,
      fieldErrors: e.fieldErrors,
    };
  }
  if (e instanceof Error) {
    return {
      message: e.message,
    };
  }
  return { message: "Unexpected error" };
}

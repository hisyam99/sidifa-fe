// Error handling utilities for consistent error message extraction

export interface BackendError {
  message: string;
  error: string;
  statusCode: number;
}

export interface ApiErrorResponse {
  response?: {
    data?: BackendError;
    status?: number;
  };
  message?: string;
}

/**
 * Type guard to check if error is an ApiErrorResponse
 */
function isApiErrorResponse(
  error: ApiErrorResponse | string,
): error is ApiErrorResponse {
  return typeof error === "object" && error !== null;
}

/**
 * Check if error is a rate limit error (429)
 * This prevents session clearing for rate limit errors
 */
export const isRateLimitError = (error: any): boolean => {
  return (
    error?.isRateLimit === true ||
    error?.name === "RateLimitError" ||
    error?.response?.status === 429 ||
    (error?.message && error.message.includes("Terlalu banyak permintaan"))
  );
};

/**
 * Check if error is an authentication error (401)
 * This indicates session should be cleared
 */
export const isAuthError = (error: any): boolean => {
  return (
    error?.response?.status === 401 ||
    (error?.message &&
      (error.message.includes("401") ||
        error.message.includes("Sesi telah berakhir") ||
        error.message.includes("Unauthorized")))
  );
};

/**
 * Extract error message from backend response
 * Backend provides consistent error format: { message, error, statusCode }
 */
export const extractErrorMessage = (
  error: ApiErrorResponse | string,
): string => {
  // If it's a string, return it directly
  if (typeof error === "string") {
    return error;
  }

  // Check if it's an ApiErrorResponse object
  if (isApiErrorResponse(error)) {
    // Backend already provides clear error messages
    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    // Fallback for direct error message
    if (error.message) {
      return error.message;
    }
  }

  // Last resort fallback
  return "Terjadi kesalahan. Silakan coba lagi.";
};

// lib/auth-errors.ts

export function getAuthErrorMessage(error: unknown): string {
  if (!(error instanceof Error)) {
    return "An unexpected error occurred. Please try again.";
  }

  const errorMessage = error.message.toLowerCase();

  // Account doesn't exist
  if (errorMessage.includes("invalidaccountid")) {
    return "No account found with this email. Please sign up first.";
  }

  // Wrong password
  if (errorMessage.includes("invalid password") || errorMessage.includes("incorrect password")) {
    return "Incorrect password. Please try again.";
  }

  // Account already exists
  if (
    errorMessage.includes("account with email") ||
    errorMessage.includes("already exists") ||
    errorMessage.includes("duplicate")
  ) {
    return "An account with this email already exists. Please sign in instead.";
  }

  // Invalid email format
  if (errorMessage.includes("invalid email")) {
    return "Please enter a valid email address.";
  }

  // Password too weak
  if (errorMessage.includes("password") && errorMessage.includes("weak")) {
    return "Password is too weak. Use at least 8 characters.";
  }

  // Network/server errors
  if (
    errorMessage.includes("network") ||
    errorMessage.includes("fetch") ||
    errorMessage.includes("timeout")
  ) {
    return "Network error. Please check your connection and try again.";
  }

  // JWT/Auth token errors
  if (errorMessage.includes("jwt") || errorMessage.includes("token")) {
    return "Authentication error. Please try signing in again.";
  }

  // Rate limiting
  if (errorMessage.includes("rate limit") || errorMessage.includes("too many")) {
    return "Too many attempts. Please wait a moment and try again.";
  }

  // Generic server error
  if (errorMessage.includes("server error") || errorMessage.includes("500")) {
    return "Server error. Please try again in a moment.";
  }

  // Fallback - show a cleaned version without the stack trace
  const cleanMessage = error.message.split("\n")[0];
  if (cleanMessage.length < 100) {
    return cleanMessage;
  }

  return "Something went wrong. Please try again.";
}

// Optional: Type-safe error codes if you want more control
export enum AuthErrorCode {
  INVALID_CREDENTIALS = "INVALID_CREDENTIALS",
  ACCOUNT_NOT_FOUND = "ACCOUNT_NOT_FOUND",
  ACCOUNT_EXISTS = "ACCOUNT_EXISTS",
  WEAK_PASSWORD = "WEAK_PASSWORD",
  NETWORK_ERROR = "NETWORK_ERROR",
  SERVER_ERROR = "SERVER_ERROR",
  UNKNOWN = "UNKNOWN",
}

export function getAuthErrorCode(error: unknown): AuthErrorCode {
  if (!(error instanceof Error)) return AuthErrorCode.UNKNOWN;

  const errorMessage = error.message.toLowerCase();

  if (errorMessage.includes("invalidaccountid")) {
    return AuthErrorCode.ACCOUNT_NOT_FOUND;
  }
  if (errorMessage.includes("invalid password")) {
    return AuthErrorCode.INVALID_CREDENTIALS;
  }
  if (errorMessage.includes("already exists")) {
    return AuthErrorCode.ACCOUNT_EXISTS;
  }
  if (errorMessage.includes("weak")) {
    return AuthErrorCode.WEAK_PASSWORD;
  }
  if (errorMessage.includes("network")) {
    return AuthErrorCode.NETWORK_ERROR;
  }
  if (errorMessage.includes("server")) {
    return AuthErrorCode.SERVER_ERROR;
  }

  return AuthErrorCode.UNKNOWN;
}
export interface ApiError {
  message: string;
  status?: number;
  code?: string;
}

export class AppError extends Error {
  public status: number;
  public code?: string;

  constructor(message: string, status: number = 500, code?: string) {
    super(message);
    this.name = "AppError";
    this.status = status;
    this.code = code;
  }
}

export function handleApiError(error: unknown): ApiError {
  if (error instanceof AppError) {
    return {
      message: error.message,
      status: error.status,
      code: error.code,
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      status: 500,
    };
  }

  return {
    message: "An unexpected error occurred",
    status: 500,
  };
}

export function createApiError(
  message: string,
  status: number = 500,
  code?: string
): AppError {
  return new AppError(message, status, code);
}

export function isApiError(error: unknown): error is ApiError {
  return typeof error === "object" && error !== null && "message" in error;
}

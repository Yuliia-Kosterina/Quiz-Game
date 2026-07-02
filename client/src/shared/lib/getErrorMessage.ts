type ErrorWithData = {
  data?: {
    message?: string;
  };
};

export function getErrorMessage(error: unknown, fallback: string): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "data" in error &&
    typeof (error as ErrorWithData).data?.message === "string"
  ) {
    return (error as ErrorWithData).data?.message ?? fallback;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return fallback;
}

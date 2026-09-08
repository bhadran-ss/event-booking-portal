export function getApiError(error) {
  const validationErrors = error.response?.data?.errors;

  if (Array.isArray(validationErrors)) {
    return validationErrors
      .map((item) => item.message || item.msg)
      .filter(Boolean)
      .join(", ");
  }

  return (
    error.response?.data?.message ||
    error.response?.data?.error ||
    error.message ||
    "Something went wrong. Please try again."
  );
}

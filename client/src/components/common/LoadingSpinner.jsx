export default function LoadingSpinner({ size = "md" }) {
  const sizes = {
    sm: "h-4 w-4",
    md: "h-7 w-7",
    lg: "h-10 w-10",
  };

  return (
    <span
      className={`inline-block animate-spin rounded-full border-2 border-current border-r-transparent ${sizes[size]}`}
      role="status"
      aria-label="Loading"
    />
  );
}

import { useEffect } from "react";

export default function Error({
  children,
  error,
  reset = () => window.history.back(),
}: {
  children: React.ReactNode;
  error?: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Report to monitoring platform like Sentry
    if (error) {
      console.error("Caught error:", error);
    }
  }, [error]);
  if (!error) return <>{children}</>;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-4">Oops, something went wrong</h2>
      <p className="text-gray-600 mb-4">
        {error.message || "Failed to load page"}
      </p>
      <button
        onClick={() => reset()}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Try again
      </button>
    </div>
  );
}

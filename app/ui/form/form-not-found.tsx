import Link from "next/link";

export function FormNotFound() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <h2 className="text-2xl font-bold mb-2">Form Not Found</h2>
        <p className="text-gray-600 mb-6">
          This form doesn't exist or hasn't been published yet.
        </p>
        <Link
          href="/builder"
          className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create a Form
        </Link>
      </div>
    </div>
  );
}

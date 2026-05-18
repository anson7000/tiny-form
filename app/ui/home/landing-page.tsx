import Link from "next/link";

export function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 pt-20 pb-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-3xl">T</span>
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            Build Forms in Under 60 Seconds
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Zero-code form builder. Click, configure, and publish.
          </p>
          <div className="flex gap-4 justify-center">
            <Link href="/builder" className="text-lg px-8 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors py-3">
              Start Building 
            </Link>
            <Link href="/dashboard" className="text-lg px-8 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors py-3">
              View Dashboard
            </Link>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-24">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h4 className="font-semibold mb-2">Click Fields</h4>
              <p className="text-sm text-gray-600">
                Add text, email, dropdown, or message fields
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h4 className="font-semibold mb-2">Set Your PIN</h4>
              <p className="text-sm text-gray-600">
                Choose a 4-digit PIN to protect your dashboard
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h4 className="font-semibold mb-2">Share the Link</h4>
              <p className="text-sm text-gray-600">
                Copy the form URL and share with customers
              </p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                4
              </div>
              <h4 className="font-semibold mb-2">Manage Responses</h4>
              <p className="text-sm text-gray-600">
                View, filter, and export submissions
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

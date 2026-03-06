export default function PremiumGate({ children }) {
  const isPremium = false // Will be replaced with actual profile check

  if (isPremium) {
    return children
  }

  return (
    <div className="relative">
      <div className="blur-sm pointer-events-none">
        {children}
      </div>
      <div className="absolute inset-0 flex items-center justify-center bg-black/10 rounded-lg">
        <div className="bg-white p-8 rounded-lg shadow-lg text-center max-w-md">
          <h3 className="text-xl font-bold text-scarlet mb-2">Premium Feature</h3>
          <p className="text-gray-600 mb-6">
            This feature is only available to Premium subscribers. Upgrade to access Easy A Finder, Professor Ratings, and more.
          </p>
          <a
            href="/settings#upgrade"
            className="inline-block bg-scarlet text-white px-6 py-3 rounded-lg font-semibold hover:bg-red-700 transition"
          >
            Upgrade to Premium
          </a>
        </div>
      </div>
    </div>
  )
}
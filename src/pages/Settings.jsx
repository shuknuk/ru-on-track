export default function Settings() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-3xl font-bold text-scarlet mb-8">Settings</h1>
      <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Account</h2>
          <p className="text-gray-600">Email: user@scarletmail.rutgers.edu</p>
          <p className="text-gray-600">Major: Computer Science</p>
        </div>
        <div className="mb-6">
          <h2 className="text-xl font-bold mb-4">Subscription</h2>
          <p className="text-gray-600">Current plan: Free Tier</p>
          <button className="mt-4 bg-scarlet text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition">
            Upgrade to Premium
          </button>
        </div>
      </div>
    </div>
  )
}
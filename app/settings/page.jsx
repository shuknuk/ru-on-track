'use client'

import Navbar from '@/app/components/layout/Navbar'
import Sidebar from '@/app/components/layout/Sidebar'
import { useAuth } from '@/app/AuthProvider'
import Markdown from '@/app/components/common/Markdown'

export default function Settings() {
  const { profile, signOut } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-scarlet mb-8">Settings</h1>
          <div className="bg-white rounded-lg shadow p-6 max-w-2xl">
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">Account</h2>
              <Markdown className="text-gray-600" content={`Email: ${profile?.email || 'Not available'}`} />
              <Markdown className="text-gray-600" content={`Major: ${profile?.major_primary || 'Not set'}`} />
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">Subscription</h2>
              <Markdown className="text-gray-600" content={`Current plan: ${profile?.is_premium ? 'Premium' : 'Free Tier'}`} />
              {!profile?.is_premium && (
                <button className="mt-4 bg-scarlet text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition">
                  Upgrade to Premium
                </button>
              )}
            </div>
            <div className="mb-6">
              <h2 className="text-xl font-bold mb-4">Actions</h2>
              <button
                onClick={signOut}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

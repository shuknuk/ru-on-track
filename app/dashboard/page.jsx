'use client'

import Link from 'next/link'
import { useAuth } from '@/app/AuthProvider'
import Navbar from '@/app/components/layout/Navbar'
import Sidebar from '@/app/components/layout/Sidebar'
import { calculateRemainingCredits } from '@/app/utils/creditCounter'

export default function Dashboard() {
  const { profile } = useAuth()

  const totalCreditsPlanned = 0
  const creditsCompleted = profile?.credits_completed || 0
  const creditsRemaining = calculateRemainingCredits(creditsCompleted)
  const gpaGoal = profile?.gpa_goal || 3.5
  const yearsRemaining = profile?.years_to_complete || 4

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-scarlet mb-2">
              Welcome back{profile?.email ? `, ${profile.email.split('@')[0]}` : ''}!
            </h1>
            <p className="text-gray-600">
              {profile?.major_primary && `Major: ${profile.major_primary}`}
              {profile?.major_secondary && ` & ${profile.major_secondary}`}
              {profile?.grad_year && ` • Graduating ${profile.grad_year}`}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-2">Credits Planned</h2>
              <p className="text-3xl font-bold text-scarlet">{totalCreditsPlanned}</p>
              <p className="text-sm text-gray-500 mt-2">Courses in your plan</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-2">Credits Remaining</h2>
              <p className="text-3xl font-bold text-scarlet">{creditsRemaining}</p>
              <p className="text-sm text-gray-500 mt-2">To reach 120 credits</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-2">GPA Goal</h2>
              <p className="text-3xl font-bold text-scarlet">{gpaGoal.toFixed(1)}</p>
              <p className="text-sm text-gray-500 mt-2">Target GPA</p>
            </div>
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-2">Semesters Left</h2>
              <p className="text-3xl font-bold text-scarlet">{yearsRemaining * 2}</p>
              <p className="text-sm text-gray-500 mt-2">{yearsRemaining} year{yearsRemaining !== 1 ? 's' : ''}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
              <div className="space-y-4">
                <Link
                  href="/planner"
                  className="block p-4 border border-gray-200 rounded-lg hover:border-scarlet hover:bg-scarlet/5 transition group"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-scarlet/10 rounded-lg flex items-center justify-center mr-4 group-hover:bg-scarlet/20 transition">
                      <span className="text-scarlet font-bold text-lg">📅</span>
                    </div>
                    <div>
                      <h3 className="font-bold">4-Year Planner</h3>
                      <p className="text-sm text-gray-600">Drag and drop courses</p>
                    </div>
                  </div>
                </Link>
                <Link
                  href="/easyA"
                  className="block p-4 border border-gray-200 rounded-lg hover:border-yellow-500 hover:bg-yellow-50 transition group"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-yellow-200 transition">
                      <span className="text-yellow-700 font-bold text-lg">⭐</span>
                    </div>
                    <div>
                      <h3 className="font-bold">Easy A Finder</h3>
                      <p className="text-sm text-gray-600">GPA-boosting courses</p>
                    </div>
                  </div>
                </Link>
                <Link
                  href="/professors"
                  className="block p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition group"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mr-4 group-hover:bg-blue-200 transition">
                      <span className="text-blue-700 font-bold text-lg">👨‍🏫</span>
                    </div>
                    <div>
                      <h3 className="font-bold">Professor Ratings</h3>
                      <p className="text-sm text-gray-600">RateMyProfessors links</p>
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <h2 className="text-xl font-bold mb-4">Progress Overview</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Credits Completed</span>
                    <span>{creditsCompleted} / 120</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-green-500 rounded-full"
                      style={{ width: `${Math.min(100, (creditsCompleted / 120) * 100)}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Time Progress</span>
                    <span>{4 - yearsRemaining} / 4 years</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div
                      className="h-full bg-scarlet rounded-full"
                      style={{ width: `${((4 - yearsRemaining) / 4) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="pt-4 border-t">
                    <p className="text-sm text-gray-600">
                      <span className="font-semibold">Next Step:</span> Add courses to your 4-year plan to track your progress.
                    </p>
                    <Link
                      href="/planner"
                      className="inline-block mt-3 bg-scarlet text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                    >
                      Start Planning
                    </Link>
                  </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

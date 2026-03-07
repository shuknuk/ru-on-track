'use client'

import Navbar from '@/app/components/layout/Navbar'
import Sidebar from '@/app/components/layout/Sidebar'

export default function Professors() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <div className="flex-1 p-8">
          <h1 className="text-3xl font-bold text-scarlet mb-8">Professor Ratings</h1>
          <div className="bg-white rounded-lg shadow p-6">
            <p className="mb-4">Premium feature under construction</p>
            <p className="text-sm text-gray-600">
              This feature will link to RateMyProfessors.com with appropriate disclaimers.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

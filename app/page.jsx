import Link from 'next/link'
import Markdown from '@/app/components/common/Markdown'

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-scarlet/10 to-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-6xl font-bold text-center text-scarlet mb-6">
          RutgersPlan
        </h1>
        <Markdown
          className="text-xl text-center text-rutgers-gray mb-12"
          content="Build your perfect **4-year course plan** at Rutgers University"
        />
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
            <Markdown
              className="mb-6"
              content="RutgersPlan is under development. We’re building a smarter way to plan your college career."
            />
            <Link
              href="/auth"
              className="block w-full bg-scarlet text-white text-center py-3 rounded-lg font-semibold hover:bg-red-700 transition"
            >
              Get Started
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

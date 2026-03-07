import Link from 'next/link'

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-scarlet/10 to-white">
      <div className="container mx-auto px-4 py-16">
        <h1 className="text-4xl md:text-6xl font-bold text-center text-scarlet mb-6">
          RutgersPlan
        </h1>
        <p className="text-xl text-center text-rutgers-gray mb-12">
          Build your perfect 4-year course plan at Rutgers University
        </p>
        <div className="max-w-md mx-auto">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Coming Soon</h2>
            <p className="mb-6">
              RutgersPlan is under development. We&apos;re building a smarter way to plan your college career.
            </p>
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

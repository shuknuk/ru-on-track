import Link from 'next/link'

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="text-xl font-bold text-scarlet">
          RutgersPlan
        </Link>
        <div className="space-x-4">
          <Link href="/dashboard" className="text-gray-700 hover:text-scarlet">
            Dashboard
          </Link>
          <Link href="/settings" className="text-gray-700 hover:text-scarlet">
            Settings
          </Link>
        </div>
      </div>
    </nav>
  )
}

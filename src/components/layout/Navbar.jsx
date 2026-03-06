export default function Navbar() {
  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <a href="/" className="text-xl font-bold text-scarlet">
          RutgersPlan
        </a>
        <div className="space-x-4">
          <a href="/dashboard" className="text-gray-700 hover:text-scarlet">
            Dashboard
          </a>
          <a href="/settings" className="text-gray-700 hover:text-scarlet">
            Settings
          </a>
        </div>
      </div>
    </nav>
  )
}
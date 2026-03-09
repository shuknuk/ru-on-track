import Link from 'next/link'

export default function Sidebar() {
  const menuItems = [
    { label: 'Dashboard', path: '/dashboard' },
    { label: '4-Year Planner', path: '/planner' },
    { label: 'Easy A Finder', path: '/easyA' },
    { label: 'Professor Ratings', path: '/professors' },
    { label: 'Debug Playground', path: '/debug' },
    { label: 'Settings', path: '/settings' },
  ]

  return (
    <div className="w-64 bg-white shadow-lg min-h-screen p-6">
      <h2 className="text-lg font-bold text-scarlet mb-8">Navigation</h2>
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              href={item.path}
              className="block py-2 px-4 text-gray-700 hover:bg-scarlet/10 hover:text-scarlet rounded-lg transition"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}

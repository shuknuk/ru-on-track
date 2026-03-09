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
    <aside className="w-72 border-r border-border bg-background p-6">
      <h2 className="font-mono text-xs font-semibold tracking-[0.2em] text-muted-foreground mb-8">NAVIGATION</h2>
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.path}>
            <Link
              href={item.path}
              className="group block border border-transparent px-4 py-3 text-sm uppercase tracking-[0.08em] text-muted-foreground transition-all duration-150 hover:border-border hover:text-foreground"
            >
              <span className="relative inline-block after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:scale-x-0 after:bg-accent after:transition-transform after:duration-150 group-hover:after:scale-x-100">
                {item.label}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  )
}

import Link from 'next/link'

const variants = {
  primary: 'text-[var(--accent)]',
  outline: 'border border-[var(--foreground)] px-6 text-[var(--foreground)] hover:bg-[var(--foreground)] hover:text-[var(--background)]',
  ghost: 'px-4 text-[var(--muted-foreground)] hover:text-[var(--foreground)]',
}

const sizes = {
  sm: 'py-2 text-sm',
  md: 'py-3 text-sm',
  lg: 'py-4 text-base',
}

function sharedClasses(variant, size, className = '') {
  const underline =
    variant === 'primary'
      ? 'after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:origin-left after:bg-[var(--accent)] after:transition-transform after:duration-150 hover:after:scale-x-110'
      : variant === 'ghost'
        ? 'after:absolute after:bottom-0 after:left-0 after:h-px after:w-full after:origin-left after:scale-x-0 after:bg-current after:transition-transform after:duration-150 hover:after:scale-x-100'
        : ''

  return [
    'relative inline-flex items-center justify-center gap-2 whitespace-nowrap uppercase tracking-[0.1em] font-semibold transition-all duration-150 ease-[cubic-bezier(0.25,0,0,1)] active:translate-y-px',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--background)]',
    'disabled:pointer-events-none disabled:opacity-50',
    variants[variant],
    sizes[size],
    underline,
    className,
  ].join(' ')
}

export function Button({ variant = 'primary', size = 'md', className = '', children, ...props }) {
  return (
    <button className={sharedClasses(variant, size, className)} {...props}>
      {children}
    </button>
  )
}

export function ButtonLink({ href, variant = 'primary', size = 'md', className = '', children, ...props }) {
  return (
    <Link href={href} className={sharedClasses(variant, size, className)} {...props}>
      {children}
    </Link>
  )
}

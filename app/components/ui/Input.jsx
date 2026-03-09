export function Input({ className = '', ...props }) {
  return (
    <input
      className={[
        'h-12 w-full border border-[var(--border)] bg-[var(--input)] px-4 text-base text-[var(--foreground)] outline-none transition-colors duration-150',
        'placeholder:text-[var(--muted-foreground)] focus:border-[var(--accent)] disabled:cursor-not-allowed disabled:opacity-50',
        className,
      ].join(' ')}
      {...props}
    />
  )
}

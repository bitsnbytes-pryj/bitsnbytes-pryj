import { cn } from '@/lib/utils'

type PageBackgroundProps = {
  className?: string
}

export function PageBackground({ className }: PageBackgroundProps) {
  return (
    <div aria-hidden className={cn('pointer-events-none fixed inset-0 z-0 overflow-hidden', className)}>
      <div
        className={cn(
          'absolute inset-0 bg-[#f7f2ff] transition-colors duration-500',
          'dark:bg-[#0e061d]',
        )}
      />
      <div className="absolute inset-0 opacity-60 mix-blend-soft-light bg-grid-faint" />
      <div className="absolute inset-0 opacity-50 bg-noise-texture" />
      <div
        className="absolute left-1/2 top-1/4 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 opacity-20"
        style={{
          background: 'radial-gradient(circle, var(--accent) 0%, transparent 60%)'
        }}
      />
      <div
        className="absolute left-1/4 bottom-[-10%] h-[50rem] w-[50rem] -translate-x-1/2 opacity-20"
        style={{
          background: 'radial-gradient(circle, var(--primary) 0%, transparent 60%)'
        }}
      />
    </div>
  )
}

export default PageBackground


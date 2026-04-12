import { cn } from '@/lib/utils'

type PageBackgroundProps = {
  className?: string
}

export function PageBackground({ className }: PageBackgroundProps) {
  return (
    <div aria-hidden className={cn('pointer-events-none fixed inset-0 z-0 overflow-hidden', className)}>
      <div
        className={cn(
          'absolute inset-0 bg-[#06131d] transition-colors duration-500',
          'dark:bg-[#06131d]',
        )}
      />
      <div className="absolute inset-0 opacity-60 mix-blend-soft-light bg-grid-faint" />
      <div className="absolute inset-0 opacity-50 bg-noise-texture" />
      <div
        className="absolute left-1/2 top-1/4 h-[40rem] w-[40rem] -translate-x-1/2 -translate-y-1/2 opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(79, 198, 192, 0.22) 0%, transparent 62%)'
        }}
      />
      <div
        className="absolute left-1/4 bottom-[-10%] h-[50rem] w-[50rem] -translate-x-1/2 opacity-20"
        style={{
          background: 'radial-gradient(circle, rgba(212, 154, 58, 0.14) 0%, transparent 62%)'
        }}
      />
    </div>
  )
}

export default PageBackground

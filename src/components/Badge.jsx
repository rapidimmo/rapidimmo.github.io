import { cn } from '../utils/helpers'

const VARIANTS = {
  primary: 'bg-primary-50 text-primary-800',
  secondary: 'bg-secondary-100 text-secondary-700',
  gray: 'bg-gray-100 text-gray-700',
  green: 'bg-primary-900 text-white',
  new: 'bg-secondary text-primary-950',
  glass: 'bg-white/90 text-primary-950 backdrop-blur shadow-sm',
}

export default function Badge({ children, variant = 'gray', className }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide',
        VARIANTS[variant] || VARIANTS.gray,
        className
      )}
    >
      {children}
    </span>
  )
}

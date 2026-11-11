import { cn } from '../utils/helpers'

const BASE = import.meta.env.BASE_URL

/** Logo officiel RapidImmo (fond transparent). Hauteur pilotée par className (ex: h-11). */
export default function Logo({ className, ...props }) {
  return (
    <picture>
      <source srcSet={`${BASE}logo.webp`} type="image/webp" />
      <img
        src={`${BASE}logo.png`}
        alt="RapidImmo"
        width="720"
        height="323"
        className={cn('h-10 w-auto select-none', className)}
        draggable="false"
        {...props}
      />
    </picture>
  )
}

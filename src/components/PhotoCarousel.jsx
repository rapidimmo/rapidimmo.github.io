import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../utils/helpers'

const PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="500"><rect width="800" height="500" fill="#E3E9F7"/><text x="50%" y="50%" fill="#93A9DE" font-family="sans-serif" font-size="28" font-weight="700" text-anchor="middle" dominant-baseline="middle">Aucune photo</text></svg>`
  )

export default function PhotoCarousel({ photos = [], titre = '' }) {
  const images = photos.length ? photos : [PLACEHOLDER]
  const [index, setIndex] = useState(0)

  const prev = () => setIndex((i) => (i - 1 + images.length) % images.length)
  const next = () => setIndex((i) => (i + 1) % images.length)

  // Navigation clavier ← →
  useEffect(() => {
    if (images.length < 2) return
    const onKey = (e) => {
      if (e.key === 'ArrowLeft') prev()
      if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length])

  const navBtn =
    'absolute top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-primary-950 shadow-soft backdrop-blur transition-all hover:scale-105 hover:bg-white sm:opacity-0 sm:group-hover:opacity-100'

  return (
    <div>
      <div className="group relative aspect-[16/10] w-full overflow-hidden rounded-3xl bg-primary-50">
        <img
          key={index}
          src={images[index]}
          alt={`${titre} — photo ${index + 1}`}
          className="h-full w-full animate-[fade-up_.4s_ease-out_both] object-cover"
          onError={(e) => {
            e.currentTarget.src = PLACEHOLDER
          }}
        />
        {images.length > 1 && (
          <>
            <button onClick={prev} aria-label="Photo précédente" className={cn(navBtn, 'left-4')}>
              <ChevronLeft size={22} />
            </button>
            <button onClick={next} aria-label="Photo suivante" className={cn(navBtn, 'right-4')}>
              <ChevronRight size={22} />
            </button>
            <div className="absolute bottom-4 right-4 rounded-full bg-primary-950/70 px-3 py-1 text-xs font-medium tracking-wide text-white backdrop-blur">
              {index + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="mt-3 flex gap-2.5 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              aria-label={`Photo ${i + 1}`}
              className={cn(
                'h-16 w-24 shrink-0 overflow-hidden rounded-xl ring-2 ring-offset-2 ring-offset-ivory transition-all',
                i === index ? 'ring-secondary' : 'ring-transparent opacity-60 hover:opacity-100'
              )}
            >
              <img
                src={src}
                alt=""
                className="h-full w-full object-cover"
                onError={(e) => {
                  e.currentTarget.src = PLACEHOLDER
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

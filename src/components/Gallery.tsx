import { useCallback, useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, Expand, X } from 'lucide-react'
import { clsx } from '../lib/format'

export default function Gallery({ images, title }: { images: string[]; title: string }) {
  const [index, setIndex] = useState(0)
  const [lightbox, setLightbox] = useState(false)

  const go = useCallback(
    (delta: number) => setIndex((current) => (current + delta + images.length) % images.length),
    [images.length],
  )

  useEffect(() => {
    if (!lightbox) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setLightbox(false)
      if (event.key === 'ArrowRight') go(1)
      if (event.key === 'ArrowLeft') go(-1)
    }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightbox, go])

  return (
    <>
      <div className="grid gap-2 md:grid-cols-[1.6fr_1fr]">
        <div className="group relative overflow-hidden rounded-3xl bg-ink-100 dark:bg-white/5">
          <img
            src={images[index]}
            alt={`${title} — photo ${index + 1}`}
            className="aspect-[4/3] w-full object-cover md:aspect-[16/11] md:h-full"
          />
          <button
            type="button"
            onClick={() => setLightbox(true)}
            className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-black/45 px-3 py-1.5 text-xs font-semibold text-white backdrop-blur transition hover:bg-black/65"
          >
            <Expand className="size-3.5" />
            {images.length} photos
          </button>
          <div className="pointer-events-none absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-3 opacity-0 transition group-hover:opacity-100">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className="pointer-events-auto grid size-10 place-items-center rounded-full bg-white/90 text-ink-900 shadow-md transition hover:bg-white"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className="pointer-events-auto grid size-10 place-items-center rounded-full bg-white/90 text-ink-900 shadow-md transition hover:bg-white"
            >
              <ChevronRight className="size-5" />
            </button>
          </div>
        </div>

        <div className="hidden grid-flow-col grid-rows-2 gap-2 md:grid md:grid-cols-2 md:grid-rows-2">
          {images.slice(1, 5).map((image, thumbIndex) => (
            <button
              key={image + thumbIndex}
              type="button"
              onClick={() => {
                setIndex(thumbIndex + 1)
                setLightbox(true)
              }}
              className="relative overflow-hidden rounded-2xl bg-ink-100 dark:bg-white/5"
            >
              <img
                src={image}
                alt=""
                loading="lazy"
                className="size-full object-cover transition duration-500 hover:scale-105"
              />
              {thumbIndex === 3 && images.length > 5 && (
                <span className="absolute inset-0 grid place-items-center bg-black/45 text-sm font-semibold text-white">
                  +{images.length - 5} more
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile thumbnail strip */}
      <div className="mt-2 flex gap-2 overflow-x-auto pb-1 no-scrollbar md:hidden">
        {images.map((image, thumbIndex) => (
          <button
            key={image + thumbIndex}
            type="button"
            onClick={() => setIndex(thumbIndex)}
            className={clsx(
              'size-16 shrink-0 overflow-hidden rounded-xl ring-2 transition',
              index === thumbIndex ? 'ring-ink-900 dark:ring-sand-100' : 'ring-transparent opacity-70',
            )}
          >
            <img src={image} alt="" className="size-full object-cover" loading="lazy" />
          </button>
        ))}
      </div>

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex flex-col bg-night-950/95 p-4 backdrop-blur"
          role="dialog"
          aria-modal="true"
          aria-label={`${title} photo viewer`}
        >
          <div className="flex items-center justify-between text-sand-100">
            <span className="text-sm">
              {index + 1} / {images.length}
            </span>
            <button
              type="button"
              onClick={() => setLightbox(false)}
              className="grid size-10 place-items-center rounded-full bg-white/10 transition hover:bg-white/20"
              aria-label="Close photo viewer"
            >
              <X className="size-5" />
            </button>
          </div>
          <div className="flex min-h-0 flex-1 items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Previous photo"
              className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <ChevronLeft className="size-6" />
            </button>
            <img
              src={images[index]}
              alt={`${title} — photo ${index + 1}`}
              className="max-h-full max-w-full rounded-2xl object-contain"
            />
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Next photo"
              className="grid size-11 shrink-0 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            >
              <ChevronRight className="size-6" />
            </button>
          </div>
          <div className="flex justify-center gap-2 overflow-x-auto pt-4 no-scrollbar">
            {images.map((image, thumbIndex) => (
              <button
                key={image + thumbIndex}
                type="button"
                onClick={() => setIndex(thumbIndex)}
                className={clsx(
                  'h-14 w-20 shrink-0 overflow-hidden rounded-lg ring-2 transition',
                  index === thumbIndex ? 'ring-sand-100' : 'ring-transparent opacity-60 hover:opacity-100',
                )}
              >
                <img src={image} alt="" className="size-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  )
}

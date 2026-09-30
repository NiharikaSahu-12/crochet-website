import { useCallback, useEffect, useState } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react'

// Fullscreen, keyboard-navigable product image viewer with zoom toggle.
export default function ImageLightbox({ images = [], index = 0, onIndexChange, onClose, alt = '' }) {
  const [zoomed, setZoomed] = useState(false)

  const goPrev = useCallback(() => {
    setZoomed(false)
    if (images.length > 1) onIndexChange((index - 1 + images.length) % images.length)
  }, [index, images.length, onIndexChange])

  const goNext = useCallback(() => {
    setZoomed(false)
    if (images.length > 1) onIndexChange((index + 1) % images.length)
  }, [index, images.length, onIndexChange])

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowLeft') goPrev()
      else if (e.key === 'ArrowRight') goNext()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [goPrev, goNext, onClose])

  // Reset zoom whenever the visible image changes.
  useEffect(() => {
    setZoomed(false)
  }, [index])

  return (
    <div
      className="fixed inset-0 z-[60] bg-night/95 overflow-hidden flex items-center justify-center select-none"
      role="dialog"
      aria-modal="true"
      aria-label="Product image viewer"
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
        aria-label="Close image viewer"
      >
        <X size={20} />
      </button>

      {/* Counter */}
      {images.length > 1 && (
        <span className="absolute top-5 left-1/2 -translate-x-1/2 font-mono text-xs text-white/70">
          {index + 1} / {images.length}
        </span>
      )}

      {/* Prev / Next */}
      {images.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation()
              goPrev()
            }}
            className="absolute left-3 sm:left-6 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Previous image"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation()
              goNext()
            }}
            className="absolute right-3 sm:right-6 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Next image"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* Main image — click to zoom in / out */}
      <img
        src={images[index] || images[0]}
        alt={alt}
        onClick={(e) => {
          e.stopPropagation()
          setZoomed((z) => !z)
        }}
        className={`max-h-[84vh] max-w-[92vw] rounded-xl object-contain shadow-float transition-transform duration-300 ease-out ${
          zoomed ? 'scale-[1.6] cursor-zoom-out' : 'scale-100 cursor-zoom-in'
        }`}
      />

      {/* Zoom control */}
      <button
        onClick={(e) => {
          e.stopPropagation()
          setZoomed((z) => !z)
        }}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-medium transition-colors"
      >
        {zoomed ? <ZoomOut size={14} /> : <ZoomIn size={14} />}
        <span>{zoomed ? 'Zoom out' : 'Zoom in'}</span>
      </button>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 flex gap-2 max-w-[90vw] overflow-x-auto px-2 pb-1">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={(e) => {
                e.stopPropagation()
                onIndexChange(i)
              }}
              className={`w-12 h-12 rounded-lg overflow-hidden border-2 shrink-0 transition-all ${
                i === index ? 'border-white' : 'border-transparent opacity-50 hover:opacity-90'
              }`}
            >
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

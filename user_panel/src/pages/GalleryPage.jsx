import { useState, useEffect } from 'react';
import { FaImages, FaTimes, FaChevronLeft, FaChevronRight, FaSearch } from 'react-icons/fa';
import { fetchGallery, getImageUrl } from '../api/config';
import PageBreadcrumb from '../components/PageBreadcrumb';
import EmptyState from '../components/EmptyState';
import { SkeletonGrid } from '../components/Skeleton';

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [lightbox, setLightbox] = useState(null);
  const [filter, setFilter] = useState('');
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchGallery()
      .then(data => {
        const items = Array.isArray(data) ? data : (data?.data || data?.images || []);
        setImages(items);
        const eventSet = [...new Set(items.map(img => img.event).filter(Boolean))];
        setEvents(eventSet);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = filter
    ? images.filter(img => img.event === filter)
    : images;

  const openLightbox = (index) => setLightbox(index);
  const closeLightbox = () => setLightbox(null);
  const prevImage = () => setLightbox(i => (i - 1 + filtered.length) % filtered.length);
  const nextImage = () => setLightbox(i => (i + 1) % filtered.length);

  useEffect(() => {
    const handler = (e) => {
      if (lightbox !== null) {
        if (e.key === 'Escape') closeLightbox();
        if (e.key === 'ArrowLeft') prevImage();
        if (e.key === 'ArrowRight') nextImage();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightbox]);

  const getGalleryImageUrl = (img) => {
    if (!img.image_name && !img.title) return null;
    const filename = img.image_name || img.title;
    const base = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace('/api', '');
    return `${base}/api/getgalleryimage/${filename}`;
  };

  return (
    <div>
      <PageBreadcrumb
        title="Photo Gallery"
        items={[
          { label: "Home", path: "/" },
          { label: "Photo Gallery" },
        ]}
      />

      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Filter tabs */}
          {events.length > 0 && (
            <div className="mb-8 flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('')}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                  !filter
                    ? 'bg-emerald-800 text-white shadow-md'
                    : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:-translate-y-0.5'
                }`}
              >
                All Photos
              </button>
              {events.map(event => (
                <button
                  key={event}
                  onClick={() => setFilter(event)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition-all ${
                    filter === event
                      ? 'bg-emerald-800 text-white shadow-md'
                      : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:-translate-y-0.5'
                  }`}
                >
                  {event}
                </button>
              ))}
            </div>
          )}

          {/* Skeleton */}
          {loading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="skeleton-shimmer aspect-square rounded-[1.6rem]" />
              ))}
            </div>
          )}

          {/* Empty */}
          {!loading && filtered.length === 0 && (
            <EmptyState icon={FaImages} title="No photos available." />
          )}

          {/* Grid */}
          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((img, i) => (
                <div
                  key={img.id || i}
                  className="group relative aspect-square cursor-pointer overflow-hidden rounded-[1.6rem] border border-emerald-100 bg-emerald-50 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                  onClick={() => openLightbox(i)}
                >
                  <img
                    src={getGalleryImageUrl(img)}
                    alt={img.event || 'Gallery image'}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                    onError={e => {
                      e.target.style.display = 'none';
                      e.target.parentElement.classList.add('bg-emerald-800');
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all duration-300 group-hover:bg-black/40">
                    <FaImages className="text-3xl text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                  </div>
                  {img.event && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent px-3 py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <p className="text-xs font-medium text-white truncate">{img.event}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && filtered[lightbox] && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm"
          onClick={closeLightbox}
        >
          <button
            className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
            onClick={closeLightbox}
            aria-label="Close lightbox"
          >
            <FaTimes />
          </button>
          <button
            className="absolute left-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
            onClick={e => { e.stopPropagation(); prevImage(); }}
            aria-label="Previous image"
          >
            <FaChevronLeft />
          </button>
          <button
            className="absolute right-4 top-1/2 z-10 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-sm transition hover:bg-white/20"
            onClick={e => { e.stopPropagation(); nextImage(); }}
            aria-label="Next image"
          >
            <FaChevronRight />
          </button>
          <img
            src={getGalleryImageUrl(filtered[lightbox])}
            alt=""
            className="max-h-[85vh] max-w-[90vw] rounded-xl object-contain shadow-2xl"
            onClick={e => e.stopPropagation()}
          />
          <div className="absolute bottom-6 left-0 right-0 text-center text-sm text-white/60">
            {lightbox + 1} / {filtered.length}
          </div>
        </div>
      )}
    </div>
  );
}

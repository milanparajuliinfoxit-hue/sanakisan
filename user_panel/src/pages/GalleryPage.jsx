import { useState, useEffect } from 'react';
import { FaImages, FaTimes, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { fetchGallery, getImageUrl } from '../api/config';
import PageBanner from '../components/PageBanner';

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
      <PageBanner title="Photo Gallery" subtitle="Moments from our cooperative activities & events" breadcrumb="Home › Gallery" eyebrow="Visual stories" />

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          {/* Filter tabs */}
          {events.length > 0 && (
            <div className="mb-8 flex flex-wrap gap-2">
              <button
                onClick={() => setFilter('')}
                className={`rounded-full px-4 py-2 text-sm font-semibold transition ${!filter ? 'bg-emerald-800 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
              >
                All Photos
              </button>
              {events.map(event => (
                <button
                  key={event}
                  onClick={() => setFilter(event)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${filter === event ? 'bg-emerald-800 text-white' : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                >
                  {event}
                </button>
              ))}
            </div>
          )}

          {loading && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="aspect-square animate-pulse rounded-3xl bg-emerald-100" />
              ))}
            </div>
          )}

          {!loading && filtered.length === 0 && (
            <div className="rounded-[2rem] border border-emerald-100 bg-emerald-50/70 py-16 text-center text-slate-500">
              <FaImages className="mx-auto mb-3 text-5xl opacity-20" />
              <p>No photos available.</p>
            </div>
          )}

          {!loading && filtered.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {filtered.map((img, i) => (
                <div
                  key={img.id || i}
                  className="group relative aspect-square cursor-pointer overflow-hidden rounded-3xl border border-emerald-100 bg-emerald-100"
                  onClick={() => openLightbox(i)}
                >
                  <img
                    src={getGalleryImageUrl(img)}
                    alt={img.event || 'Gallery'}
                    className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    onError={e => {
                      e.target.parentNode.classList.add('bg-emerald-800');
                      e.target.style.display = 'none';
                    }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center bg-black/0 transition-all group-hover:bg-black/30">
                    <FaImages className="text-3xl text-white opacity-0 transition-opacity group-hover:opacity-100" />
                  </div>
                  {img.event && (
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent px-3 py-2 opacity-0 transition-opacity group-hover:opacity-100">
                      <p className="truncate text-xs text-white">{img.event}</p>
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
          className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300" onClick={closeLightbox}>
            <FaTimes />
          </button>
          <button className="absolute left-4 top-1/2 -translate-y-1/2 text-white text-3xl hover:text-gray-300 bg-white/10 rounded-full p-2" onClick={e => { e.stopPropagation(); prevImage(); }}>
            <FaChevronLeft />
          </button>
          <button className="absolute right-4 top-1/2 -translate-y-1/2 text-white text-3xl hover:text-gray-300 bg-white/10 rounded-full p-2" onClick={e => { e.stopPropagation(); nextImage(); }}>
            <FaChevronRight />
          </button>
          <img
            src={getGalleryImageUrl(filtered[lightbox])}
            alt=""
            className="max-w-[90vw] max-h-[90vh] object-contain rounded-lg"
            onClick={e => e.stopPropagation()}
          />
          <div className="absolute bottom-4 left-0 right-0 text-center text-white text-sm opacity-60">
            {lightbox + 1} / {filtered.length}
          </div>
        </div>
      )}
    </div>
  );
}
